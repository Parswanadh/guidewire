import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, FileText, Users, Settings, LogOut, Menu, X, Activity } from 'lucide-react';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldStatusCard } from '../components/dashboard/ShieldStatusCard';
import { TriggerMonitor } from '../components/dashboard/TriggerMonitor';
import { ClaimsTimeline } from '../components/dashboard/ClaimsTimeline';
import { VoiceAssistant } from '../components/dashboard/VoiceAssistant';
import { LossRatioGauge } from '../components/dashboard/LossRatioGauge';
import { ReserveForecastPanel } from '../components/dashboard/ReserveForecastPanel';
import { FraudFeed } from '../components/dashboard/FraudFeed';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { MOCK_TRIGGERS, MOCK_CLAIMS, INSURER_METRICS, FRAUD_ALERTS } from '../lib/mockData';

type ViewMode = 'worker' | 'insurer';
type TabType = 'overview' | 'triggers' | 'claims';

export default function HomeScreen() {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [viewMode, setViewMode] = useState<ViewMode>('worker');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const workerTabs = [
    { id: 'overview' as const, label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'triggers' as const, label: 'Live Risk', icon: <Activity className="w-4 h-4" /> },
    { id: 'claims' as const, label: 'History', icon: <FileText className="w-4 h-4" /> },
  ];

  const insurerTabs = [
    { id: 'overview' as const, label: 'Ops Map', icon: <Home className="w-4 h-4" /> },
    { id: 'triggers' as const, label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
    { id: 'claims' as const, label: 'Fraud', icon: <Users className="w-4 h-4" /> },
  ];

  const renderWorkerContent = (tab: TabType) => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <ShieldStatusCard
              isActive={user?.shieldStatus.active || false}
              activeSince={user?.activeSince || ''}
              expiresOn={user?.expiresOn || ''}
              remainingDays={user?.shieldStatus.remainingDays || 0}
              todayEarnings={user?.todayEarnings || 0}
              coverageAmount={user?.coverageAmount || 0}
            />
            <Card variant="glass" className="p-4">
              <h3 className="text-white font-semibold mb-3">Today's Context</h3>
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white font-medium">Zone Risk: Moderate</p>
                  <p className="text-xs text-gray-400">60% chance of rainfall in Koramangala this afternoon.</p>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'triggers':
        return <TriggerMonitor triggers={MOCK_TRIGGERS} />;
      case 'claims':
        return <ClaimsTimeline claims={MOCK_CLAIMS} />;
    }
  };

  const renderInsurerContent = (tab: TabType) => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card variant="glass" className="p-4 text-center border-purple-500/20">
                <p className="text-gray-400 text-sm">{t.totalPolicies}</p>
                <p className="text-2xl font-bold text-white">{INSURER_METRICS.totalPolicies.toLocaleString()}</p>
                <p className="text-green-400 text-xs mt-1">+{INSURER_METRICS.activePolicies - 2600} this week</p>
              </Card>
              <Card variant="glass" className="p-4 text-center border-blue-500/20">
                <p className="text-gray-400 text-sm">{t.totalEarned}</p>
                <p className="text-2xl font-bold text-white">₹{(INSURER_METRICS.totalClaims * 180).toLocaleString()}</p>
                <p className="text-blue-400 text-xs mt-1">{INSURER_METRICS.totalClaims} events</p>
              </Card>
            </div>
            <LossRatioGauge value={INSURER_METRICS.lossRatio} />
            <ReserveForecastPanel
              current={INSURER_METRICS.reserveAmount}
              projected={INSURER_METRICS.projectedReserve}
            />
          </div>
        );
      case 'triggers':
        return (
          <div className="space-y-4">
             <Card variant="glass" className="p-4">
                <h3 className="text-white font-semibold mb-4">Forward Reserve Intelligence</h3>
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 mb-3">
                  <p className="text-sm text-purple-400 font-bold mb-1">Koramangala 4th Block (Zone 4)</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Rainfall Probability</span>
                    <span className="text-white">73%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rec. Reserve</span>
                    <span className="text-white">₹18,400</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-sm text-blue-400 font-bold mb-1">Bellandur (Zone 7)</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Rainfall Probability</span>
                    <span className="text-white">81%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rec. Reserve</span>
                    <span className="text-white">₹28,000</span>
                  </div>
                </div>
             </Card>
             <LossRatioGauge value={INSURER_METRICS.lossRatio} />
          </div>
        );
      case 'claims':
        return <FraudFeed alerts={FRAUD_ALERTS} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#1a1f3e] to-[#0A0F1E]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0F1E]/80 backdrop-blur-lg border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">ShieldRide</h1>
              <p className="text-xs text-gray-400">
                {viewMode === 'worker' ? user?.name : 'Insurer Intelligence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode(viewMode === 'worker' ? 'insurer' : 'worker');
                setActiveTab('overview');
              }}
              className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-sm font-medium text-purple-400 transition-colors"
            >
              {viewMode === 'worker' ? t.switchToInsurer : t.switchToWorker}
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showMenu ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-16 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
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

      {/* Main Content */}
      <main className="px-4 py-6 pb-24 max-w-md mx-auto">
        <Tabs
          tabs={viewMode === 'worker' ? workerTabs : insurerTabs}
          defaultTab={activeTab}
          onChange={(tab) => setActiveTab(tab as TabType)}
          renderContent={(tab) => (
            <motion.div
              key={tab + viewMode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="fade-in"
            >
              {viewMode === 'worker' ? renderWorkerContent(tab as TabType) : renderInsurerContent(tab as TabType)}
            </motion.div>
          )}
        />
      </main>

      {/* Voice Assistant (Worker view only) */}
      {viewMode === 'worker' && <VoiceAssistant language={language} />}
    </div>
  );
}
