import Link from "next/link";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getCoverLetterGuide() {
  const filePath = path.join(
    process.cwd(),
    "src/data/resume-ready/cover-letter-guide.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");
  return content;
}

export default async function CoverLetterGuidePage() {
  const guideContent = await getCoverLetterGuide();

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
        <span className="text-sm text-gray-900">Cover Letter Guide</span>
      </nav>

      {/* Guide Content */}
      <article className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h2:mt-10 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-pink-600 prose-code:before:content-[''] prose-code:after:content-[''] prose-table:border prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideContent}</ReactMarkdown>
      </article>

      {/* Back Link */}
      <div className="mt-12 pt-8 border-t text-center">
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
