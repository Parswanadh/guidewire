import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Claim } from '../../lib/mockData';
import { useI18n } from '../../context/LanguageContext';

interface ClaimsTimelineProps {
  claims: Claim[];
}

const statusIcons = {
  credited: CheckCircle2,
  rejected: XCircle,
  processing: Clock,
} as const;

const statusVariants = {
  credited: 'success',
  rejected: 'error',
  processing: 'warning',
} as const;

export function ClaimsTimeline({ claims }: ClaimsTimelineProps) {
  const { strings } = useI18n();

  if (claims.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">{strings.noClaims}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => {
        const StatusIcon = statusIcons[claim.status];

        return (
          <Card key={claim.id} variant="glass" className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    claim.status === 'credited' ? 'bg-green-500/20' :
                    claim.status === 'rejected' ? 'bg-red-500/20' :
                    'bg-yellow-500/20'
                  }`}
                >
                  <StatusIcon
                    className={`w-5 h-5 ${
                      claim.status === 'credited' ? 'text-green-400' :
                      claim.status === 'rejected' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">{claim.triggerType}</p>
                  <p className="text-sm text-gray-400">{claim.description}</p>
                </div>
              </div>
              <Badge variant={statusVariants[claim.status]} size="sm">
                {(strings as any)[claim.status]}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{claim.date}</span>
              <span className="text-white font-medium">₹{claim.amount.toLocaleString()}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
