'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProject } from '../actions';

interface Props {
  id: number;
  title: string;
}

export function DeleteProjectButton({ id, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setLoading(true);
    const result = await deleteProject(id);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete project');
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
