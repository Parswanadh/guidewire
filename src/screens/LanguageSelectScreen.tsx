import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_CONFIGS } from '../lib/i18n';

export default function LanguageSelectScreen() {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (langCode: keyof typeof LANGUAGE_CONFIGS) => {
    setLanguage(langCode);
    setTimeout(() => navigate('/signup'), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#1a1f3e] to-[#0A0F1E] flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-600/30">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ShieldRide 🛡️</h1>
        <p className="text-gray-400">Income Protection for Delivery Partners</p>
      </motion.header>

      <div className="flex-1 px-6 pb-8">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Select your language / भाषा चुनें / ಭಾಷೆಯನ್ನು ಆರಿಸಿ
        </h2>

        <div className="space-y-4 max-w-md mx-auto">
          {Object.values(LANGUAGE_CONFIGS).map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="gradient"
                onClick={() => handleLanguageSelect(lang.code as keyof typeof LANGUAGE_CONFIGS)}
                className="p-5 border-2 border-transparent hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{lang.nativeName}</h3>
                    <p className="text-gray-400 text-sm">{lang.name}</p>
                  </div>
                  <div className="text-purple-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>© 2026 ShieldRide. All rights reserved.</p>
      </footer>
    </div>
  );
}
