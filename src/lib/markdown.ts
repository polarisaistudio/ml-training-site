/**
 * Markdown parsing utilities for question content
 * Extracts sections (Question, Answer, Hints, Learning Resources) from markdown
 */

/**
 * Convert a problem title to a LeetCode URL slug
 * e.g., "Reverse Linked List II" -> "reverse-linked-list-ii"
 */
function titleToLeetcodeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}

export interface Hint {
  level: number;
  content: string;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface ParsedMarkdownSections {
  question: string;
  hints: Hint[];
  answer: string;
  learningResources: string;
  testCases: TestCase[];
}

export interface LearningResource {
  title: string;
  url: string;
}

export interface RelatedProblem {
  title: string;
  url?: string;
  leetcodeNumber?: number;
}

export interface ParsedLearningResources {
  videos: LearningResource[];
  articles: LearningResource[];
  relatedProblems: RelatedProblem[];
}

/**
 * Parse markdown content into sections based on ## headings
 */
export function parseMarkdownSections(content: string): ParsedMarkdownSections {
  const sections: ParsedMarkdownSections = {
    question: "",
    hints: [],
    answer: "",
    learningResources: "",
    testCases: [],
  };

  if (!content) return sections;

  // Match sections using regex
  const questionMatch = content.match(
    /## Question\s*([\s\S]*?)(?=## Hints|## Answer|## Learning Resources|$)/i,
  );
  const hintsMatch = content.match(
    /## Hints\s*([\s\S]*?)(?=## Answer|## Learning Resources|$)/i,
  );
  const answerMatch = content.match(
    /## Answer\s*([\s\S]*?)(?=## Learning Resources|$)/i,
  );
  const resourcesMatch = content.match(/## Learning Resources\s*([\s\S]*?)$/i);

  if (questionMatch) {
    sections.question = questionMatch[1].trim();
    // Extract test cases from question section
    sections.testCases = extractTestCases(questionMatch[1]);
  }

  if (hintsMatch) {
    sections.hints = parseHints(hintsMatch[1]);
  }

  if (answerMatch) {
    sections.answer = answerMatch[1].trim();
  }

  if (resourcesMatch) {
    sections.learningResources = resourcesMatch[1].trim();
  }

  return sections;
}

/**
 * Parse hints from the Hints section
 */
export function parseHints(hintsMarkdown: string): Hint[] {
  const hints: Hint[] = [];

  if (!hintsMarkdown) return hints;

  // Match ### Hint N patterns
  const hintRegex = /### Hint (\d+)\s*([\s\S]*?)(?=### Hint \d+|$)/gi;
  let match;

  while ((match = hintRegex.exec(hintsMarkdown)) !== null) {
    const level = parseInt(match[1], 10);
    const content = match[2].trim();
    if (content) {
      hints.push({ level, content });
    }
  }

  // Sort by level
  hints.sort((a, b) => a.level - b.level);

  return hints;
}

/**
 * Extract test cases from question content
 * Looks for **Example N:** patterns followed by code blocks or formatted content
 */
export function extractTestCases(questionContent: string): TestCase[] {
  const testCases: TestCase[] = [];

  if (!questionContent) return testCases;

  // Match **Example N:** followed by content (with or without code blocks)
  const exampleRegex =
    /\*\*Example\s*\d+:?\*\*\s*(?:```[^\n]*\n)?([\s\S]*?)(?:```)?(?=\*\*Example\s*\d+|(?:\*\*Constraints|\*\*Follow-up|\*\*Note|##|$))/gi;
  let match;

  while ((match = exampleRegex.exec(questionContent)) !== null) {
    const content = match[1].trim();

    // Parse Input, Output, Explanation from the content
    const inputMatch = content.match(/Input:\s*(.+?)(?=\n|Output:|$)/i);
    const outputMatch = content.match(/Output:\s*(.+?)(?=\n|Explanation:|$)/i);
    const explanationMatch = content.match(/Explanation:\s*(.+?)$/im);

    if (inputMatch && outputMatch) {
      testCases.push({
        input: inputMatch[1].trim(),
        output: outputMatch[1].trim(),
        explanation: explanationMatch ? explanationMatch[1].trim() : undefined,
      });
    }
  }

  return testCases;
}

/**
 * Parse learning resources section into structured data
 */
export function parseLearningResources(
  resourcesMarkdown: string,
): ParsedLearningResources {
  const result: ParsedLearningResources = {
    videos: [],
    articles: [],
    relatedProblems: [],
  };

  if (!resourcesMarkdown) return result;

  // Split by subsections
  const videoMatch = resourcesMarkdown.match(
    /\*\*Video[s]?:\*\*\s*([\s\S]*?)(?=\*\*Article|$)/i,
  );
  const articleMatch = resourcesMarkdown.match(
    /\*\*Article[s]?:\*\*\s*([\s\S]*?)(?=\*\*Related|$)/i,
  );
  const relatedMatch = resourcesMarkdown.match(
    /\*\*Related Problems?:\*\*\s*([\s\S]*?)$/i,
  );

  // Parse links from markdown format: - [Title](URL)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  if (videoMatch) {
    let match;
    while ((match = linkRegex.exec(videoMatch[1])) !== null) {
      result.videos.push({ title: match[1], url: match[2] });
    }
  }

  if (articleMatch) {
    let match;
    linkRegex.lastIndex = 0; // Reset regex
    while ((match = linkRegex.exec(articleMatch[1])) !== null) {
      result.articles.push({ title: match[1], url: match[2] });
    }
  }

  if (relatedMatch) {
    // Parse related problems - extract LeetCode numbers and create links
    const lines = relatedMatch[1]
      .split("\n")
      .filter((line) => line.trim().startsWith("-"));
    for (const line of lines) {
      // Remove the leading "- " and trim
      const problem = line.replace(/^-\s*/, "").trim();
      if (problem) {
        // Check if it already has a markdown link
        const existingLinkMatch = problem.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (existingLinkMatch) {
          result.relatedProblems.push({
            title: existingLinkMatch[1],
            url: existingLinkMatch[2],
          });
        } else {
          // Try to extract LeetCode number from formats like "(LeetCode #92)" or "(#92)"
          const leetcodeMatch = problem.match(/\((?:LeetCode\s*)?#(\d+)\)/i);
          if (leetcodeMatch) {
            const leetcodeNumber = parseInt(leetcodeMatch[1], 10);
            // Remove the LeetCode reference from the title for cleaner display
            const title = problem
              .replace(/\s*\((?:LeetCode\s*)?#\d+\)\s*/, "")
              .trim();
            result.relatedProblems.push({
              title: title || problem,
              url: `https://leetcode.com/problems/${titleToLeetcodeSlug(title)}/`,
              leetcodeNumber,
            });
          } else {
            // No LeetCode number found, just store as plain text
            result.relatedProblems.push({ title: problem });
          }
        }
      }
    }
  }

  return result;
}

/**
 * Extract just the answer section from the full content
 * This is used when answer is stored separately but includes Learning Resources
 */
export function extractAnswerWithoutResources(answer: string): string {
  if (!answer) return "";

  // Remove Learning Resources section if present
  const resourcesStart = answer.indexOf("## Learning Resources");
  if (resourcesStart !== -1) {
    return answer.substring(0, resourcesStart).trim();
  }

  return answer.trim();
}

/**
 * Extract Learning Resources from answer field
 */
export function extractLearningResourcesFromAnswer(answer: string): string {
  if (!answer) return "";

  const resourcesMatch = answer.match(/## Learning Resources\s*([\s\S]*?)$/i);
  return resourcesMatch ? resourcesMatch[1].trim() : "";
}
