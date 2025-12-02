import Link from 'next/link';
import { db, interviewLogs } from '@/db';
import { desc } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, getDifficultyColor, getResultColor } from '@/lib/utils';
import { DeleteInterviewLogButton } from './DeleteInterviewLogButton';

async function getAllInterviewLogs() {
  return db.select().from(interviewLogs).orderBy(desc(interviewLogs.createdAt));
}

export default async function AdminInterviewLogsPage() {
  const logs = await getAllInterviewLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Logs</h1>
          <p className="text-gray-600">{logs.length} total logs</p>
        </div>
        <Link href="/admin/interview-logs/new">
          <Button>Add Interview Log</Button>
        </Link>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          title="No interview logs yet"
          description="Add your first interview log to start tracking."
          action={
            <Link href="/admin/interview-logs/new">
              <Button>Add Interview Log</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{log.company}</h3>
                      {log.position && (
                        <span className="text-gray-500">- {log.position}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {log.roundType && (
                        <Badge variant="default">{log.roundType}</Badge>
                      )}
                      {log.difficulty && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(log.difficulty)}`}>
                          {log.difficulty}
                        </span>
                      )}
                      {log.result && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(log.result)}`}>
                          {log.result}
                        </span>
                      )}
                      {log.interviewDate && (
                        <span className="text-xs text-gray-500">
                          {formatDate(log.interviewDate)}
                        </span>
                      )}
                    </div>
                    {log.questionsAsked && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {log.questionsAsked}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/interview-logs/${log.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteInterviewLogButton id={log.id} company={log.company} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
