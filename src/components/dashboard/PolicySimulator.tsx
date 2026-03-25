import { useState } from 'react';
import { Info, Calculator, Droplets, Thermometer, Wind } from 'lucide-react';
import { Card } from '../ui/Card';
import { useI18n } from '../../context/LanguageContext';

export function PolicySimulator() {
  const { t } = useI18n();
  const [severity, setSeverity] = useState(30); // 0 to 100

  // Calculation logic: payout increases with severity
  const calculatePayout = (sev: number) => {
    if (sev < 20) return 0;
    if (sev < 50) return Math.floor(sev * 2.5);
    return Math.floor(sev * 4);
  };

  const payout = calculatePayout(severity);

  return (
    <Card variant="glass" className="p-5 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-lg">{t.policyTitle}</h3>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">
        {t.policyExplanation}
      </p>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h4 className="text-white text-sm font-medium flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-400" />
            {t.simulationTitle}
          </h4>
          <span className="text-xs text-gray-500 italic">Drag to simulate severity</span>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low Risk</span>
              <span className="text-purple-400 font-bold">{severity}% {t.severity}</span>
              <span>Extreme</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] text-gray-500 uppercase mb-1">{t.severity}</p>
              <div className="flex items-center gap-2">
                {severity > 60 ? (
                  <Droplets className="w-4 h-4 text-blue-400" />
                ) : severity > 30 ? (
                  <Wind className="w-4 h-4 text-teal-400" />
                ) : (
                  <Thermometer className="w-4 h-4 text-orange-400" />
                )}
                <span className="text-white font-bold">{severity > 50 ? 'Heavy' : 'Moderate'}</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <p className="text-[10px] text-purple-400 uppercase mb-1">{t.payoutAmount}</p>
              <p className="text-white font-bold text-xl">₹{payout}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5">
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-blue-400 mt-2" />
          <p className="text-[11px] text-gray-500">
            Payouts are instant and automatic when sensors detect severity levels above 20%.
          </p>
        </div>
      </div>
    </Card>
  );
}
