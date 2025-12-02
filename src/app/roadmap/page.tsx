import { db, stages, contentTypes, contentItems } from '@/db';
import { eq, sql, count } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ContentProgress } from '@/components/ContentProgress';
import { Badge } from '@/components/ui/Badge';

async function getContentTypeStats() {
  const stats = await db
    .select({
      id: contentTypes.id,
      slug: contentTypes.slug,
      name: contentTypes.name,
      description: contentTypes.description,
      total: sql<number>`count(${contentItems.id})`,
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(contentTypes)
    .leftJoin(contentItems, eq(contentTypes.id, contentItems.contentTypeId))
    .groupBy(contentTypes.id)
    .orderBy(contentTypes.id);

  return stats;
}

async function getStageStats() {
  const stats = await db
    .select({
      id: stages.id,
      name: stages.name,
      slug: stages.slug,
      weekRange: stages.weekRange,
      order: stages.order,
      total: sql<number>`count(${contentItems.id})`,
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(stages)
    .leftJoin(contentItems, eq(stages.id, contentItems.stageId))
    .groupBy(stages.id)
    .orderBy(stages.order);

  return stats;
}

async function getOverallStats() {
  const result = await db
    .select({
      total: count(),
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(contentItems);

  return {
    total: Number(result[0]?.total ?? 0),
    available: Number(result[0]?.available ?? 0),
  };
}

export default async function RoadmapPage() {
  const [contentTypeStats, stageStats, overall] = await Promise.all([
    getContentTypeStats(),
    getStageStats(),
    getOverallStats(),
  ]);

  const plannedContentTypes = [
    { name: 'Guided Projects', target: 10, description: 'Hands-on projects with resume bullet points' },
    { name: 'Algorithm Problems', target: 100, description: 'LeetCode-style coding problems' },
    { name: 'ML Concepts', target: 150, description: 'ML theory questions (八股文)' },
    { name: 'ML Coding', target: 50, description: 'Implement ML algorithms from scratch' },
    { name: 'System Design', target: 30, description: 'ML system design problems' },
    { name: 'Behavioral Questions', target: 30, description: 'Common BQ questions with sample answers' },
    { name: 'Mock Interview Sets', target: 20, description: 'Complete mock interview question sets' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Roadmap</h1>
        <p className="text-lg text-gray-600">
          Track our progress in building comprehensive interview preparation content.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentProgress available={overall.available} total={overall.total || 1} />
          <p className="mt-4 text-sm text-gray-500">
            {overall.available} items available out of {overall.total} planned so far.
          </p>
        </CardContent>
      </Card>

      {/* Progress by Stage */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progress by Learning Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stageStats.map((stage) => (
              <div key={stage.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{stage.name}</span>
                    {stage.weekRange && (
                      <Badge variant="info">{stage.weekRange}</Badge>
                    )}
                  </div>
                </div>
                <ContentProgress
                  available={Number(stage.available)}
                  total={Number(stage.total) || 1}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress by Content Type */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progress by Content Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {contentTypeStats.map((type) => (
              <div key={type.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{type.name}</span>
                </div>
                {type.description && (
                  <p className="text-sm text-gray-500 mb-2">{type.description}</p>
                )}
                <ContentProgress
                  available={Number(type.available)}
                  total={Number(type.total) || 1}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planned Content */}
      <Card>
        <CardHeader>
          <CardTitle>Planned Content Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-6">
            Our target content goals for a complete interview preparation platform:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {plannedContentTypes.map((type) => (
              <div key={type.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{type.name}</span>
                  <span className="text-sm text-gray-500">Target: {type.target}</span>
                </div>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
