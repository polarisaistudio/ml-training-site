import Link from 'next/link';
import { db, contentItems, questions, interviewLogs } from '@/db';
import { sql, count } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

async function getStats() {
  const [questionsCount, interviewLogsCount, contentItemsStats] = await Promise.all([
    db.select({ count: count() }).from(questions),
    db.select({ count: count() }).from(interviewLogs),
    db.select({
      total: count(),
      available: sql<number>`count(*) filter (where ${contentItems.isAvailable} = true)`,
    }).from(contentItems),
  ]);

  return {
    totalQuestions: Number(questionsCount[0]?.count ?? 0),
    totalInterviewLogs: Number(interviewLogsCount[0]?.count ?? 0),
    totalContent: Number(contentItemsStats[0]?.total ?? 0),
    availableContent: Number(contentItemsStats[0]?.available ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your interview preparation content</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link href="/admin/questions/new">
          <Button>Add Question</Button>
        </Link>
        <Link href="/admin/interview-logs/new">
          <Button variant="secondary">Add Interview Log</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Interview Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInterviewLogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Content Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availableContent}</div>
            <p className="text-sm text-gray-500">
              {stats.totalContent > 0
                ? `${Math.round((stats.availableContent / stats.totalContent) * 100)}% published`
                : '0% published'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Add, edit, and manage interview questions across all categories.
            </p>
            <Link href="/admin/questions">
              <Button variant="outline">Manage Questions</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interview Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Record and track real interview experiences.
            </p>
            <Link href="/admin/interview-logs">
              <Button variant="outline">Manage Interview Logs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
