import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentProgress } from '@/components/ContentProgress';

interface StageCardProps {
  slug: string;
  name: string;
  description: string | null;
  weekRange: string | null;
  goal: string | null;
  order: number;
  availableCount: number;
  totalCount: number;
}

export function StageCard({
  slug,
  name,
  description,
  weekRange,
  goal,
  order,
  availableCount,
  totalCount,
}: StageCardProps) {
  return (
    <Link href={`/stages/${slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="info">Stage {order}</Badge>
            {weekRange && (
              <span className="text-sm text-gray-500">{weekRange}</span>
            )}
          </div>
          <CardTitle>{name}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {goal && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Goal: </span>
              <span className="text-sm text-gray-600">{goal}</span>
            </div>
          )}
          <ContentProgress available={availableCount} total={totalCount} />
        </CardContent>
      </Card>
    </Link>
  );
}
