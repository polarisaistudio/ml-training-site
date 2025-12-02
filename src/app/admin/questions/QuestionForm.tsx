'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createQuestion, updateQuestion } from '../actions';
import type { Stage, ContentType } from '@/types';

interface QuestionData {
  id: number;
  title: string;
  description: string | null;
  stageId: number | null;
  contentTypeId: number | null;
  difficulty: string | null;
  isAvailable: boolean;
  question: {
    content: string | null;
    answer: string | null;
    sourceCompany: string | null;
    isVerified: boolean;
    tags: string | null;
  };
}

interface Props {
  stages: Stage[];
  contentTypes: ContentType[];
  initialData?: QuestionData;
}

export function QuestionForm({ stages, contentTypes, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    let result;
    if (isEdit && initialData) {
      result = await updateQuestion(initialData.id, formData);
    } else {
      result = await createQuestion(formData);
    }

    if (result.success) {
      router.push('/admin/questions');
      router.refresh();
    } else {
      setError(result.error || 'An error occurred');
    }

    setLoading(false);
  }

  const parseTags = (tags: string | null): string => {
    if (!tags) return '';
    try {
      return JSON.parse(tags).join(', ');
    } catch {
      return '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Title *"
            defaultValue={initialData?.title || ''}
            required
          />
          <Textarea
            id="description"
            name="description"
            label="Description"
            rows={2}
            defaultValue={initialData?.description || ''}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              id="stageId"
              name="stageId"
              label="Stage"
              defaultValue={initialData?.stageId?.toString() || ''}
              options={[
                { value: '', label: 'Select a stage' },
                ...stages.map((s) => ({ value: s.id.toString(), label: s.name })),
              ]}
            />
            <Select
              id="contentTypeId"
              name="contentTypeId"
              label="Content Type"
              defaultValue={initialData?.contentTypeId?.toString() || ''}
              options={[
                { value: '', label: 'Select a type' },
                ...contentTypes.map((t) => ({ value: t.id.toString(), label: t.name })),
              ]}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              id="difficulty"
              name="difficulty"
              label="Difficulty"
              defaultValue={initialData?.difficulty || ''}
              options={[
                { value: '', label: 'Select difficulty' },
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
            <Input
              id="sourceCompany"
              name="sourceCompany"
              label="Source Company"
              defaultValue={initialData?.question?.sourceCompany || ''}
              placeholder="e.g., Google, Meta"
            />
          </div>
          <Input
            id="tags"
            name="tags"
            label="Tags (comma separated)"
            defaultValue={parseTags(initialData?.question?.tags || null)}
            placeholder="e.g., arrays, dynamic-programming"
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="content"
            name="content"
            label="Question"
            rows={6}
            defaultValue={initialData?.question?.content || ''}
            placeholder="Enter the question content..."
          />
          <Textarea
            id="answer"
            name="answer"
            label="Answer"
            rows={10}
            defaultValue={initialData?.question?.answer || ''}
            placeholder="Enter the answer..."
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                value="true"
                defaultChecked={initialData?.isAvailable ?? false}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Published (visible to users)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVerified"
                value="true"
                defaultChecked={initialData?.question?.isVerified ?? false}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Verified from real interview</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Question' : 'Create Question'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
