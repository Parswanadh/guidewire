import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Check, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LocationScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');

  const handleDetectLocation = () => {
    setStatus('detecting');
    // Simulate location detection
    setTimeout(() => {
      setStatus('detected');
    }, 2000);
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.detectLocation}</h1>
          <p className="text-gray-400">{t.locationDesc}</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button onClick={handleDetectLocation} fullWidth size="lg" className="flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />
                {t.allowLocation}
              </Button>
            </motion.div>
          )}

          {status === 'detecting' && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">{t.detecting}</h2>
            </motion.div>
          )}

          {status === 'detected' && (
            <motion.div
              key="detected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card variant="glass" className="p-6 border-green-500/30">
                <div className="flex items-center gap-3 text-green-400 mb-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{t.locationDetected}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">{t.darkStore}</p>
                    <p className="text-white font-bold text-lg">{user?.darkStore}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-gray-400 text-sm">{t.currentZone}</p>
                    <p className="text-white font-semibold">{user?.zone}</p>
                  </div>
                </div>
              </Card>

              <Button onClick={handleContinue} fullWidth size="lg">
                {t.continue}
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">{t.locationDenied}</p>
              <Button onClick={handleDetectLocation} variant="outline" fullWidth>
                {t.retry}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
