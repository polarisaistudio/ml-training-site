'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createProject, updateProject } from '../actions';
import type { Stage } from '@/types';

interface ProjectData {
  id: number;
  title: string;
  description: string | null;
  stageId: number | null;
  difficulty: string | null;
  isAvailable: boolean;
  project: {
    content: string | null;
    resumeBullets: string | null;
    estimatedHours: number | null;
  };
}

interface Props {
  stages: Stage[];
  initialData?: ProjectData;
}

export function ProjectForm({ stages, initialData }: Props) {
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
      result = await updateProject(initialData.id, formData);
    } else {
      result = await createProject(formData);
    }

    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
    } else {
      setError(result.error || 'An error occurred');
    }

    setLoading(false);
  }

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
            placeholder="e.g., Build a Sentiment Analysis Model"
          />
          <Textarea
            id="description"
            name="description"
            label="Short Description"
            rows={2}
            defaultValue={initialData?.description || ''}
            placeholder="Brief overview shown in listings"
          />
          <div className="grid gap-4 md:grid-cols-3">
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
              id="estimatedHours"
              name="estimatedHours"
              label="Estimated Hours"
              type="number"
              min="1"
              defaultValue={initialData?.project?.estimatedHours?.toString() || ''}
              placeholder="e.g., 8"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="content"
            name="content"
            label="Tutorial Content (Markdown)"
            rows={15}
            defaultValue={initialData?.project?.content || ''}
            placeholder={`# Project Overview

## Learning Objectives
- Objective 1
- Objective 2

## Prerequisites
- Python basics
- Pandas knowledge

## Step 1: Setup
...

## Step 2: Data Preparation
...`}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resume Bullets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="resumeBullets"
            name="resumeBullets"
            label="Resume Bullet Points (one per line)"
            rows={6}
            defaultValue={initialData?.project?.resumeBullets || ''}
            placeholder={`Developed a sentiment analysis model achieving 92% accuracy on 50K+ product reviews
Implemented NLP pipeline using BERT embeddings, reducing inference time by 40%
Built end-to-end ML pipeline with data preprocessing, model training, and deployment`}
          />
          <p className="text-sm text-gray-500">
            Write quantified achievements that candidates can adapt for their resumes.
            Each line becomes a bullet point.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
