import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InsurerLoginScreen() {
  const navigate = useNavigate();
  const { insurerSignIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      await insurerSignIn(email, password);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in as insurer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen sr-screen-auth flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex items-center"
      >
        <button
          onClick={() => navigate('/login')}
          aria-label="Go back to rider login"
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 px-6 pb-8 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sr-brand-mark-insurer rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Insurer Login</h1>
          <p className="text-gray-400">Operations console access for insurer team</p>
        </div>

        <Card variant="glass" className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              autoComplete="email"
              placeholder="insurer@shieldride.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />

            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              disabled={!email || !password}
              fullWidth
              size="lg"
            >
              Sign In as Insurer
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4" />
              Demo default credentials
            </div>
            <p>Email: insurer@shieldride.ai</p>
            <p>Password: Insurer@123</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
