'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createInterviewLog, updateInterviewLog } from '../actions';
import type { InterviewLog } from '@/types';

interface Props {
  initialData?: InterviewLog;
}

export function InterviewLogForm({ initialData }: Props) {
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
      result = await updateInterviewLog(initialData.id, formData);
    } else {
      result = await createInterviewLog(formData);
    }

    if (result.success) {
      router.push('/admin/interview-logs');
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
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="company"
              name="company"
              label="Company *"
              defaultValue={initialData?.company || ''}
              required
            />
            <Input
              id="position"
              name="position"
              label="Position"
              defaultValue={initialData?.position || ''}
              placeholder="e.g., ML Engineer, Senior Data Scientist"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id="interviewDate"
              name="interviewDate"
              label="Interview Date"
              type="date"
              defaultValue={initialData?.interviewDate || ''}
            />
            <Select
              id="roundType"
              name="roundType"
              label="Round Type"
              defaultValue={initialData?.roundType || ''}
              options={[
                { value: '', label: 'Select round type' },
                { value: 'Phone Screen', label: 'Phone Screen' },
                { value: 'Technical Phone', label: 'Technical Phone' },
                { value: 'Onsite - Coding', label: 'Onsite - Coding' },
                { value: 'Onsite - ML', label: 'Onsite - ML' },
                { value: 'Onsite - System Design', label: 'Onsite - System Design' },
                { value: 'Onsite - Behavioral', label: 'Onsite - Behavioral' },
                { value: 'Final Round', label: 'Final Round' },
                { value: 'Other', label: 'Other' },
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
          </div>
          <Select
            id="result"
            name="result"
            label="Result"
            defaultValue={initialData?.result || ''}
            options={[
              { value: '', label: 'Select result' },
              { value: 'passed', label: 'Passed' },
              { value: 'failed', label: 'Failed' },
              { value: 'pending', label: 'Pending' },
              { value: 'ghosted', label: 'Ghosted' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Questions & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="questionsAsked"
            name="questionsAsked"
            label="Questions Asked"
            rows={6}
            defaultValue={initialData?.questionsAsked || ''}
            placeholder="List the questions that were asked during this interview..."
          />
          <Textarea
            id="notes"
            name="notes"
            label="Additional Notes"
            rows={4}
            defaultValue={initialData?.notes || ''}
            placeholder="Any additional notes, impressions, or learnings..."
          />
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Log' : 'Create Log'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
