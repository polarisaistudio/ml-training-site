import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db, contentItems, contentTypes, projects, stages } from '@/db';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getDifficultyColor, formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: number) {
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
      project: {
        id: projects.id,
        content: projects.content,
        resumeBullets: projects.resumeBullets,
        estimatedHours: projects.estimatedHours,
      },
    })
    .from(contentItems)
    .innerJoin(projects, eq(contentItems.id, projects.contentItemId))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .where(eq(contentItems.id, id))
    .limit(1);

  return result[0] || null;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  const item = await getProject(projectId);

  if (!item || !item.isAvailable) {
    notFound();
  }

  const resumeBullets = item.project.resumeBullets
    ? JSON.parse(item.project.resumeBullets)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        {item.stage && (
          <>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/stages/${item.stage.slug}`} className="text-sm text-gray-500 hover:text-gray-700">
              {item.stage.name}
            </Link>
          </>
        )}
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900 truncate">{item.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {item.contentType?.name && (
            <Badge variant="default">{item.contentType.name}</Badge>
          )}
          {item.stage?.name && (
            <Badge variant="info">{item.stage.name}</Badge>
          )}
          {item.difficulty && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
              {item.difficulty}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
        {item.description && (
          <p className="text-lg text-gray-600">{item.description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {item.project.estimatedHours && (
            <span>Estimated time: ~{item.project.estimatedHours} hours</span>
          )}
          <span>Last updated: {formatDate(item.updatedAt)}</span>
        </div>
      </div>

      {/* Resume Bullets */}
      {resumeBullets.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resume Bullet Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Use these as inspiration for your resume after completing the project:
            </p>
            <ul className="space-y-2">
              {resumeBullets.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Project Content */}
      <Card>
        <CardHeader>
          <CardTitle>Project Tutorial</CardTitle>
        </CardHeader>
        <CardContent>
          {item.project.content ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.project.content.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="text-gray-500 italic">Project tutorial content coming soon.</p>
          )}
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="mt-8">
        {item.stage ? (
          <Link
            href={`/stages/${item.stage.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {item.stage.name}
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        )}
      </div>
    </div>
  );
}
