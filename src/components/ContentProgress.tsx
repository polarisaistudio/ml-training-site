interface ContentProgressProps {
  available: number;
  total: number;
  showBar?: boolean;
  label?: "available" | "completed" | "items";
}

export function ContentProgress({
  available,
  total,
  showBar = true,
  label = "items",
}: ContentProgressProps) {
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  const labelText = {
    available: "available",
    completed: "completed",
    items: "items",
  }[label];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-medium text-gray-900">{available}</span>
          <span className="text-gray-500 ml-1">{labelText}</span>
        </span>
        {label === "completed" && (
          <span className="text-gray-500">{percentage}%</span>
        )}
      </div>
      {showBar && label === "completed" && (
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
