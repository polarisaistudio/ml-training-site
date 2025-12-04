import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import { config } from "dotenv";
import {
  stages,
  contentTypes,
  contentItems,
  questions,
  RealInterviewDetails,
} from "../src/db/schema";

// Load environment variables
config({ path: ".env.local" });

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Type definitions
interface FrontmatterData {
  title: string;
  type: string;
  stage: string;
  difficulty?: "easy" | "medium" | "hard";
  verified?: boolean;
  tags?: string[];
  source?: string;
  sourceType?: "generated" | "real-interview";
  realInterviewDetails?: RealInterviewDetails;
}

interface ParsedContent {
  frontmatter: FrontmatterData;
  question: string;
  answer: string;
  learningResources: string;
  filePath: string;
}

interface CLIOptions {
  dryRun: boolean;
  force: boolean;
  contentPath: string;
}

interface ImportResult {
  file: string;
  title: string;
  status: "created" | "updated" | "skipped" | "error";
  message?: string;
}

// Type mapping from user-friendly names to database slugs
const TYPE_MAPPING: Record<string, string> = {
  algorithm: "algorithm_problem",
  ml_concept: "ml_concept",
  "ml-concept": "ml_concept",
  ml_coding: "ml_coding",
  "ml-coding": "ml_coding",
  system_design: "system_design",
  "system-design": "system_design",
  behavioral: "bq_question",
  project: "guided_project",
};

/**
 * Parse command line arguments
 */
function parseCliArgs(): CLIOptions {
  const args = process.argv.slice(2);

  const getArgValue = (flag: string): string | null => {
    const index = args.indexOf(flag);
    if (index !== -1 && args[index + 1] && !args[index + 1].startsWith("--")) {
      return args[index + 1];
    }
    return null;
  };

  return {
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
    contentPath: getArgValue("--path") || "content/algorithms",
  };
}

/**
 * Parse a markdown file and extract frontmatter and content sections
 */
function parseMarkdownFile(filePath: string): ParsedContent {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Extract sections using regex
  const questionMatch = content.match(
    /## Question\s*([\s\S]*?)(?=## Answer|## Learning Resources|$)/i,
  );
  const answerMatch = content.match(
    /## Answer\s*([\s\S]*?)(?=## Learning Resources|$)/i,
  );
  const resourcesMatch = content.match(/## Learning Resources\s*([\s\S]*?)$/i);

  return {
    frontmatter: data as FrontmatterData,
    question: questionMatch ? questionMatch[1].trim() : "",
    answer: answerMatch ? answerMatch[1].trim() : "",
    learningResources: resourcesMatch ? resourcesMatch[1].trim() : "",
    filePath,
  };
}

/**
 * Validate frontmatter has required fields
 */
function validateFrontmatter(
  frontmatter: FrontmatterData,
  filePath: string,
): string | null {
  if (!frontmatter.title) {
    return `Missing required field: title`;
  }
  if (!frontmatter.type) {
    return `Missing required field: type`;
  }
  if (!frontmatter.stage) {
    return `Missing required field: stage`;
  }
  return null;
}

/**
 * Load stages and content types for ID lookup
 */
async function loadLookupTables() {
  const [stagesList, contentTypesList] = await Promise.all([
    db.select().from(stages),
    db.select().from(contentTypes),
  ]);

  const stageMap = new Map(stagesList.map((s) => [s.slug, s.id]));
  const contentTypeMap = new Map(
    contentTypesList.map((ct) => [ct.slug, ct.id]),
  );

  return { stageMap, contentTypeMap };
}

/**
 * Map user-friendly type name to database content type slug
 */
function mapTypeToContentTypeSlug(type: string): string {
  return TYPE_MAPPING[type] || type;
}

/**
 * Find existing question by title and content type
 */
async function findExistingQuestion(title: string, contentTypeId: number) {
  const existing = await db
    .select({
      contentItemId: contentItems.id,
      questionId: questions.id,
    })
    .from(contentItems)
    .innerJoin(questions, eq(questions.contentItemId, contentItems.id))
    .where(
      and(
        eq(contentItems.title, title),
        eq(contentItems.contentTypeId, contentTypeId),
      ),
    )
    .limit(1);

  return existing[0] || null;
}

/**
 * Import a single question into the database
 */
async function importQuestion(
  parsed: ParsedContent,
  lookups: {
    stageMap: Map<string, number>;
    contentTypeMap: Map<string, number>;
  },
  options: CLIOptions,
): Promise<ImportResult> {
  const { frontmatter, question, answer, learningResources, filePath } = parsed;
  const fileName = path.basename(filePath);

  // Validate frontmatter
  const validationError = validateFrontmatter(frontmatter, filePath);
  if (validationError) {
    return {
      file: fileName,
      title: frontmatter.title || "Unknown",
      status: "error",
      message: validationError,
    };
  }

  // Resolve IDs from lookup tables
  const stageId = lookups.stageMap.get(frontmatter.stage);
  const contentTypeSlug = mapTypeToContentTypeSlug(frontmatter.type);
  const contentTypeId = lookups.contentTypeMap.get(contentTypeSlug);

  // Validation
  if (!stageId) {
    return {
      file: fileName,
      title: frontmatter.title,
      status: "error",
      message: `Unknown stage: "${frontmatter.stage}". Valid stages: ${Array.from(lookups.stageMap.keys()).join(", ")}`,
    };
  }
  if (!contentTypeId) {
    return {
      file: fileName,
      title: frontmatter.title,
      status: "error",
      message: `Unknown content type: "${frontmatter.type}" (mapped to "${contentTypeSlug}"). Valid types: ${Array.from(lookups.contentTypeMap.keys()).join(", ")}`,
    };
  }

  // Check for existing (idempotency)
  const existing = await findExistingQuestion(frontmatter.title, contentTypeId);

  if (existing && !options.force) {
    return {
      file: fileName,
      title: frontmatter.title,
      status: "skipped",
      message: "Already exists (use --force to update)",
    };
  }

  if (options.dryRun) {
    return {
      file: fileName,
      title: frontmatter.title,
      status: existing ? "updated" : "created",
      message: `[DRY RUN] Would ${existing ? "update" : "create"}`,
    };
  }

  // Combine answer with learning resources if present
  const fullAnswer = learningResources
    ? `${answer}\n\n## Learning Resources\n\n${learningResources}`
    : answer;

  // Prepare data
  const contentItemData = {
    title: frontmatter.title,
    stageId,
    contentTypeId,
    difficulty: frontmatter.difficulty || null,
    isAvailable: true,
    order: 0,
    updatedAt: new Date(),
  };

  const questionData = {
    content: question || null,
    answer: fullAnswer || null,
    sourceCompany: frontmatter.source || null,
    isVerified: frontmatter.verified || false,
    tags: frontmatter.tags ? JSON.stringify(frontmatter.tags) : null,
    sourceType: frontmatter.sourceType || "generated",
    realInterviewDetails: frontmatter.realInterviewDetails || null,
  };

  if (existing) {
    // UPDATE existing records
    await db
      .update(contentItems)
      .set(contentItemData)
      .where(eq(contentItems.id, existing.contentItemId));

    await db
      .update(questions)
      .set(questionData)
      .where(eq(questions.id, existing.questionId));

    return { file: fileName, title: frontmatter.title, status: "updated" };
  } else {
    // INSERT new records
    const [newContentItem] = await db
      .insert(contentItems)
      .values({
        ...contentItemData,
        createdAt: new Date(),
      })
      .returning();

    await db.insert(questions).values({
      ...questionData,
      contentItemId: newContentItem.id,
    });

    return { file: fileName, title: frontmatter.title, status: "created" };
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log("=== Markdown Content Import Script ===\n");

  const options = parseCliArgs();

  console.log("Options:");
  console.log(`  Content path: ${options.contentPath}`);
  console.log(`  Dry run: ${options.dryRun}`);
  console.log(`  Force update: ${options.force}\n`);

  // Validate content directory
  const contentDir = path.resolve(process.cwd(), options.contentPath);
  if (!fs.existsSync(contentDir)) {
    console.error(`Error: Content directory not found: ${contentDir}`);
    console.error(
      `\nPlease create the directory and add markdown files, or specify a different path with --path`,
    );
    process.exit(1);
  }

  // Load lookup tables
  console.log("Loading database lookup tables...");
  const lookups = await loadLookupTables();
  console.log(
    `  Found ${lookups.stageMap.size} stages: ${Array.from(lookups.stageMap.keys()).join(", ")}`,
  );
  console.log(`  Found ${lookups.contentTypeMap.size} content types\n`);

  // Find markdown files
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => path.join(contentDir, f));

  console.log(
    `Found ${files.length} markdown file(s) in ${options.contentPath}\n`,
  );

  if (files.length === 0) {
    console.log("No markdown files to import.");
    return;
  }

  // Process each file
  const results: ImportResult[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = `[${i + 1}/${total}]`;

    try {
      const parsed = parseMarkdownFile(file);
      const result = await importQuestion(parsed, lookups, options);
      results.push(result);

      const icon =
        result.status === "created"
          ? "+"
          : result.status === "updated"
            ? "~"
            : result.status === "skipped"
              ? "-"
              : "!";

      const statusColor =
        result.status === "created"
          ? "\x1b[32m" // green
          : result.status === "updated"
            ? "\x1b[33m" // yellow
            : result.status === "skipped"
              ? "\x1b[36m" // cyan
              : "\x1b[31m"; // red
      const reset = "\x1b[0m";

      console.log(
        `${progress} ${statusColor}[${icon}]${reset} ${result.title}${result.message ? ` - ${result.message}` : ""}`,
      );
    } catch (error) {
      const fileName = path.basename(file);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      results.push({
        file: fileName,
        title: "Unknown",
        status: "error",
        message: errorMessage,
      });
      console.log(
        `${progress} \x1b[31m[!]\x1b[0m ${fileName}: error - ${errorMessage}`,
      );
    }
  }

  // Summary
  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  console.log("\n=== Summary ===");
  console.log(`  \x1b[32mCreated:\x1b[0m ${created}`);
  console.log(`  \x1b[33mUpdated:\x1b[0m ${updated}`);
  console.log(`  \x1b[36mSkipped:\x1b[0m ${skipped}`);
  console.log(`  \x1b[31mErrors:\x1b[0m  ${errors}`);

  if (options.dryRun) {
    console.log(
      "\n\x1b[33m[DRY RUN]\x1b[0m No changes were made to the database.",
    );
  }

  // Exit with error code if there were errors
  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\nFatal error:", error);
  process.exit(1);
});
