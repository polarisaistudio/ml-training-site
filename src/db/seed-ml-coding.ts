import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { contentItems, contentTypes, questions, stages } from "./schema";
import { ML_CODING_PROBLEMS, type MLCodingProblem } from "../data/resume-ready/ml-coding-problems";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Format ML coding problem into markdown content (problem statement)
function formatProblemAsMarkdown(problem: MLCodingProblem): string {
  const examples = problem.examples
    .map(
      (ex, i) => `
### Example ${i + 1}
**Input:**
\`\`\`
${ex.input.trim()}
\`\`\`

**Output:**
\`\`\`
${ex.output.trim()}
\`\`\`
${ex.explanation ? `\n**Explanation:** ${ex.explanation}` : ""}`
    )
    .join("\n");

  const constraints = problem.constraints.map((c) => `- ${c}`).join("\n");

  return `## Problem

${problem.description.trim()}

## Constraints

${constraints}

## Examples
${examples}

## Function Signature

\`\`\`python
${problem.functionSignature.python.trim()}
\`\`\`

## Estimated Time

${problem.estimatedTime}

## Tags

${problem.tags.map((t) => `\`${t}\``).join(" ")}
`;
}

// Format solution and hints as the answer markdown
function formatAnswerAsMarkdown(problem: MLCodingProblem): string {
  const hintsSection = problem.hints
    .map((hint) => {
      let hintText = `### Hint ${hint.level}\n\n${hint.hint}`;
      if (hint.codeSnippet) {
        hintText += `\n\n\`\`\`python\n${hint.codeSnippet.trim()}\n\`\`\``;
      }
      return hintText;
    })
    .join("\n\n");

  const keyInsights = problem.solutionApproach.keyInsights
    .map((i) => `- ${i}`)
    .join("\n");

  const followUps = problem.followUps
    ? problem.followUps.map((f) => `- ${f}`).join("\n")
    : "";

  const relatedConcepts = problem.relatedConcepts
    .map((c) => `\`${c}\``)
    .join(" ");

  return `## Progressive Hints

${hintsSection}

---

## Solution Approach

### Intuition

${problem.solutionApproach.intuition}

### Algorithm

\`\`\`
${problem.solutionApproach.algorithm.trim()}
\`\`\`

### Complexity

- **Time:** ${problem.solutionApproach.complexity.time}
- **Space:** ${problem.solutionApproach.complexity.space}

### Key Insights

${keyInsights}

---

## Solution

\`\`\`python
${problem.solution.python.trim()}
\`\`\`

## Explanation

${problem.solution.explanation.trim()}

---

## Follow-up Questions

${followUps}

## Related Concepts

${relatedConcepts}
`;
}

async function seedMLCoding() {
  console.log("Seeding ML Coding Problems...");

  // Get the ml_coding content type
  const mlCodingType = await db
    .select()
    .from(contentTypes)
    .where(eq(contentTypes.slug, "ml_coding"))
    .limit(1);

  if (!mlCodingType[0]) {
    console.error("ml_coding content type not found. Run seed.ts first.");
    return;
  }

  // Get the ml-ready stage
  const mlReadyStage = await db
    .select()
    .from(stages)
    .where(eq(stages.slug, "ml-ready"))
    .limit(1);

  if (!mlReadyStage[0]) {
    console.error("ml-ready stage not found. Run seed.ts first.");
    return;
  }

  const contentTypeId = mlCodingType[0].id;
  const stageId = mlReadyStage[0].id;

  for (let i = 0; i < ML_CODING_PROBLEMS.length; i++) {
    const problem = ML_CODING_PROBLEMS[i];
    console.log(`Adding: ${problem.title}`);

    // Check if content item already exists
    const existing = await db
      .select()
      .from(contentItems)
      .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
      .where(eq(contentItems.title, problem.title))
      .limit(1);

    if (existing[0]) {
      console.log(`  Skipping (already exists): ${problem.title}`);
      continue;
    }

    // Insert content item
    const [contentItem] = await db
      .insert(contentItems)
      .values({
        stageId: stageId,
        contentTypeId: contentTypeId,
        title: problem.title,
        description: `ML Coding: ${problem.category} | ${problem.estimatedTime}`,
        difficulty: problem.difficulty,
        isAvailable: true,
        order: 200 + i, // Start at 200 to not conflict with ML concepts (which start at 100)
      })
      .returning();

    // Insert question with problem content and solution as answer
    await db.insert(questions).values({
      contentItemId: contentItem.id,
      content: formatProblemAsMarkdown(problem),
      answer: formatAnswerAsMarkdown(problem),
      tags: JSON.stringify(problem.tags),
      sourceType: "generated",
    });

    console.log(`  Added: ${problem.title}`);
  }

  console.log("ML Coding Problems seeding complete!");
}

seedMLCoding().catch(console.error);
