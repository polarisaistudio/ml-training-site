interface ContentProgressProps {
  available: number;
  total: number;
  showBar?: boolean;
}

export function ContentProgress({ available, total, showBar = true }: ContentProgressProps) {
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-medium text-gray-900">{available}</span>
          <span className="text-gray-400">/{total}</span>
          <span className="text-gray-500 ml-1">available</span>
        </span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      {showBar && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
