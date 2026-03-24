import { Shield, Check, IndianRupee } from 'lucide-react';
import { Card } from '../ui/Card';
import type { CoverageTier } from '../../lib/mockData';
import { useI18n } from '../../context/LanguageContext';
import { COVERAGE_TIERS } from '../../lib/mockData';

interface CoverageTierCardProps {
  tier: CoverageTier;
  selected: boolean;
  onSelect: () => void;
}

const tierIcons = {
  basic: '🛡️',
  standard: '⭐',
  premium: '👑',
};

export function CoverageTierCard({ tier, selected, onSelect }: CoverageTierCardProps) {
  const { strings } = useI18n();
  const config = COVERAGE_TIERS[tier];

  return (
    <Card
      variant={selected ? 'gradient' : 'glass'}
      onClick={onSelect}
      className={`relative border-2 transition-all ${
        selected ? 'border-purple-500 shadow-purple-500/20' : 'border-transparent'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="text-center mb-4">
        <span className="text-4xl">{tierIcons[tier]}</span>
        <h3 className="text-white font-bold text-xl mt-2 capitalize">{strings[tier]}</h3>
        <div className="flex items-center justify-center gap-1 mt-1">
          <IndianRupee className="w-4 h-4 text-purple-400" />
          <span className="text-2xl font-bold text-white">{config.dailyRate * 7}</span>
          <span className="text-gray-400">/{strings.week}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm text-center mb-4">{strings[`${tier}Desc`]}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">₹{config.dailyCoverage} {strings.dailyProtection}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">7 {strings.triggersCovered}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">{strings.autoPayout}</span>
        </div>
      </div>
    </Card>
  );
}
