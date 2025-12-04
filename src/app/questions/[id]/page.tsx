import { notFound } from "next/navigation";
import Link from "next/link";
import { db, contentItems, contentTypes, questions, stages } from "@/db";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/Badge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getDifficultyColor, formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AnswerSection } from "@/components/AnswerSection";
import { CodeEditor } from "@/components/CodeEditor";
import { QuestionActions } from "@/components/QuestionActions";
import { LearningResources } from "@/components/LearningResources";
import {
  extractAnswerWithoutResources,
  extractLearningResourcesFromAnswer,
} from "@/lib/markdown";

interface Props {
  params: Promise<{ id: string }>;
}

async function getQuestion(id: number) {
  const result = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      updatedAt: contentItems.updatedAt,
      contentType: {
        slug: contentTypes.slug,
        name: contentTypes.name,
      },
      stage: {
        slug: stages.slug,
        name: stages.name,
      },
      question: {
        id: questions.id,
        content: questions.content,
        answer: questions.answer,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
        tags: questions.tags,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .where(eq(contentItems.id, id))
    .limit(1);

  return result[0] || null;
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;
  const questionId = parseInt(id, 10);

  if (isNaN(questionId)) {
    notFound();
  }

  const item = await getQuestion(questionId);

  if (!item || !item.isAvailable) {
    notFound();
  }

  const tags = item.question.tags ? JSON.parse(item.question.tags) : [];

  // Extract answer and learning resources separately
  const answerContent = extractAnswerWithoutResources(
    item.question.answer || "",
  );
  const learningResourcesContent = extractLearningResourcesFromAnswer(
    item.question.answer || "",
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/questions"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Questions
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {item.difficulty && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(item.difficulty)}`}
            >
              {item.difficulty.charAt(0).toUpperCase() +
                item.difficulty.slice(1)}
            </span>
          )}
          {item.question.isVerified && <VerifiedBadge />}
          {item.contentType?.name && (
            <Badge variant="default">{item.contentType.name}</Badge>
          )}
          {item.stage?.name && <Badge variant="info">{item.stage.name}</Badge>}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">{item.title}</h1>

        {item.description && (
          <p className="text-lg text-gray-600 mb-4">{item.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {item.question.sourceCompany && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{item.question.sourceCompany}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Updated {formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </header>

      <hr className="my-8 border-gray-200" />

      {/* Question Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Question
        </h2>
        {item.question.content ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <MarkdownRenderer content={item.question.content} />
          </div>
        ) : (
          <p className="text-gray-500 italic">Question content coming soon.</p>
        )}
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Code Editor */}
      <section className="mb-8">
        <CodeEditor questionId={item.question.id} />
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Answer Section (Hidden by Default) */}
      <section className="mb-8">
        <AnswerSection answer={answerContent} questionId={item.question.id} />
      </section>

      {/* Learning Resources */}
      {learningResourcesContent && (
        <>
          <hr className="my-8 border-gray-200" />
          <section className="mb-8">
            <LearningResources resourcesMarkdown={learningResourcesContent} />
          </section>
        </>
      )}

      {/* Question Actions (Mark Complete, Notes, Timer) */}
      <QuestionActions questionId={item.question.id} />

      {/* Bottom Navigation */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link
          href="/questions"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Questions
        </Link>
      </div>
    </div>
  );
}
