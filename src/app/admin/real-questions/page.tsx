import Link from 'next/link';
import { db, contentItems, questions } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import type { RealInterviewDetails } from '@/db/schema';

async function getRealQuestions() {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      createdAt: contentItems.createdAt,
      question: {
        id: questions.id,
        sourceCompany: questions.sourceCompany,
        tags: questions.tags,
        sourceType: questions.sourceType,
        realInterviewDetails: questions.realInterviewDetails,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .where(eq(questions.sourceType, 'real-interview'))
    .orderBy(desc(contentItems.createdAt));

  return items;
}

export default async function RealQuestionsPage() {
  const realQuestions = await getRealQuestions();

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    const badges: Record<string, { text: string; class: string }> = {
      'passed': { text: '✓ Passed', class: 'bg-green-100 text-green-800' },
      'failed': { text: '✗ Failed', class: 'bg-red-100 text-red-800' },
      'pending': { text: '⏳ Pending', class: 'bg-yellow-100 text-yellow-800' },
    };
    return badges[result] || null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎯 Real Interview Questions</h1>
          <p className="text-gray-600 mt-1">
            Questions from actual interviews you&apos;ve taken
          </p>
        </div>
        <Link href="/admin/real-questions/new">
          <Button>+ Add Real Question</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-red-600">{realQuestions.length}</div>
          <div className="text-sm text-gray-600">Total Real Questions</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">
            {realQuestions.filter(q => (q.question.realInterviewDetails as RealInterviewDetails)?.result === 'passed').length}
          </div>
          <div className="text-sm text-gray-600">From Passed Interviews</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-red-600">
            {realQuestions.filter(q => (q.question.realInterviewDetails as RealInterviewDetails)?.result === 'failed').length}
          </div>
          <div className="text-sm text-gray-600">From Failed Interviews</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-600">
            {realQuestions.filter(q => (q.question.realInterviewDetails as RealInterviewDetails)?.result === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending Results</div>
        </div>
      </div>

      {realQuestions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No real interview questions yet
          </h3>
          <p className="text-gray-600 mb-6">
            After each interview, add the questions you were asked to build your real question bank.
          </p>
          <Link href="/admin/real-questions/new">
            <Button>Add Your First Real Question</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Question</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Result</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {realQuestions.map((item) => {
                const details = item.question.realInterviewDetails as RealInterviewDetails | null;
                const resultBadge = getResultBadge(details?.result);
                const tags = item.question.tags ? JSON.parse(item.question.tags) : [];

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      {tags.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {tags.slice(0, 3).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        {details?.company || item.question.sourceCompany || '-'}
                      </div>
                      {details?.position && (
                        <div className="text-xs text-gray-500">{details.position}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {resultBadge ? (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${resultBadge.class}`}>
                          {resultBadge.text}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {item.difficulty ? (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {item.isAvailable ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/questions/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/questions/${item.id}/edit`}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
