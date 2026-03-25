import { motion } from 'framer-motion';
import { Shield, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_CONFIGS, type LanguageCode } from '../lib/i18n';

export default function LanguageSelectScreen() {
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.selectLanguage}</h1>
          <p className="text-gray-400">{t.selectLanguageDesc}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(Object.values(LANGUAGE_CONFIGS)).map((config) => (
            <Card
              key={config.code}
              variant="glass"
              onClick={() => handleLanguageSelect(config.code)}
              className={`
                p-5 border-2 transition-all cursor-pointer flex items-center justify-between
                ${language === config.code 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-transparent hover:border-blue-500/50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{config.flag}</span>
                <div className="text-left">
                  <p className="text-white font-bold">{config.nativeName}</p>
                  <p className="text-gray-400 text-sm">{config.name}</p>
                </div>
              </div>
              {language === config.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-blue-400"
                >
                  <Check className="w-6 h-6" />
                </motion.div>
              )}
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
