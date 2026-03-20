/**
 * Internationalization (i18n) Configuration
 * Supports Kannada, Hindi, and English
 */

export type LanguageCode = "en-IN" | "hi-IN" | "kn-IN";

export interface LanguageConfig {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
  flag: string;
}

export interface I18nStrings {
  // App title and description
  appTitle: string;
  appSubtitle: string;
  
  // Language selection
  selectLanguage: string;
  languageSelected: string;
  
  // Voice controls
  startRecording: string;
  stopRecording: string;
  listen: string;
  recording: string;
  processing: string;
  
  // Transcript
  transcriptPlaceholder: string;
  yourTranscript: string;
  noTranscript: string;
  
  // Status messages
  readyToListen: string;
  listeningNow: string;
  processingAudio: string;
  errorOccurred: string;
  
  // Buttons
  playAsSpeech: string;
  stopSpeech: string;
  clearTranscript: string;
  
  // Header
  changeLanguage: string;
  settings: string;
  
  // Accessibility
  microphoneAriaLabel: string;
  listenAriaLabel: string;
  languageSelectorAriaLabel: string;
}

export const LANGUAGE_CONFIGS: Record<LanguageCode, LanguageConfig> = {
  "en-IN": {
    code: "en-IN",
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    flag: "🇬🇧",
  },
  "hi-IN": {
    code: "hi-IN",
    label: "Hindi",
    nativeLabel: "हिंदी",
    dir: "ltr",
    flag: "🇮🇳",
  },
  "kn-IN": {
    code: "kn-IN",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    dir: "ltr",
    flag: "🇮🇳",
  },
};

export const TRANSLATIONS: Record<LanguageCode, I18nStrings> = {
  "en-IN": {
    appTitle: "Voice Assistant",
    appSubtitle: "Speak naturally, I'll understand you",
    selectLanguage: "Select Your Language",
    languageSelected: "Language",
    startRecording: "Tap to Speak",
    stopRecording: "Stop Recording",
    listen: "Listen",
    recording: "Recording...",
    processing: "Processing...",
    transcriptPlaceholder: "Your speech will appear here...",
    yourTranscript: "Your Transcript",
    noTranscript: "No transcript yet. Start speaking!",
    readyToListen: "Ready to listen",
    listeningNow: "Listening...",
    processingAudio: "Processing your audio...",
    errorOccurred: "An error occurred. Please try again.",
    playAsSpeech: "Play as Speech",
    stopSpeech: "Stop",
    clearTranscript: "Clear",
    changeLanguage: "Change Language",
    settings: "Settings",
    microphoneAriaLabel: "Start or stop voice recording",
    listenAriaLabel: "Listen to the transcript as speech",
    languageSelectorAriaLabel: "Select your preferred language",
  },
  "hi-IN": {
    appTitle: "वॉइस असिस्टेंट",
    appSubtitle: "बोलिए, मैं समझूंगा",
    selectLanguage: "अपनी भाषा चुनें",
    languageSelected: "भाषा",
    startRecording: "बोलने के लिए टैप करें",
    stopRecording: "रिकॉर्डिंग रोकें",
    listen: "सुनें",
    recording: "रिकॉर्डिंग हो रही है...",
    processing: "प्रोसेसिंग...",
    transcriptPlaceholder: "आपकी बात यहाँ दिखाई देगी...",
    yourTranscript: "आपकी ट्रांसक्रिप्ट",
    noTranscript: "अभी तक कोई ट्रांसक्रिप्ट नहीं। बोलना शुरू करें!",
    readyToListen: "सुनने के लिए तैयार",
    listeningNow: "सुन रहा हूँ...",
    processingAudio: "आपकी ऑडियो प्रोसेस हो रही है...",
    errorOccurred: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    playAsSpeech: "बोलकर सुनें",
    stopSpeech: "रोकें",
    clearTranscript: "साफ़ करें",
    changeLanguage: "भाषा बदलें",
    settings: "सेटिंग्स",
    microphoneAriaLabel: "वॉइस रिकॉर्डिंग शुरू या रोकें",
    listenAriaLabel: "ट्रांसक्रिप्ट को बोलकर सुनें",
    languageSelectorAriaLabel: "अपनी पसंदीदा भाषा चुनें",
  },
  "kn-IN": {
    appTitle: "ಧ್ವನಿ ಸಹಾಯಕ",
    appSubtitle: "ಮಾತನಾಡಿ, ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
    selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    languageSelected: "ಭಾಷೆ",
    startRecording: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    stopRecording: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    listen: "ಕೇಳಿ",
    recording: "ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...",
    processing: "ಪ್ರಕ್ರಿಯೆ...",
    transcriptPlaceholder: "ನಿಮ್ಮ ಮಾತು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ...",
    yourTranscript: "ನಿಮ್ಮ ಟ್ರಾನ್ಸ್ಕ್ರಿಪ್ಟ್",
    noTranscript: "ಇನ್ನೂ ಟ್ರಾನ್ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ. ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ!",
    readyToListen: "ಕೇಳಲು ಸಿದ್ಧ",
    listeningNow: "ಕೇಳುತ್ತಿದೆ...",
    processingAudio: "ನಿಮ್ಮ ಆಡಿಯೋ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    errorOccurred: "ಒಂದು ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    playAsSpeech: "ಮಾತಾಡಿ ಕೇಳಿಸಿ",
    stopSpeech: "ನಿಲ್ಲಿಸಿ",
    clearTranscript: "ತೆರವುಗೊಳಿಸಿ",
    changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    microphoneAriaLabel: "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ ಅಥವಾ ನಿಲ್ಲಿಸಿ",
    listenAriaLabel: "ಟ್ರಾನ್ಸ್ಕ್ರಿಪ್ಟ್ ಅನ್ನು ಮಾತಾಡಿ ಕೇಳಿಸಿ",
    languageSelectorAriaLabel: "ನಿಮ್ಮ ಪ್ರಿಯಭಾಷೆಯನ್ನು ಆರಿಸಿ",
  },
};

const STORAGE_KEY = "guidewire-language";

/**
 * Get the saved language from localStorage
 */
export function getSavedLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en-IN";
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in LANGUAGE_CONFIGS) {
      return saved as LanguageCode;
    }
  } catch {
    // localStorage might not be available
  }
  return "en-IN";
}

/**
 * Save the selected language to localStorage
 */
export function saveLanguage(language: LanguageCode): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // localStorage might not be available
  }
}

/**
 * Get translations for a specific language
 */
export function getTranslations(language: LanguageCode): I18nStrings {
  return TRANSLATIONS[language];
}

/**
 * Get a single translation string by key
 */
export function t(language: LanguageCode, key: keyof I18nStrings): string {
  return TRANSLATIONS[language][key];
}

/**
 * React hook for using i18n translations
 */
export function useI18n(language: LanguageCode) {
  const strings = TRANSLATIONS[language];
  const config = LANGUAGE_CONFIGS[language];
  
  return {
    strings,
    config,
    t: (key: keyof I18nStrings) => strings[key],
    setLanguage: (newLanguage: LanguageCode) => {
      saveLanguage(newLanguage);
      // In a real app, this would trigger a re-render
      window.location.reload();
    },
  };
}
