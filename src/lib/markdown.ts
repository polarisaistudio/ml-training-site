/**
 * Markdown parsing utilities for question content
 * Extracts sections (Question, Answer, Learning Resources) from markdown
 */

export interface ParsedMarkdownSections {
  question: string;
  answer: string;
  learningResources: string;
}

export interface LearningResource {
  title: string;
  url: string;
}

export interface ParsedLearningResources {
  videos: LearningResource[];
  articles: LearningResource[];
  relatedProblems: string[];
}

/**
 * Parse markdown content into sections based on ## headings
 */
export function parseMarkdownSections(content: string): ParsedMarkdownSections {
  const sections: ParsedMarkdownSections = {
    question: '',
    answer: '',
    learningResources: '',
  };

  if (!content) return sections;

  // Match sections using regex
  const questionMatch = content.match(/## Question\s*([\s\S]*?)(?=## Answer|## Learning Resources|$)/i);
  const answerMatch = content.match(/## Answer\s*([\s\S]*?)(?=## Learning Resources|$)/i);
  const resourcesMatch = content.match(/## Learning Resources\s*([\s\S]*?)$/i);

  if (questionMatch) {
    sections.question = questionMatch[1].trim();
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
 * Parse learning resources section into structured data
 */
export function parseLearningResources(resourcesMarkdown: string): ParsedLearningResources {
  const result: ParsedLearningResources = {
    videos: [],
    articles: [],
    relatedProblems: [],
  };

  if (!resourcesMarkdown) return result;

  // Split by subsections
  const videoMatch = resourcesMarkdown.match(/\*\*Video[s]?:\*\*\s*([\s\S]*?)(?=\*\*Article|$)/i);
  const articleMatch = resourcesMarkdown.match(/\*\*Article[s]?:\*\*\s*([\s\S]*?)(?=\*\*Related|$)/i);
  const relatedMatch = resourcesMarkdown.match(/\*\*Related Problems?:\*\*\s*([\s\S]*?)$/i);

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
    // Parse related problems - they may or may not have links
    const lines = relatedMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
    for (const line of lines) {
      // Remove the leading "- " and trim
      const problem = line.replace(/^-\s*/, '').trim();
      if (problem) {
        result.relatedProblems.push(problem);
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
  if (!answer) return '';

  // Remove Learning Resources section if present
  const resourcesStart = answer.indexOf('## Learning Resources');
  if (resourcesStart !== -1) {
    return answer.substring(0, resourcesStart).trim();
  }

  return answer.trim();
}

/**
 * Extract Learning Resources from answer field
 */
export function extractLearningResourcesFromAnswer(answer: string): string {
  if (!answer) return '';

  const resourcesMatch = answer.match(/## Learning Resources\s*([\s\S]*?)$/i);
  return resourcesMatch ? resourcesMatch[1].trim() : '';
}
