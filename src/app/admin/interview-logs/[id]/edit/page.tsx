import { notFound } from 'next/navigation';
import { db, interviewLogs } from '@/db';
import { eq } from 'drizzle-orm';
import { InterviewLogForm } from '../../InterviewLogForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getInterviewLog(id: number) {
  const result = await db
    .select()
    .from(interviewLogs)
    .where(eq(interviewLogs.id, id))
    .limit(1);

  return result[0] || null;
}

export default async function EditInterviewLogPage({ params }: Props) {
  const { id } = await params;
  const logId = parseInt(id, 10);

  if (isNaN(logId)) {
    notFound();
  }

  const log = await getInterviewLog(logId);

  if (!log) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Interview Log</h1>
        <p className="text-gray-600">Update interview log details</p>
      </div>

      <InterviewLogForm initialData={log} />
    </div>
  );
}
