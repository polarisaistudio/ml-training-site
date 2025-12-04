'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createQuestion } from '../actions';
import type { Stage, ContentType } from '@/types';

interface Props {
  stages: Stage[];
  contentTypes: ContentType[];
}

export function RealQuestionForm({ stages, contentTypes }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Build real interview details object
    const followUpQuestionsRaw = formData.get('followUpQuestions') as string;
    const followUpQuestions = followUpQuestionsRaw
      ? followUpQuestionsRaw.split('\n').map(q => q.trim()).filter(Boolean)
      : [];

    const realInterviewDetails = {
      company: formData.get('company') as string || undefined,
      position: formData.get('position') as string || undefined,
      interviewDate: formData.get('interviewDate') as string || undefined,
      result: formData.get('result') as 'passed' | 'failed' | 'pending' || undefined,
      interviewerFocus: formData.get('interviewerFocus') as string || undefined,
      hintsGiven: formData.get('hintsGiven') as string || undefined,
      followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
      myPerformance: formData.get('myPerformance') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    // Set source type to real-interview
    formData.set('sourceType', 'real-interview');
    formData.set('realInterviewDetails', JSON.stringify(realInterviewDetails));

    // Use company as sourceCompany if provided
    if (realInterviewDetails.company) {
      formData.set('sourceCompany', realInterviewDetails.company);
    }

    // Set isVerified to true for real interview questions
    formData.set('isVerified', 'true');

    const result = await createQuestion(formData);

    if (result.success) {
      router.push('/admin/real-questions');
      router.refresh();
    } else {
      setError(result.error || 'An error occurred');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Interview Details Section */}
      <Card className="mb-6 border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-red-900">🎯 Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="company"
              name="company"
              label="Company *"
              placeholder="e.g., Google, Meta, Amazon"
              required
            />
            <Input
              id="position"
              name="position"
              label="Position *"
              placeholder="e.g., ML Engineer, Software Engineer"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="interviewDate"
              name="interviewDate"
              label="Interview Date *"
              type="date"
              required
            />
            <Select
              id="result"
              name="result"
              label="Result"
              defaultValue="pending"
              options={[
                { value: 'pending', label: '⏳ Pending' },
                { value: 'passed', label: '✓ Passed' },
                { value: 'failed', label: '✗ Failed' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Details Section */}
      <Card className="mb-6 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-blue-900">📝 Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Question Title *"
            placeholder="e.g., Two Sum, Design LRU Cache"
            required
          />
          <Textarea
            id="content"
            name="content"
            label="Question Content (Markdown) *"
            rows={10}
            placeholder={`Describe the question as you remember it...

**Example:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
\`\`\`

Include any constraints or requirements the interviewer mentioned.`}
            required
          />
          <Textarea
            id="answer"
            name="answer"
            label="Answer / Solution (Markdown, Optional)"
            rows={10}
            placeholder={`## Hints

### Hint 1
Think about using a hash table...

### Hint 2
Store complements as you iterate...

## Answer

### Approach: Hash Table

\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
\`\`\`

**Time:** O(n) | **Space:** O(n)`}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              id="difficulty"
              name="difficulty"
              label="Difficulty *"
              defaultValue="medium"
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
            <Input
              id="tags"
              name="tags"
              label="Tags (comma-separated) *"
              placeholder="e.g., array, hash-table, two-pointers"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              id="stageId"
              name="stageId"
              label="Stage"
              options={[
                { value: '', label: 'Select a stage' },
                ...stages.map((s) => ({ value: s.id.toString(), label: s.name })),
              ]}
            />
            <Select
              id="contentTypeId"
              name="contentTypeId"
              label="Content Type"
              options={[
                { value: '', label: 'Select a type' },
                ...contentTypes.map((t) => ({ value: t.id.toString(), label: t.name })),
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interview Notes Section */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50/30">
        <CardHeader>
          <CardTitle className="text-yellow-900">📋 Interview Notes & Insights</CardTitle>
          <p className="text-sm text-yellow-700">
            These details help you remember what happened during the interview
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="interviewerFocus"
            name="interviewerFocus"
            label="What did the interviewer focus on?"
            rows={3}
            placeholder="e.g., Emphasized O(n) time complexity, asked about space tradeoffs, wanted clean code..."
          />
          <Textarea
            id="hintsGiven"
            name="hintsGiven"
            label="Hints the interviewer gave you"
            rows={3}
            placeholder="e.g., After 5 minutes, suggested looking at hash tables..."
          />
          <Textarea
            id="followUpQuestions"
            name="followUpQuestions"
            label="Follow-up questions (one per line)"
            rows={4}
            placeholder={`What if the array is sorted?
How would you handle duplicates?
Can you optimize space complexity?
What's the time complexity?`}
          />
          <Textarea
            id="myPerformance"
            name="myPerformance"
            label="How did you perform?"
            rows={3}
            placeholder="e.g., Got the brute force quickly, struggled with optimization, needed hint for hash table approach..."
          />
          <Textarea
            id="notes"
            name="notes"
            label="Other notes"
            rows={3}
            placeholder="Any other observations or things to remember..."
          />
        </CardContent>
      </Card>

      {/* Publishing Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              value="true"
              defaultChecked={true}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Published (visible in question bank)
            </span>
          </label>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
          {loading ? 'Saving...' : '🎯 Add Real Interview Question'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
