import { motion } from 'framer-motion';
import { MapPin, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LocationScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDetected, setIsDetected] = useState(false);

  const handleDetect = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      setIsDetected(true);
    }, 2000);
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.detectLocation}</h1>
          <p className="text-gray-400">{t.locationDesc}</p>
        </div>

        <Card variant="glass" className="p-6 mb-8">
          {!isDetected ? (
            <div className="space-y-6">
              <div className="relative h-48 bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
                </div>
                {isDetecting ? (
                  <div className="relative">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="w-16 h-16 rounded-full"></div>
                  </div>
                ) : (
                  <Shield className="w-12 h-12 text-gray-700" />
                )}
              </div>
              <Button
                onClick={handleDetect}
                isLoading={isDetecting}
                fullWidth
                variant="primary"
                size="lg"
              >
                {t.allowLocation}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-400 font-medium">{t.locationDetected}</p>
                  <p className="text-white font-bold">Koramangala, Bengaluru</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">{t.currentZone}</span>
                  <span className="text-white font-medium">Zone 4</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">{t.darkStore}</span>
                  <span className="text-white font-medium">BLK-BLR-047</span>
                </div>
              </div>

              <Button onClick={handleContinue} fullWidth variant="primary" size="lg">
                {t.continue}
              </Button>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
