import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, FileText, Users, Settings, LogOut, Menu, X, Activity, RefreshCw } from 'lucide-react';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldStatusCard } from '../components/dashboard/ShieldStatusCard';
import { TriggerMonitor } from '../components/dashboard/TriggerMonitor';
import { ClaimsTimeline } from '../components/dashboard/ClaimsTimeline';
import { VoiceAssistant } from '../components/dashboard/VoiceAssistant.tsx';
import { ExplainabilityPanel } from '../components/dashboard/ExplainabilityPanel';
import { LossRatioGauge } from '../components/dashboard/LossRatioGauge';
import { ReserveForecastPanel } from '../components/dashboard/ReserveForecastPanel';
import { FraudFeed } from '../components/dashboard/FraudFeed';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { apiClient, type ClaimItem, type TriggerItem } from '../lib/apiClient';

type TabType = 'overview' | 'triggers' | 'claims';

export default function HomeScreen() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [riderTriggers, setRiderTriggers] = useState<TriggerItem[]>([]);
  const [riderClaims, setRiderClaims] = useState<ClaimItem[]>([]);
  const [insurerData, setInsurerData] = useState<{
    metrics: {
      totalPolicies: number;
      activePolicies: number;
      totalClaims: number;
      pendingClaims: number;
      lossRatio: number;
      reserveAmount: number;
      projectedReserve: number;
      fraudScoreAvg: number;
      claimsByType: Array<{ type: string; count: number; amount: number }>;
    };
    riders: Array<{
      id: string;
      name: string;
      mobile: string;
      plan: string;
      weeklyPremium: number;
      darkStore: string;
      zone: string;
      createdAt: string;
      riskScore: number;
    }>;
    fraudAlerts: Array<{
      id: string;
      userName: string;
      riskLevel: 'low' | 'medium' | 'high';
      score: number;
      timestamp: string;
      reasons: string[];
      claimId: string;
    }>;
  } | null>(null);

  const isInsurer = user?.role === 'insurer';

  const tabs = useMemo(() => {
    if (isInsurer) {
      return [
        { id: 'overview' as const, label: 'Ops Map', icon: <Home className="w-4 h-4" /> },
        { id: 'triggers' as const, label: 'Riders', icon: <Users className="w-4 h-4" /> },
        { id: 'claims' as const, label: 'Fraud', icon: <FileText className="w-4 h-4" /> },
      ];
    }

    return [
      { id: 'overview' as const, label: 'Overview', icon: <Home className="w-4 h-4" /> },
      { id: 'triggers' as const, label: 'Live Risk', icon: <Activity className="w-4 h-4" /> },
      { id: 'claims' as const, label: 'History', icon: <FileText className="w-4 h-4" /> },
    ];
  }, [isInsurer]);

  const loadDashboard = async () => {
    if (!token || !user) return;
    setError('');
    setLoading(true);

    try {
      if (isInsurer) {
        const data = await apiClient.getInsurerDashboard(token);
        setInsurerData(data);
      } else {
        const data = await apiClient.getRiderDashboard(token);
        setRiderTriggers(data.triggers);
        setRiderClaims(data.claims);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderRiderContent = (tab: TabType) => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <ShieldStatusCard
              isActive={Boolean((user as any)?.shieldStatus?.active)}
              activeSince={new Date((user as any)?.createdAt || Date.now()).toLocaleDateString()}
              activeSincePetti={'08:30 AM'}
              latestOrderDelivered={new Date().toLocaleTimeString()}
              expiresOn={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              remainingDays={(user as any)?.shieldStatus?.remainingDays || 7}
              coverageAmount={(user as any)?.coverageAmount || 0}
            />

            <Card variant="glass" className="p-4">
              <h3 className="text-white font-semibold mb-3">Live Policy Context</h3>
              <div className="flex items-center justify-between gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div>
                  <p className="text-sm text-white font-medium">{(user as any)?.darkStore || 'Hub not assigned'}</p>
                  <p className="text-xs text-gray-400">Plan: {(user as any)?.plan || 'standard'} | Weekly premium: ₹{(user as any)?.weeklyPremium || 0}</p>
                </div>
                <button
                  onClick={loadDashboard}
                  aria-label="Refresh rider policy context"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 text-blue-300 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </Card>

            <ExplainabilityPanel triggers={riderTriggers} claims={riderClaims} />
          </div>
        );
      case 'triggers':
        return <TriggerMonitor triggers={riderTriggers as any} />;
      case 'claims':
        return <ClaimsTimeline claims={riderClaims as any} />;
    }
  };

  const renderInsurerContent = (tab: TabType) => {
    if (!insurerData) {
      return (
        <Card variant="glass" className="p-4">
          <p className="text-gray-300 text-sm">No insurer data available yet.</p>
        </Card>
      );
    }

    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card variant="glass" className="p-4 text-center border-blue-500/20">
                <p className="text-gray-400 text-sm">{t.totalPolicies}</p>
                <p className="text-2xl font-bold text-white">{insurerData.metrics.totalPolicies.toLocaleString()}</p>
                <p className="text-green-400 text-xs mt-1">{insurerData.metrics.activePolicies} active</p>
                <p className="text-[11px] text-gray-500 mt-2">Source: Mongo rider portfolio stream</p>
              </Card>
              <Card variant="glass" className="p-4 text-center border-indigo-500/20">
                <p className="text-gray-400 text-sm">{t.totalEarned}</p>
                <p className="text-2xl font-bold text-white">₹{insurerData.metrics.reserveAmount.toLocaleString()}</p>
                <p className="text-blue-400 text-xs mt-1">Reserve pool</p>
                <p className="text-[11px] text-gray-500 mt-2">Action: review capital buffer if trend turns red</p>
              </Card>
            </div>
            <LossRatioGauge
              value={insurerData.metrics.lossRatio}
              provenance="Computed from payouts vs premium inflow"
            />
            <ReserveForecastPanel
              current={insurerData.metrics.reserveAmount}
              projected={insurerData.metrics.projectedReserve}
              provenance="Source: insurer dashboard forecast model"
              actionHint="Use this to adjust reserve runway before peak risk windows"
            />
          </div>
        );
      case 'triggers':
        return (
          <div className="space-y-4">
            <Card variant="glass" className="p-4">
              <h3 className="text-white font-semibold mb-4 text-sm">Riders Onboarded (Live from MongoDB)</h3>
              <div className="space-y-3">
                {insurerData.riders.slice(0, 12).map((rider) => (
                  <div key={rider.id} className="rounded-xl border border-gray-700 bg-black/20 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-medium">{rider.name}</p>
                      <p className="text-xs text-blue-300">Risk {rider.riskScore}%</p>
                    </div>
                    <p className="text-xs text-gray-400">{rider.mobile} | {rider.plan.toUpperCase()} | ₹{rider.weeklyPremium}/week</p>
                    <p className="text-xs text-gray-500 mt-1">{rider.darkStore || rider.zone || 'Hub pending'}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="glass" className="p-4">
              <h3 className="text-white font-semibold mb-4 text-sm">Premium Mix by Plan</h3>
              <div className="space-y-3">
                {insurerData.metrics.claimsByType.map((item) => (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{item.type}</span>
                      <span className="text-white font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.max(6, (item.count / Math.max(1, insurerData.metrics.totalPolicies)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      case 'claims':
        return (
          <FraudFeed
            alerts={insurerData.fraudAlerts as any}
            provenance="Source: anomaly score from rider telemetry + trigger overlap"
            actionHint="Escalate high-risk cases for manual audit within 15 minutes"
          />
        );
    }
  };

  return (
    <div className="min-h-screen sr-screen-dashboard">
      <header className="sticky top-0 z-40 bg-[#040c20]/78 backdrop-blur-xl border-b border-slate-700/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sr-brand-mark rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">ShieldRide</h1>
              <p className="text-xs text-gray-400">{isInsurer ? 'Insurer Intelligence' : user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboard}
              className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-sm font-medium text-blue-400 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label={showMenu ? 'Close quick menu' : 'Open quick menu'}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showMenu ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-16 w-48 bg-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate('/language');
                }}
                className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/5 flex items-center gap-3"
              >
                <Settings className="w-4 h-4" />
                {t.settings}
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/5 flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="px-4 py-6 pb-24 max-w-md mx-auto">
        {error && (
          <Card variant="glass" className="p-3 mb-4 border border-red-500/30">
            <p className="text-red-300 text-sm">{error}</p>
          </Card>
        )}

        <Tabs
          tabs={tabs}
          defaultTab={activeTab}
          onChange={(tab) => setActiveTab(tab as TabType)}
          renderContent={(tab) => (
            <motion.div
              key={`${tab}-${user?.role}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="fade-in"
            >
              {isInsurer ? renderInsurerContent(tab as TabType) : renderRiderContent(tab as TabType)}
            </motion.div>
          )}
        />
      </main>

      {!isInsurer && <VoiceAssistant language={language} />}
    </div>
  );
}
