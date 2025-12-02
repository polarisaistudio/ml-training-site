import { getStagesAndContentTypes } from '../../actions';
import { QuestionForm } from '../QuestionForm';

export default async function NewQuestionPage() {
  const { stages, contentTypes } = await getStagesAndContentTypes();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Question</h1>
        <p className="text-gray-600">Create a new interview question</p>
      </div>

      <QuestionForm stages={stages} contentTypes={contentTypes} />
    </div>
  );
}
