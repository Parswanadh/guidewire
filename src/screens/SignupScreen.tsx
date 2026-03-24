import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CoverageTierCard } from '../components/dashboard/CoverageTierCard';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type CoverageTier, COVERAGE_TIERS } from '../lib/mockData';

type SignupStep = 'mobile' | 'otp' | 'store' | 'coverage';

export default function SignupScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<SignupStep>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedTier, setSelectedTier] = useState<CoverageTier>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep('store');
    }
  };

  const handleStoreConfirm = () => {
    setStep('coverage');
  };

  const handleSignupComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await login(mobile, otp || '123456');
    setIsLoading(false);
    navigate('/home');
  };

  const renderStep = () => {
    switch (step) {
      case 'mobile':
        return (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">{t.enterMobile}</h2>
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <Input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
              <Button type="submit" fullWidth size="lg" disabled={mobile.length < 10}>
                {t.sendOtp}
              </Button>
            </form>
          </motion.div>
        );
      case 'otp':
        return (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold text-white mb-2">{t.enterOtp}</h2>
            <p className="text-gray-400 mb-6">{t.otpSent} +91 {mobile}</p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
              <Button type="submit" fullWidth size="lg" disabled={otp.length < 6}>
                {t.verifyOtp}
              </Button>
              <button
                type="button"
                className="w-full text-purple-400 text-sm font-medium hover:underline"
              >
                {t.resendOtp}
              </button>
            </form>
          </motion.div>
        );
      case 'store':
        return (
          <motion.div
            key="store"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t.darkStore}</h2>
            <Card variant="glass" className="p-6 mb-8 text-center border-purple-500/50">
              <h3 className="text-white font-bold text-lg mb-1">Koramangala 4th Block</h3>
              <p className="text-purple-400 font-mono text-sm">BLK-BLR-047</p>
            </Card>
            <p className="text-gray-400 text-sm mb-8">We have pre-filled this based on your Blinkit Partner ID.</p>
            <div className="space-y-3">
              <Button onClick={handleStoreConfirm} fullWidth size="lg">
                {t.confirm}
              </Button>
              <button className="text-gray-500 text-sm hover:underline">{t.back}</button>
            </div>
          </motion.div>
        );
      case 'coverage':
        return (
          <motion.div
            key="coverage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold text-white mb-2 text-center">{t.chooseCoverage}</h2>
            <p className="text-gray-400 text-center mb-6">{t.coverageDesc}</p>
            <div className="space-y-4 mb-8">
              {(['basic', 'standard', 'premium'] as CoverageTier[]).map((tier) => (
                <CoverageTierCard
                  key={tier}
                  tier={tier}
                  selected={selectedTier === tier}
                  onSelect={() => setSelectedTier(tier)}
                />
              ))}
            </div>
            <Card variant="glass" className="p-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Weekly Premium</span>
                <span className="text-white font-bold text-xl">
                  ₹{COVERAGE_TIERS[selectedTier].dailyRate * 7}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Deducted automatically from your Blinkit weekly settlement every Friday.
              </p>
              <Button
                onClick={handleSignupComplete}
                isLoading={isLoading}
                fullWidth
                size="lg"
              >
                {t.selectPlan}
              </Button>
            </Card>
          </motion.div>
        );
    }
  };

  const getStepProgress = () => {
    const steps: SignupStep[] = ['mobile', 'otp', 'store', 'coverage'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          <span className="text-white font-bold">ShieldRide</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${getStepProgress()}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-xs">
        <p>© 2026 ShieldRide. Parametric Income Protection.</p>
      </footer>
    </div>
  );
}
