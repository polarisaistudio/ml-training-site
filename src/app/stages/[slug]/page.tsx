import { notFound } from "next/navigation";
import Link from "next/link";
import {
  db,
  stages,
  contentItems,
  contentTypes,
  questions,
  projects,
} from "@/db";
import { eq, sql, count } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContentProgress } from "@/components/ContentProgress";
import { EmptyState } from "@/components/EmptyState";
import { getDifficultyColor } from "@/lib/utils";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ResumeReadyTracker } from "@/components/ResumeReadyTracker";

interface Props {
  params: Promise<{ slug: string }>;
}

// Content item type
type ContentItem = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string | null;
  isAvailable: boolean;
  order: number;
  contentType: { slug: string; name: string } | null;
  question: {
    id: number;
    sourceCompany: string | null;
    isVerified: boolean;
  } | null;
  project: { id: number; estimatedHours: number | null } | null;
};

// Reusable content item card component
function ContentItemCard({ item }: { item: ContentItem }) {
  const isQuestion = item.question?.id;
  const isProject = item.project?.id;
  const href = isQuestion
    ? `/questions/${item.id}`
    : isProject
      ? `/projects/${item.id}`
      : "#";

  return (
    <Link href={href}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${!item.isAvailable ? "opacity-60" : ""}`}
      >
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                {!item.isAvailable && (
                  <Badge variant="default">Coming Soon</Badge>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {item.contentType?.name && (
                  <Badge variant="default">{item.contentType.name}</Badge>
                )}
                {item.difficulty && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}
                  >
                    {item.difficulty}
                  </span>
                )}
                {item.project?.estimatedHours && (
                  <span className="text-xs text-gray-500">
                    ~{item.project.estimatedHours}h
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {item.question?.isVerified && <VerifiedBadge />}
              {item.question?.sourceCompany && (
                <span className="text-xs text-gray-500">
                  {item.question.sourceCompany}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

async function getStage(slug: string) {
  // Handle special combined "technical-rounds" page
  if (slug === "technical-rounds") {
    return {
      id: -1, // Special ID for combined page
      slug: "technical-rounds",
      name: "Master Technical Rounds",
      description:
        "Deep dive into ML concepts, algorithms, and system design. Master all the technical skills needed to ace your interviews.",
      weekRange: "Week 3-10",
      goal: "Pass all technical rounds",
      order: 3,
    };
  }

  const result = await db
    .select()
    .from(stages)
    .where(eq(stages.slug, slug))
    .limit(1);
  return result[0] || null;
}

async function getStageContent(stageId: number) {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      order: contentItems.order,
      contentType: {
        slug: contentTypes.slug,
        name: contentTypes.name,
      },
      question: {
        id: questions.id,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
      },
      project: {
        id: projects.id,
        estimatedHours: projects.estimatedHours,
      },
    })
    .from(contentItems)
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(projects, eq(contentItems.id, projects.contentItemId))
    .where(eq(contentItems.stageId, stageId))
    .orderBy(contentItems.order);

  return items;
}

async function getTechnicalRoundsContent() {
  // Get stage IDs for coding-ready, ml-ready, and system-design-ready
  const technicalStages = await db
    .select({ id: stages.id, slug: stages.slug })
    .from(stages)
    .where(
      sql`${stages.slug} IN ('coding-ready', 'ml-ready', 'system-design-ready')`,
    );

  const stageIds = technicalStages.map((s) => s.id);

  if (stageIds.length === 0) {
    return [];
  }

  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      order: contentItems.order,
      contentType: {
        slug: contentTypes.slug,
        name: contentTypes.name,
      },
      question: {
        id: questions.id,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
      },
      project: {
        id: projects.id,
        estimatedHours: projects.estimatedHours,
      },
    })
    .from(contentItems)
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(projects, eq(contentItems.id, projects.contentItemId))
    .where(sql`${contentItems.stageId} IN ${stageIds}`)
    .orderBy(contentItems.order);

  return items;
}

async function getStageCounts(stageId: number) {
  const result = await db
    .select({
      total: count(),
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(contentItems)
    .where(eq(contentItems.stageId, stageId));

  return {
    total: Number(result[0]?.total ?? 0),
    available: Number(result[0]?.available ?? 0),
  };
}

async function getTechnicalRoundsCounts() {
  const technicalStages = await db
    .select({ id: stages.id })
    .from(stages)
    .where(
      sql`${stages.slug} IN ('coding-ready', 'ml-ready', 'system-design-ready')`,
    );

  const stageIds = technicalStages.map((s) => s.id);

  if (stageIds.length === 0) {
    return { total: 0, available: 0 };
  }

  const result = await db
    .select({
      total: count(),
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    })
    .from(contentItems)
    .where(sql`${contentItems.stageId} IN ${stageIds}`);

  return {
    total: Number(result[0]?.total ?? 0),
    available: Number(result[0]?.available ?? 0),
  };
}

export default async function StagePage({ params }: Props) {
  const { slug } = await params;
  const stage = await getStage(slug);

  if (!stage) {
    notFound();
  }

  // Handle technical-rounds combined page
  const isTechnicalRounds = slug === "technical-rounds";

  const [content, counts] = await Promise.all([
    isTechnicalRounds ? getTechnicalRoundsContent() : getStageContent(stage.id),
    isTechnicalRounds ? getTechnicalRoundsCounts() : getStageCounts(stage.id),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">{stage.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="info">Stage {stage.order}</Badge>
          {stage.weekRange && (
            <span className="text-sm text-gray-500">{stage.weekRange}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{stage.name}</h1>
        {stage.description && (
          <p className="text-lg text-gray-600">{stage.description}</p>
        )}
        {stage.goal && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-800">Goal:</span>
            <span className="text-sm text-green-700">{stage.goal}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-8 max-w-md">
        <ContentProgress
          available={counts.available}
          total={counts.total}
          label="items"
        />
      </div>

      {/* Content List */}
      {slug === "resume-ready" ? (
        // Resume Ready stage: show the project tracker
        <ResumeReadyTracker />
      ) : content.length === 0 ? (
        <EmptyState
          title="No content yet"
          description="Content for this stage is coming soon. Check back later!"
        />
      ) : slug === "technical-rounds" ? (
        // Technical Rounds: combined view with Algorithms, ML, and System Design
        <div className="space-y-10">
          {/* Algorithms Section */}
          {(() => {
            const algorithms = content.filter(
              (item) => item.contentType?.slug === "algorithm_problem",
            );
            if (algorithms.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Algorithms & Data Structures
                  </h2>
                  <Badge variant="info">{algorithms.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Master LeetCode-style problems commonly asked in ML/AI
                  interviews. Focus on patterns and problem-solving strategies.
                </p>
                <div className="space-y-3">
                  {algorithms.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ML Concepts Section */}
          {(() => {
            const mlConcepts = content.filter(
              (item) => item.contentType?.slug === "ml_concept",
            );
            if (mlConcepts.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    ML Concepts
                  </h2>
                  <Badge variant="info">{mlConcepts.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Master the theoretical foundations - common interview
                  questions about ML concepts, algorithms, and theory.
                </p>
                <div className="space-y-3">
                  {mlConcepts.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ML Coding Section */}
          {(() => {
            const mlCoding = content.filter(
              (item) => item.contentType?.slug === "ml_coding",
            );
            if (mlCoding.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💻</span>
                  <h2 className="text-xl font-bold text-gray-900">ML Coding</h2>
                  <Badge variant="info">{mlCoding.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Implement ML algorithms from scratch - gradient descent,
                  regularization, neural networks, and more.
                </p>
                <div className="space-y-3">
                  {mlCoding.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* System Design Section */}
          {(() => {
            const systemDesign = content.filter(
              (item) => item.contentType?.slug === "system_design",
            );
            if (systemDesign.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏗️</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    System Design
                  </h2>
                  <Badge variant="info">{systemDesign.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Learn to design ML systems at scale - recommendation systems,
                  search ranking, fraud detection, and more.
                </p>
                <div className="space-y-3">
                  {systemDesign.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      ) : slug === "ml-ready" ? (
        // ML Ready stage: separate into ML Concepts and ML Coding sections
        <div className="space-y-8">
          {/* ML Concepts Section */}
          {(() => {
            const mlConcepts = content.filter(
              (item) => item.contentType?.slug === "ml_concept",
            );
            if (mlConcepts.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    ML Concepts
                  </h2>
                  <Badge variant="info">{mlConcepts.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Master the theoretical foundations - common interview
                  questions about ML concepts, algorithms, and theory.
                </p>
                <div className="space-y-3">
                  {mlConcepts.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ML Coding Section */}
          {(() => {
            const mlCoding = content.filter(
              (item) => item.contentType?.slug === "ml_coding",
            );
            if (mlCoding.length === 0) return null;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💻</span>
                  <h2 className="text-xl font-bold text-gray-900">ML Coding</h2>
                  <Badge variant="info">{mlCoding.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Implement ML algorithms from scratch - gradient descent,
                  regularization, neural networks, and more.
                </p>
                <div className="space-y-3">
                  {mlCoding.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Other content (if any) */}
          {(() => {
            const other = content.filter(
              (item) =>
                item.contentType?.slug !== "ml_concept" &&
                item.contentType?.slug !== "ml_coding",
            );
            if (other.length === 0) return null;
            return (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Other Resources
                </h2>
                <div className="space-y-3">
                  {other.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        // Other stages: show all content in a single list
        <div className="space-y-4">
          {content.map((item) => (
            <ContentItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
