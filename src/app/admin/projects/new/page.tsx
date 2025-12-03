import { getStagesAndContentTypes } from '../../actions';
import { ProjectForm } from '../ProjectForm';

export default async function NewProjectPage() {
  const { stages } = await getStagesAndContentTypes();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
        <p className="text-gray-600">Create a new guided project tutorial</p>
      </div>

      <ProjectForm stages={stages} />
    </div>
  );
}
