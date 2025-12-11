import Link from "next/link";
import { db, stages, contentItems, questions } from "@/db";
import { sql, count, eq } from "drizzle-orm";
import { StageCard } from "@/components/StageCard";
import { EmailSubscription } from "@/components/EmailSubscription";
import { BEHAVIORAL_QUESTIONS } from "@/data/resume-ready/behavioral-questions";
import { PROJECT_TEMPLATES } from "@/data/resume-ready/project-templates";

async function getStagesWithCounts() {
  const stagesData = await db.select().from(stages).orderBy(stages.order);

  const countsData = await db
    .select({
      stageId: contentItems.stageId,
      total: count(),
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(contentItems)
    .groupBy(contentItems.stageId);

  const countsMap = new Map(
    countsData.map((c) => [
      c.stageId,
      { total: Number(c.total), available: Number(c.available) },
    ]),
  );

  // Calculate Resume Ready content count from static files
  const resumeReadyItemCount =
    BEHAVIORAL_QUESTIONS.length + Object.keys(PROJECT_TEMPLATES).length;

  return stagesData.map((stage) => {
    // Special handling for Resume Ready stage - content is in static files, not DB
    if (stage.slug === "resume-ready") {
      return {
        ...stage,
        totalCount: resumeReadyItemCount,
        availableCount: resumeReadyItemCount,
      };
    }
    return {
      ...stage,
      totalCount: countsMap.get(stage.id)?.total ?? 0,
      availableCount: countsMap.get(stage.id)?.available ?? 0,
    };
  });
}

async function getRealInterviewCount() {
  const result = await db
    .select({ count: count() })
    .from(questions)
    .where(eq(questions.sourceType, "real-interview"));
  return Number(result[0]?.count ?? 0);
}

export default async function HomePage() {
  const [stagesWithCounts, realInterviewCount] = await Promise.all([
    getStagesWithCounts(),
    getRealInterviewCount(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          The Real Interview Guide for Engineers
          <br />
          <span className="text-blue-600">Transitioning to ML/AI Roles</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Real interview questions + 13-week structured learning path to
          systematically prepare for ML/AI interviews
        </p>

        {/* Value Propositions */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 text-left max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <p className="text-gray-700">
              Questions from actual interviews, not scraped from the internet
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <p className="text-gray-700">
              Organized by timeline, not by disconnected knowledge categories
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-gray-700">
              Built by someone making the same transition — I know your pain
              points
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/questions"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Start Learning
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        {/* Real Interview Count Badge */}
        {realInterviewCount > 0 && (
          <p className="mt-6 text-sm text-gray-500">
            🎯 {realInterviewCount} real interview question
            {realInterviewCount > 1 ? "s" : ""} collected so far — more coming
            as I interview!
          </p>
        )}
      </div>

      {/* Stages Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Learning Stages
        </h2>
        {stagesWithCounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No stages available yet. Run the database seed script to get
              started.
            </p>
            <code className="mt-2 inline-block text-sm bg-gray-200 px-3 py-1 rounded">
              npm run db:seed
            </code>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stagesWithCounts.map((stage) => (
              <StageCard
                key={stage.id}
                slug={stage.slug}
                name={stage.name}
                description={stage.description}
                weekRange={stage.weekRange}
                goal={stage.goal}
                order={stage.order}
                availableCount={stage.availableCount}
                totalCount={stage.totalCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Question Bank
          </h3>
          <p className="text-blue-700 mb-4">
            Browse all available questions across all categories.
          </p>
          <Link
            href="/questions"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            View all questions
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Content Roadmap
          </h3>
          <p className="text-green-700 mb-4">
            See what content is available and what&apos;s coming soon.
          </p>
          <Link
            href="/roadmap"
            className="inline-flex items-center text-green-600 font-medium hover:text-green-800"
          >
            View roadmap
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* About/Story Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Why I Built This
        </h2>
        <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-blue-500">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              I&apos;m a software engineer transitioning from Android/backend
              development to ML engineering. While preparing for interviews, I
              found that most resources were either scattered &quot;八股文&quot;
              (rote memorization content) or theoretical material disconnected
              from real interviews.
            </p>
            <p className="text-gray-700 mb-4">
              So I started documenting my own interview experiences and building
              this site as I go. Every question tagged &quot;Real
              Interview&quot; is something I personally encountered.
            </p>
            <p className="text-gray-700 font-medium">
              I hope this helps others on the same journey.
            </p>
          </div>
        </div>
      </div>

      {/* Email Subscription Section */}
      <EmailSubscription />
    </div>
  );
}
