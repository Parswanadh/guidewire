import { useRef, useState } from 'react';
import { Mic, Waves, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { useI18n } from '../../context/LanguageContext';
import { AudioRecorder, getFAQResponse, synthesizeSpeech, transcribeAudio } from '../../lib/sarvamClient';

interface VoiceAssistantProps {
  language: string;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export function VoiceAssistant({ language }: VoiceAssistantProps) {
  const { strings } = useI18n();
  const [state, setState] = useState<VoiceState>('idle');
  const [response, setResponse] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const recorderRef = useRef(new AudioRecorder());

  const handleTranscript = async (transcript: string) => {
    setState('processing');
    const faqResponse = getFAQResponse(transcript, language);
    setResponse(faqResponse);

    setState('speaking');
    try {
      await synthesizeSpeech(faqResponse, language);
    } catch {
      // Ignore speech playback errors.
    }
    setState('idle');
  };

  const startListening = async () => {
    try {
      await recorderRef.current.start();
      setState('listening');
    } catch {
      setState('idle');
    }
  };

  const stopListening = async () => {
    try {
      setState('processing');
      const blob = await recorderRef.current.stop();
      const transcript = await transcribeAudio(blob, language);
      await handleTranscript(transcript);
    } catch {
      setState('idle');
      setResponse('Voice transcription failed. Please check microphone access and API configuration.');
    }
  };

  const quickQuestions = [
    { key: 'q1Coverage' as string, icon: '🛡️' },
    { key: 'q2Claim' as string, icon: '📄' },
    { key: 'q3Payment' as string, icon: '💰' },
    { key: 'q4Accident' as string, icon: '🚨' },
  ];

  const stateConfig = {
    idle: { color: 'bg-purple-500', text: strings.tapToSpeak },
    listening: { color: 'bg-red-500 animate-pulse', text: strings.listening },
    processing: { color: 'bg-blue-500 animate-pulse', text: strings.processing },
    speaking: { color: 'bg-green-500', text: strings.speaking },
  };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card variant="gradient" className="border-purple-500/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Mic className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{strings.voiceAssistant}</h3>
                  <p className="text-xs text-gray-400">{stateConfig[state].text}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                aria-label="Minimize voice assistant"
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {response && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-black/30 rounded-xl"
              >
                <p className="text-gray-300 text-sm">{response}</p>
              </motion.div>
            )}

            <div className="flex justify-center mb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={state === 'listening' ? stopListening : startListening}
                aria-label={state === 'listening' ? 'Stop voice capture' : 'Start voice capture'}
                className={`
                  relative w-20 h-20 rounded-full ${stateConfig[state].color}
                  flex items-center justify-center shadow-xl
                  transition-all duration-300
                `}
              >
                {state === 'listening' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500/50"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {state === 'speaking' && <Waves className="w-8 h-8 text-white" />}
                {state === 'idle' && <Mic className="w-8 h-8 text-white" />}
                {state === 'processing' && (
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </motion.button>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2 text-center">{strings.commonQuestions}</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => handleTranscript((strings as any)[q.key])}
                    className="p-2 bg-black/30 hover:bg-black/50 rounded-lg text-left transition-colors"
                  >
                    <span className="text-lg">{q.icon}</span>
                    <p className="text-xs text-gray-300 mt-1">{(strings as any)[q.key]}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {isMinimized && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          aria-label="Open voice assistant"
          className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-purple-600 rounded-full shadow-lg shadow-purple-600/30 flex items-center justify-center"
        >
          <Mic className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
