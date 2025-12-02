import Link from 'next/link';
import { db, stages, contentItems } from '@/db';
import { sql, count } from 'drizzle-orm';
import { StageCard } from '@/components/StageCard';

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
    countsData.map((c) => [c.stageId, { total: Number(c.total), available: Number(c.available) }])
  );

  return stagesData.map((stage) => ({
    ...stage,
    totalCount: countsMap.get(stage.id)?.total ?? 0,
    availableCount: countsMap.get(stage.id)?.available ?? 0,
  }));
}

export default async function HomePage() {
  const stagesWithCounts = await getStagesWithCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ML/AI Interview Preparation
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A structured path to becoming interview-ready for ML/AI Engineer roles.
          Organized by time to interview ready, not by knowledge categories.
        </p>
      </div>

      {/* Stages Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Stages</h2>
        {stagesWithCounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No stages available yet. Run the database seed script to get started.
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
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Question Bank</h3>
          <p className="text-blue-700 mb-4">
            Browse all available questions across all categories.
          </p>
          <Link
            href="/questions"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            View all questions
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Content Roadmap</h3>
          <p className="text-green-700 mb-4">
            See what content is available and what&apos;s coming soon.
          </p>
          <Link
            href="/roadmap"
            className="inline-flex items-center text-green-600 font-medium hover:text-green-800"
          >
            View roadmap
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
