import { InterviewLogForm } from '../InterviewLogForm';

export default function NewInterviewLogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Interview Log</h1>
        <p className="text-gray-600">Record a new interview experience</p>
      </div>

      <InterviewLogForm />
    </div>
  );
}
