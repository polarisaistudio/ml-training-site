'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { deleteInterviewLog } from '../actions';

interface Props {
  id: number;
  company: string;
}

export function DeleteInterviewLogButton({ id, company }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the interview log for "${company}"?`)) {
      return;
    }

    setLoading(true);
    const result = await deleteInterviewLog(id);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete interview log');
    }

    setLoading(false);
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
