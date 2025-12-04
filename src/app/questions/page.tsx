import { Suspense } from "react";
import {
  db,
  contentItems,
  contentTypes,
  questions,
  stages,
  questionProgress,
  userSolutions,
} from "@/db";
import { eq, and } from "drizzle-orm";
import { EmptyState } from "@/components/EmptyState";
import { QuestionFilters } from "@/components/QuestionFilters";
import { RecommendedNext } from "@/components/RecommendedNext";
import { QuestionListItem } from "@/components/QuestionListItem";
import { getOrCreateSessionId } from "@/lib/session";

interface SearchParams {
  difficulty?: string;
  status?: string;
  tag?: string;
}

async function getAllQuestionsWithProgress(sessionId: string) {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      contentType: {
        name: contentTypes.name,
      },
      stage: {
        name: stages.name,
      },
      question: {
        id: questions.id,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
        tags: questions.tags,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .where(eq(contentItems.isAvailable, true))
    .orderBy(contentItems.order);

  // Fetch progress for all questions
  const progressRecords = await db
    .select()
    .from(questionProgress)
    .where(eq(questionProgress.sessionId, sessionId));

  // Fetch solutions for all questions
  const solutionRecords = await db
    .select({
      questionId: userSolutions.questionId,
    })
    .from(userSolutions)
    .where(eq(userSolutions.sessionId, sessionId));

  const progressMap = new Map(progressRecords.map((p) => [p.questionId, p]));
  const solutionSet = new Set(solutionRecords.map((s) => s.questionId));

  return items.map((item) => {
    const progress = progressMap.get(item.question.id);
    const hasSolution = solutionSet.has(item.question.id);
    const tags = item.question.tags ? JSON.parse(item.question.tags) : [];

    return {
      id: item.id,
      title: item.title,
      difficulty: item.difficulty,
      tags,
      source: item.question.sourceCompany,
      completed: progress?.completed || false,
      inProgress: !!(
        (hasSolution ||
          (progress?.hintsRevealed ?? 0) > 0 ||
          progress?.viewedAnswer) &&
        !progress?.completed
      ),
      hintsUsed: progress?.hintsRevealed || 0,
    };
  });
}

function filterQuestions(
  questions: Awaited<ReturnType<typeof getAllQuestionsWithProgress>>,
  filters: SearchParams,
) {
  return questions.filter((q) => {
    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== "all") {
      if (q.difficulty !== filters.difficulty) return false;
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (filters.status === "completed" && !q.completed) return false;
      if (filters.status === "in-progress" && !q.inProgress) return false;
      if (filters.status === "not-started" && (q.completed || q.inProgress))
        return false;
    }

    // Tag filter
    if (filters.tag && filters.tag !== "all") {
      if (!q.tags.includes(filters.tag)) return false;
    }

    return true;
  });
}

function extractAllTags(
  questions: Awaited<ReturnType<typeof getAllQuestionsWithProgress>>,
) {
  const tagSet = new Set<string>();
  questions.forEach((q) => {
    q.tags.forEach((tag: string) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

async function QuestionsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sessionId = await getOrCreateSessionId();
  const allQuestions = await getAllQuestionsWithProgress(sessionId);
  const filteredQuestions = filterQuestions(allQuestions, searchParams);
  const availableTags = extractAllTags(allQuestions);

  const completedCount = allQuestions.filter((q) => q.completed).length;
  const hasActiveFilters =
    searchParams.difficulty || searchParams.status || searchParams.tag;

  return (
    <>
      {/* Recommended Next (only show when no filters are active) */}
      {!hasActiveFilters && <RecommendedNext questions={allQuestions} />}

      {/* Filters */}
      <Suspense
        fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse" />}
      >
        <QuestionFilters
          availableTags={availableTags}
          totalCount={allQuestions.length}
          completedCount={completedCount}
        />
      </Suspense>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "No questions match your filters"
              : "No questions available yet"
          }
          description={
            hasActiveFilters
              ? "Try adjusting your filters to see more questions."
              : "Questions are being added. Check back soon!"
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((question) => (
            <QuestionListItem key={question.id} question={question} />
          ))}
        </div>
      )}

      {/* Results count */}
      {hasActiveFilters && filteredQuestions.length > 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Showing {filteredQuestions.length} of {allQuestions.length} questions
        </p>
      )}
    </>
  );
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Bank</h1>
        <p className="text-gray-600">
          Practice algorithm and coding problems to ace your technical
          interviews.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        }
      >
        <QuestionsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
