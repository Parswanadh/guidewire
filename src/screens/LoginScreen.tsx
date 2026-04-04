import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Shield, Building2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { t, strings } = useI18n();
  const navigate = useNavigate();
  const { riderSignIn } = useAuth();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(t.invalidMobile);
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      const rider = await riderSignIn(mobile, password);
      navigate(rider.darkStore ? '/home' : '/location');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen sr-screen-auth flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex items-center"
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
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
          <div className="inline-flex items-center justify-center w-16 h-16 sr-brand-mark rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.login}</h1>
          <p className="text-gray-400">{strings.appTagline}</p>
        </div>

        <Card variant="glass" className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.mobileNumber}
              type="tel"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              leftIcon={<Phone className="w-5 h-5" />}
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={mobile.length !== 10 || password.length < 6}
              fullWidth
              size="lg"
            >
              {t.login}
            </Button>
          </form>

          <button
            onClick={() => navigate('/insurer-login')}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-300 hover:bg-indigo-500/20 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Sign in as Insurer
          </button>
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
