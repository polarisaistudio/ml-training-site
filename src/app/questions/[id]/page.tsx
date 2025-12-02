import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db, contentItems, contentTypes, questions, stages } from '@/db';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { getDifficultyColor, formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

async function getQuestion(id: number) {
  const result = await db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      description: contentItems.description,
      difficulty: contentItems.difficulty,
      isAvailable: contentItems.isAvailable,
      updatedAt: contentItems.updatedAt,
      contentType: {
        slug: contentTypes.slug,
        name: contentTypes.name,
      },
      stage: {
        slug: stages.slug,
        name: stages.name,
      },
      question: {
        id: questions.id,
        content: questions.content,
        answer: questions.answer,
        sourceCompany: questions.sourceCompany,
        isVerified: questions.isVerified,
        tags: questions.tags,
      },
    })
    .from(contentItems)
    .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
    .leftJoin(contentTypes, eq(contentItems.contentTypeId, contentTypes.id))
    .leftJoin(stages, eq(contentItems.stageId, stages.id))
    .where(eq(contentItems.id, id))
    .limit(1);

  return result[0] || null;
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;
  const questionId = parseInt(id, 10);

  if (isNaN(questionId)) {
    notFound();
  }

  const item = await getQuestion(questionId);

  if (!item || !item.isAvailable) {
    notFound();
  }

  const tags = item.question.tags ? JSON.parse(item.question.tags) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/questions" className="text-sm text-gray-500 hover:text-gray-700">
          Questions
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900 truncate">{item.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
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
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
        {item.description && (
          <p className="text-lg text-gray-600">{item.description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {item.question.sourceCompany && (
            <span>Source: {item.question.sourceCompany}</span>
          )}
          <span>Last updated: {formatDate(item.updatedAt)}</span>
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Question Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question</CardTitle>
        </CardHeader>
        <CardContent>
          {item.question.content ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.question.content.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="text-gray-500 italic">Question content coming soon.</p>
          )}
        </CardContent>
      </Card>

      {/* Answer */}
      <Card>
        <CardHeader>
          <CardTitle>Answer</CardTitle>
        </CardHeader>
        <CardContent>
          {item.question.answer ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: item.question.answer.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="text-gray-500 italic">Answer content coming soon.</p>
          )}
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="mt-8">
        <Link
          href="/questions"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Questions
        </Link>
      </div>
    </div>
  );
}
