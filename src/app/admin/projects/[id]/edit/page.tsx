import { notFound } from 'next/navigation';
import { db, contentItems, projects, stages } from '@/db';
import { eq } from 'drizzle-orm';
import { getStagesAndContentTypes } from '../../../actions';
import { ProjectForm } from '../../ProjectForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: number) {
  const [result] = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      stageId: contentItems.stageId,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      content: projects.content,
      resumeBullets: projects.resumeBullets,
      estimatedHours: projects.estimatedHours,
    })
    .from(contentItems)
    .innerJoin(projects, eq(projects.contentItemId, contentItems.id))
    .where(eq(contentItems.id, id))
    .limit(1);

  if (!result) return null;

  return {
    id: result.id,
    title: result.title,
    description: result.description,
    stageId: result.stageId,
    difficulty: result.difficulty,
    isAvailable: result.isAvailable,
    project: {
      content: result.content,
      resumeBullets: result.resumeBullets,
      estimatedHours: result.estimatedHours,
    },
  };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) {
    notFound();
  }

  const [project, { stages: stagesList }] = await Promise.all([
    getProject(projectId),
    getStagesAndContentTypes(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600">Update project details</p>
      </div>

      <ProjectForm stages={stagesList} initialData={project} />
    </div>
  );
}
