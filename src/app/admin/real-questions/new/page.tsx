import { RealQuestionForm } from '../RealQuestionForm';
import { getStagesAndContentTypes } from '../../actions';

export default async function NewRealQuestionPage() {
  const { stages, contentTypes } = await getStagesAndContentTypes();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Real Interview Question</h1>
        <p className="text-gray-600 mt-1">
          Record a question from an actual interview you&apos;ve taken
        </p>
      </div>

      <RealQuestionForm stages={stages} contentTypes={contentTypes} />
    </div>
  );
}
