import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { t, strings } = useI18n();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(t.invalidMobile);
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError(t.invalidOtp);
      return;
    }

    setIsLoading(true);
    const success = await login(mobile, otp);
    setIsLoading(false);

    if (success) {
      navigate('/location');
    } else {
      setError(t.invalidOtp);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    startCountdown();
    setOtp('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex items-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 px-6 pb-8 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.login}</h1>
          <p className="text-gray-400">{strings.appTagline}</p>
        </div>

        <Card variant="glass" className="p-6">
          {step === 'mobile' ? (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <Input
                label={t.mobileNumber}
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                leftIcon={<Phone className="w-5 h-5" />}
                error={error}
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={mobile.length !== 10}
                fullWidth
                size="lg"
              >
                {t.sendOtp}
              </Button>
              <p className="text-center text-xs text-blue-400/60 mt-2">
                {t.loginNote}
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-400 mb-1">{t.otpSent} +91 {mobile}</p>
                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Change number
                </button>
              </div>

              <Input
                label={t.enterOtp}
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                error={error}
                autoFocus
                className="text-center text-2xl tracking-widest"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={otp.length !== 6}
                fullWidth
                size="lg"
              >
                {t.verifyOtp}
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isLoading}
                className="w-full text-center text-blue-400 text-sm hover:underline disabled:text-gray-500 disabled:no-underline"
              >
                {countdown > 0 ? `${t.resendOtp} in ${countdown}s` : t.resendOtp}
              </button>
            </form>
          )}
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          {t.dontHaveAccount}{' '}
          <button onClick={() => navigate('/signup')} className="text-blue-400 hover:underline">
            {t.signup}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
