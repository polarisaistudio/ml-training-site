'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { deleteQuestion } from '../actions';

interface Props {
  id: number;
  title: string;
}

export function DeleteQuestionButton({ id, title }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setLoading(true);
    const result = await deleteQuestion(id);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete question');
    }

    setLoading(false);
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
