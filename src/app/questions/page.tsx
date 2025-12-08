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
import { eq } from "drizzle-orm";
import { EmptyState } from "@/components/EmptyState";
import { QuestionFilters } from "@/components/QuestionFilters";
import { RecommendedNext } from "@/components/RecommendedNext";
import { QuestionListItem } from "@/components/QuestionListItem";
import { RealQuestionCard } from "@/components/RealQuestionCard";
import { QuestionTabs } from "@/components/QuestionTabs";
import { ContentTypeTabs } from "@/components/ContentTypeTabs";
import { getOrCreateSessionId } from "@/lib/session";
import type { RealInterviewDetails } from "@/db/schema";

interface SearchParams {
  difficulty?: string;
  status?: string;
  tag?: string;
  tab?: string;
  type?: string; // content type filter: 'all', 'ml_concept', 'ml_coding', 'algorithm_problem'
}

async function getAllQuestionsWithProgress(sessionId: string) {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
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
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
        tags: questions.tags,
        sourceType: questions.sourceType,
        realInterviewDetails: questions.realInterviewDetails,
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
      sourceType: item.question.sourceType,
      realInterviewDetails: item.question
        .realInterviewDetails as RealInterviewDetails | null,
      contentTypeSlug: item.contentType?.slug || null,
      contentTypeName: item.contentType?.name || null,
      stageSlug: item.stage?.slug || null,
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

    // Content type filter
    if (filters.type && filters.type !== "all") {
      if (q.contentTypeSlug !== filters.type) return false;
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

function extractContentTypes(
  questions: Awaited<ReturnType<typeof getAllQuestionsWithProgress>>,
) {
  const typeMap = new Map<
    string,
    { slug: string; name: string; count: number }
  >();
  questions.forEach((q) => {
    if (q.contentTypeSlug && q.contentTypeName) {
      const existing = typeMap.get(q.contentTypeSlug);
      if (existing) {
        existing.count++;
      } else {
        typeMap.set(q.contentTypeSlug, {
          slug: q.contentTypeSlug,
          name: q.contentTypeName,
          count: 1,
        });
      }
    }
  });
  return Array.from(typeMap.values());
}

async function QuestionsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sessionId = await getOrCreateSessionId();
  const allQuestions = await getAllQuestionsWithProgress(sessionId);

  // Separate by source type
  const realQuestions = allQuestions.filter(
    (q) => q.sourceType === "real-interview",
  );
  const practiceQuestions = allQuestions.filter(
    (q) => q.sourceType === "generated",
  );

  // Determine active tab
  const activeTab = searchParams.tab === "practice" ? "practice" : "real";
  const displayQuestions =
    activeTab === "real" ? realQuestions : practiceQuestions;

  const filteredQuestions = filterQuestions(displayQuestions, searchParams);
  const availableTags = extractAllTags(displayQuestions);
  const contentTypes = extractContentTypes(displayQuestions);
  const activeType = searchParams.type || "all";

  // Calculate completed count based on filtered type
  const questionsForCount =
    searchParams.type && searchParams.type !== "all"
      ? displayQuestions.filter((q) => q.contentTypeSlug === searchParams.type)
      : displayQuestions;
  const completedCount = questionsForCount.filter((q) => q.completed).length;
  const hasActiveFilters =
    searchParams.difficulty ||
    searchParams.status ||
    searchParams.tag ||
    searchParams.type;

  return (
    <>
      {/* Tabs */}
      <QuestionTabs
        activeTab={activeTab}
        realCount={realQuestions.length}
        practiceCount={practiceQuestions.length}
      />

      {activeTab === "real" ? (
        // Real Interview Questions Tab
        <div>
          {/* Priority Banner */}
          {realQuestions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-semibold mb-1">
                Priority: Practice Real Interview Questions First
              </p>
              <p className="text-red-700 text-sm">
                These questions came from actual interviews. They&apos;re the
                most valuable for preparation.
              </p>
            </div>
          )}

          {realQuestions.length === 0 ? (
            <EmptyState
              title="No real interview questions yet"
              description="After each interview, add the questions you were asked to build your real question bank."
            />
          ) : (
            <>
              {/* Filters for real questions */}
              {realQuestions.length > 3 && (
                <Suspense
                  fallback={
                    <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                  }
                >
                  <QuestionFilters
                    availableTags={availableTags}
                    totalCount={realQuestions.length}
                    completedCount={completedCount}
                  />
                </Suspense>
              )}

              {/* Real Questions List */}
              {filteredQuestions.length === 0 ? (
                <EmptyState
                  title="No questions match your filters"
                  description="Try adjusting your filters to see more questions."
                />
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <RealQuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Practice Questions Tab
        <div>
          {/* Practice Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-semibold mb-1">
              Practice Questions
            </p>
            <p className="text-blue-700 text-sm">
              AI-generated questions covering common interview patterns. Use
              these to build foundational skills.
            </p>
          </div>

          {/* Content Type Tabs - show when there are multiple types */}
          {contentTypes.length > 1 && (
            <Suspense
              fallback={
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse mb-4" />
              }
            >
              <ContentTypeTabs
                contentTypes={contentTypes}
                activeType={activeType}
              />
            </Suspense>
          )}

          {/* Recommended Next (only show when no filters are active) */}
          {!hasActiveFilters && practiceQuestions.length > 0 && (
            <RecommendedNext questions={practiceQuestions} />
          )}

          {/* Filters */}
          <Suspense
            fallback={
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            }
          >
            <QuestionFilters
              availableTags={availableTags}
              totalCount={questionsForCount.length}
              completedCount={completedCount}
            />
          </Suspense>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <EmptyState
              title={
                hasActiveFilters
                  ? "No questions match your filters"
                  : "No practice questions available yet"
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
              Showing {filteredQuestions.length} of {questionsForCount.length}{" "}
              questions
            </p>
          )}
        </div>
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
            <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
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
