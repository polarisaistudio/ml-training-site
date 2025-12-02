import { db, contentItems, contentTypes, questions, stages } from '@/db';
import { eq } from 'drizzle-orm';
import { QuestionCard } from '@/components/QuestionCard';
import { EmptyState } from '@/components/EmptyState';

async function getAllQuestions() {
  const items = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
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
    .where(eq(contentItems.isAvailable, true))
    .orderBy(contentItems.order);

  return items;
}

export default async function QuestionsPage() {
  const questions = await getAllQuestions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Bank</h1>
        <p className="text-lg text-gray-600">
          Browse all available interview questions across all categories.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {questions.length} question{questions.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <EmptyState
          title="No questions available yet"
          description="Questions are being added. Check back soon!"
        />
      ) : (
        <div className="space-y-4">
          {questions.map((item) => (
            <QuestionCard
              key={item.id}
              id={item.id}
              title={item.title}
              contentType={item.contentType?.name ?? null}
              difficulty={item.difficulty}
              sourceCompany={item.question.sourceCompany}
              isVerified={item.question.isVerified}
              stageName={item.stage?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
