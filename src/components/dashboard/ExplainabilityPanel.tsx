import { CircleHelp, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ClaimItem, TriggerItem } from '../../lib/apiClient';

interface ExplainabilityPanelProps {
  triggers: TriggerItem[];
  claims: ClaimItem[];
}

function getConfidenceLabel(trigger?: TriggerItem) {
  if (!trigger) return 'Insufficient data';
  if (trigger.status === 'active') return 'High confidence';
  if (trigger.status === 'warning' || trigger.status === 'pending') return 'Medium confidence';
  return 'Stable conditions';
}

export function ExplainabilityPanel({ triggers, claims }: ExplainabilityPanelProps) {
  const trigger =
    triggers.find((item) => item.status === 'active' || item.status === 'warning') ||
    triggers[0];

  const latestClaim = claims[0];
  const payoutAmount = trigger?.payout || latestClaim?.amount || 0;

  return (
    <Card variant="glass" className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CircleHelp className="w-4 h-4 text-blue-300" />
          <h3 className="text-white font-semibold">Why This Trigger</h3>
        </div>
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-200">
          {getConfidenceLabel(trigger)}
        </span>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="text-sm text-white font-medium">
          {trigger ? `${trigger.type} signal detected at ${trigger.intensity}` : 'No disruption trigger currently active'}
        </p>
        <p className="mt-1 text-xs text-gray-300">
          {trigger ? trigger.description : 'Monitoring continues across weather and platform signals for your assigned hub.'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3">
        <div>
          <p className="text-xs text-emerald-200 uppercase tracking-wide">Why This Payout</p>
          <p className="text-sm text-white font-medium">
            Parametric payout is severity-linked, no manual claim filing required.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-emerald-200">Current estimate</p>
          <p className="text-xl font-bold text-white">₹{payoutAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
        <Sparkles className="mt-0.5 w-4 h-4 text-indigo-300" />
        <p className="text-xs text-gray-300">
          This estimate combines live risk intensity, your active plan, and configured hub-level disruption rules.
        </p>
      </div>

      {latestClaim && (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-300" />
            <p className="text-xs text-gray-300">Latest credited timeline</p>
          </div>
          <p className="text-xs text-white font-medium">{latestClaim.date}</p>
        </div>
      )}
    </Card>
  );
}
