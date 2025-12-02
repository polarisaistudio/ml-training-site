import Link from 'next/link';
import { db, contentItems, contentTypes, questions, stages } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/EmptyState';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { getDifficultyColor } from '@/lib/utils';
import { DeleteQuestionButton } from './DeleteQuestionButton';

async function getAllQuestions() {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      updatedAt: contentItems.updatedAt,
      contentType: {
        name: contentTypes.name,
      },
      stage: {
        name: stages.name,
      },
      question: {
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .orderBy(desc(contentItems.updatedAt));

  return items;
}

export default async function AdminQuestionsPage() {
  const allQuestions = await getAllQuestions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600">{allQuestions.length} total questions</p>
        </div>
        <Link href="/admin/questions/new">
          <Button>Add Question</Button>
        </Link>
      </div>

      {allQuestions.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Add your first question to get started."
          action={
            <Link href="/admin/questions/new">
              <Button>Add Question</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {allQuestions.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {!item.isAvailable && (
                        <Badge variant="warning">Draft</Badge>
                      )}
                      {item.isAvailable && (
                        <Badge variant="success">Published</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.contentType?.name && (
                        <Badge variant="default">{item.contentType.name}</Badge>
                      )}
                      {item.stage?.name && (
                        <Badge variant="info">{item.stage.name}</Badge>
                      )}
                      {item.difficulty && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      )}
                      {item.question.isVerified && <VerifiedBadge />}
                      {item.question.sourceCompany && (
                        <span className="text-xs text-gray-500">{item.question.sourceCompany}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/questions/${item.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteQuestionButton id={item.id} title={item.title} />
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
