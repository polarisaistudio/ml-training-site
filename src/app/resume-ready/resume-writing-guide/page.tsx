import Link from "next/link";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getResumeWritingGuide() {
  const filePath = path.join(
    process.cwd(),
    "src/data/resume-ready/resume-writing-guide.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");
  return content;
}

export default async function ResumeWritingGuidePage() {
  const guideContent = await getResumeWritingGuide();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href="/stages/resume-ready"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Resume Ready
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">Resume Writing Guide</span>
      </nav>

      {/* Guide Content */}
      <article className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h2:mt-10 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-pink-600 prose-code:before:content-[''] prose-code:after:content-[''] prose-table:border prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideContent}</ReactMarkdown>
      </article>

      {/* Action Buttons */}
      <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4">
        <Link
          href="/resume-ready/projects"
          className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Building Your Resume
        </Link>
        <Link
          href="/resume-ready/cover-letter-guide"
          className="flex-1 bg-gray-800 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors"
        >
          Cover Letter Guide
        </Link>
      </div>

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/stages/resume-ready"
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Resume Ready Dashboard
        </Link>
      </div>
    </div>
  );
}
