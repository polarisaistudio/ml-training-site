import Link from 'next/link';
import { db, contentItems, projects, stages, contentTypes } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DeleteProjectButton } from './DeleteProjectButton';

async function getProjects() {
  const result = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      createdAt: contentItems.createdAt,
      stageName: stages.name,
      estimatedHours: projects.estimatedHours,
    })
    .from(contentItems)
    .innerJoin(projects, eq(projects.contentItemId, contentItems.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .orderBy(desc(contentItems.createdAt));

  return result;
}

export default async function AdminProjectsPage() {
  const projectsList = await getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage guided project tutorials</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>Add Project</Button>
        </Link>
      </div>

      {projectsList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first project tutorial.</p>
          <Link href="/admin/projects/new">
            <Button>Add Your First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectsList.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    {project.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {project.stageName || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.difficulty ? (
                      <Badge
                        variant={
                          project.difficulty === 'easy'
                            ? 'success'
                            : project.difficulty === 'medium'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {project.difficulty}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {project.estimatedHours ? `${project.estimatedHours}h` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={project.isAvailable ? 'success' : 'default'}>
                      {project.isAvailable ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
