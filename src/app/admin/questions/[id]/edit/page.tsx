import { notFound } from 'next/navigation';
import { db, contentItems, questions } from '@/db';
import { eq } from 'drizzle-orm';
import { getStagesAndContentTypes } from '../../../actions';
import { QuestionForm } from '../../QuestionForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getQuestion(id: number) {
  const result = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      stageId: contentItems.stageId,
      contentTypeId: contentItems.contentTypeId,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      question: {
        content: questions.content,
        answer: questions.answer,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
        tags: questions.tags,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .where(eq(contentItems.id, id))
    .limit(1);

  return result[0] || null;
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params;
  const questionId = parseInt(id, 10);

  if (isNaN(questionId)) {
    notFound();
  }

  const [questionData, { stages, contentTypes }] = await Promise.all([
    getQuestion(questionId),
    getStagesAndContentTypes(),
  ]);

  if (!questionData) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
        <p className="text-gray-600">Update question details</p>
      </div>

      <QuestionForm
        stages={stages}
        contentTypes={contentTypes}
        initialData={questionData}
      />
    </div>
  );
}
