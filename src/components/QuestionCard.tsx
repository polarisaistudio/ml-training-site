import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { getDifficultyColor } from '@/lib/utils';

interface QuestionCardProps {
  id: number;
  title: string;
  contentType: string | null;
  difficulty: string | null;
  sourceCompany: string | null;
  isVerified: boolean;
  stageName?: string | null;
}

export function QuestionCard({
  id,
  title,
  contentType,
  difficulty,
  sourceCompany,
  isVerified,
  stageName,
}: QuestionCardProps) {
  return (
    <Link href={`/questions/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {contentType && (
                  <Badge variant="default">{contentType}</Badge>
                )}
                {difficulty && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                )}
                {stageName && (
                  <Badge variant="info">{stageName}</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {isVerified && <VerifiedBadge />}
              {sourceCompany && (
                <span className="text-xs text-gray-500">{sourceCompany}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
