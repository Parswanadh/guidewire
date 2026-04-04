import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Navigation, User, Phone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CoverageTierCard } from '../components/dashboard/CoverageTierCard';
import { PolicySimulator } from '../components/dashboard/PolicySimulator';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, type DynamicQuote, type NearbyHub } from '../lib/apiClient';
import type { CoverageTier } from '../lib/mockData';

type SignupStep = 'account' | 'location' | 'policy';

export default function SignupScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { riderSignUp } = useAuth();

  const [step, setStep] = useState<SignupStep>('account');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [selectedTier, setSelectedTier] = useState<CoverageTier>('standard');
  const [hoursPerDay, setHoursPerDay] = useState(8);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hubs, setHubs] = useState<NearbyHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<NearbyHub | null>(null);
  const [lastDetectedAt, setLastDetectedAt] = useState('');

  const [quote, setQuote] = useState<DynamicQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const canProceedAccount = useMemo(() => {
    return name.trim().length >= 2 && /^[6-9]\d{9}$/.test(mobile) && password.length >= 6;
  }, [name, mobile, password]);

  useEffect(() => {
    const loadQuote = async () => {
      if (!coords) return;
      try {
        setQuoteLoading(true);
        const response = await apiClient.getPricingQuote({
          plan: selectedTier,
          lat: coords.lat,
          lng: coords.lng,
          hoursPerDay,
        });
        setQuote(response.quote);
      } catch {
        setQuote(null);
      } finally {
        setQuoteLoading(false);
      }
    };

    loadQuote();
  }, [coords, selectedTier, hoursPerDay]);

  const handleDetectLocation = async () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const nextCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoords(nextCoords);

          const result = await apiClient.getNearbyHubs(nextCoords.lat, nextCoords.lng);
          setHubs(result.hubs);
          setSelectedHub(result.hubs[0] || null);
          setLastDetectedAt(new Date().toLocaleTimeString());
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch nearby hubs');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setError(geoError.message || 'Unable to access location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const handleSignupComplete = async () => {
    if (!coords || !selectedHub) {
      setError('Please detect location and select a local hub before continuing');
      return;
    }

    setError('');
    try {
      setIsLoading(true);
      await riderSignUp({
        name: name.trim(),
        mobile,
        password,
        plan: selectedTier,
        partnerId: partnerId.trim(),
        hubId: selectedHub._id,
        location: coords,
      });
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create rider account');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    const steps: SignupStep[] = ['account', 'location', 'policy'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen sr-screen-auth flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => (step === 'account' ? navigate('/login') : setStep(step === 'policy' ? 'location' : 'account'))}
          aria-label="Go to previous signup step"
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="text-white font-bold">ShieldRide</span>
        </div>
        <div className="w-10" />
      </header>

      <div className="px-6 mb-6">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${getStepProgress()}%` }}
          />
        </div>
      </div>

      <main className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl text-white font-bold">Create Rider Account</h2>
              <p className="text-gray-400 text-sm">Signup for rider protection with separate rider and insurer portals.</p>

              <Card variant="glass" className="p-4 space-y-4">
                <Input
                  label={t.fullName}
                  autoComplete="name"
                  placeholder="Ravi Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  autoFocus
                />
                <Input
                  label={t.mobileNumber}
                  type="tel"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Partner ID (optional)"
                  placeholder="BLK-BLR-047"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                />

                <Button
                  onClick={() => setStep('location')}
                  disabled={!canProceedAccount}
                  fullWidth
                  size="lg"
                >
                  Continue to Location Setup
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl text-white font-bold">GPS Hub Assignment</h2>
              <p className="text-gray-400 text-sm">Detect rider location and choose the nearest local hub with full visibility before activation.</p>

              <Card variant="glass" className="p-4 space-y-4">
                <Button
                  onClick={handleDetectLocation}
                  isLoading={isLocating}
                  fullWidth
                  variant="secondary"
                  size="lg"
                >
                  <span className="inline-flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    {coords ? 'Re-detect GPS' : 'Detect Live GPS'}
                  </span>
                </Button>

                {coords && (
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-200">
                    Location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    {lastDetectedAt && (
                      <p className="mt-1 text-xs text-blue-100/80">Last detected at {lastDetectedAt}</p>
                    )}
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-gray-300">
                    Why this hub: we rank hubs by live distance from your GPS so trigger and payout checks remain accurate for your active zone.
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-auto">
                  {hubs.map((hub) => (
                    <button
                      key={hub._id}
                      onClick={() => setSelectedHub(hub)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${
                        selectedHub?._id === hub._id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-900/40 hover:border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{hub.name}</p>
                          <p className="text-xs text-gray-400">{hub.code} | {hub.zone}</p>
                        </div>
                        <div className="text-xs text-blue-300">{hub.distanceKm} km</div>
                      </div>
                    </button>
                  ))}

                  {!isLocating && hubs.length === 0 && (
                    <div className="rounded-xl border border-gray-700 bg-gray-900/40 p-3 text-sm text-gray-400">
                      No hubs loaded yet. Tap "Detect Live GPS" first.
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setStep('policy')}
                  disabled={!selectedHub || !coords}
                  fullWidth
                  size="lg"
                >
                  Continue to Pricing
                </Button>

                {selectedHub && (
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm">
                    <p className="text-emerald-200 font-medium">Selected hub: {selectedHub.name}</p>
                    <p className="text-xs text-emerald-100/80 mt-1">
                      {selectedHub.code} | {selectedHub.zone} | {selectedHub.distanceKm} km away
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {step === 'policy' && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl text-white font-bold">Onboarding Policy + Dynamic Pricing</h2>
              <p className="text-gray-400 text-sm">Policy visibility is mandatory before account activation.</p>

              <PolicySimulator />

              <Card variant="glass" className="p-4 space-y-4">
                <h3 className="text-white font-semibold">Choose Coverage Tier</h3>
                {(['basic', 'standard', 'premium'] as CoverageTier[]).map((tier) => (
                  <CoverageTierCard
                    key={tier}
                    tier={tier}
                    selected={selectedTier === tier}
                    onSelect={() => setSelectedTier(tier)}
                  />
                ))}

                <div>
                  <label className="text-sm text-gray-300 block mb-1">Hours per day</label>
                  <input
                    type="range"
                    min={4}
                    max={14}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400">{hoursPerDay} hrs/day</p>
                </div>

                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                  {quoteLoading ? (
                    <p className="text-sm text-blue-200">Calculating live premium...</p>
                  ) : quote ? (
                    <div className="space-y-2 text-sm">
                      <p className="text-white font-semibold">Dynamic Quote ({quote.plan})</p>
                      <p className="text-blue-200">Risk Score: {quote.riskScore}%</p>
                      <p className="text-blue-200">Daily Premium: ₹{quote.dailyPremium}</p>
                      <p className="text-blue-200">Weekly Premium: ₹{quote.weeklyPremium}</p>
                      <p className="text-blue-200">Daily Coverage: ₹{quote.dailyCoverage}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Quote unavailable. Ensure GPS and hub are selected.</p>
                  )}
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button onClick={handleSignupComplete} isLoading={isLoading} fullWidth size="lg">
                  Complete Rider Signup
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
