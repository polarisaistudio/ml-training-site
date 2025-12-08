'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ContentTypeTabsProps {
  contentTypes: { slug: string; name: string; count: number }[];
  activeType: string;
}

export function ContentTypeTabs({ contentTypes, activeType }: ContentTypeTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/questions?${params.toString()}`);
  };

  // Calculate total count
  const totalCount = contentTypes.reduce((sum, ct) => sum + ct.count, 0);

  // Get icon for content type
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'ml_concept':
        return '📖';
      case 'ml_coding':
        return '💻';
      case 'algorithm_problem':
        return '🧩';
      case 'system_design':
        return '🏗️';
      case 'bq_question':
        return '💬';
      default:
        return '📝';
    }
  };

  // Get display name for content type
  const getDisplayName = (slug: string, name: string) => {
    switch (slug) {
      case 'ml_concept':
        return 'ML Concepts';
      case 'ml_coding':
        return 'ML Coding';
      case 'algorithm_problem':
        return 'Algorithms';
      default:
        return name;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* All button */}
      <button
        onClick={() => handleTypeChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeType === 'all'
            ? 'bg-gray-800 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
          activeType === 'all' ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          {totalCount}
        </span>
      </button>

      {/* Content type buttons */}
      {contentTypes.map((ct) => (
        <button
          key={ct.slug}
          onClick={() => handleTypeChange(ct.slug)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeType === ct.slug
              ? ct.slug === 'ml_concept'
                ? 'bg-purple-600 text-white shadow-md'
                : ct.slug === 'ml_coding'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{getIcon(ct.slug)}</span>
          {getDisplayName(ct.slug, ct.name)}
          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
            activeType === ct.slug
              ? ct.slug === 'ml_concept'
                ? 'bg-purple-500'
                : ct.slug === 'ml_coding'
                ? 'bg-emerald-500'
                : 'bg-blue-500'
              : 'bg-gray-200'
          }`}>
            {ct.count}
          </span>
        </button>
      ))}
    </div>
  );
}
