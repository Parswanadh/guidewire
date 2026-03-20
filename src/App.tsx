import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "./components/Layout";
import { VoiceControls } from "./components/VoiceControls";
import { TranscriptView } from "./components/TranscriptView";
import { LanguageSelector } from "./components/LanguageSelector";
import {
  getSavedLanguage,
  saveLanguage,
  getTranslations,
  type LanguageCode,
} from "./lib/i18n";
import { createAudioRecorder, type AudioRecorder } from "./lib/audioRecorder";
import { mockTranscribeAudio, mockSynthesizeSpeech } from "./lib/sarvamClient";
import { checkAudioSupport } from "./lib/utils";

// App state for showing language selector on first load
function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en-IN");
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved language on mount
  useEffect(() => {
    // Check for test mode query param to skip localStorage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') {
      setShowLanguageSelection(true);
      return;
    }
    
    const savedLang = getSavedLanguage();
    setCurrentLanguage(savedLang);
    setShowLanguageSelection(false);
  }, []);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Initialize audio recorder on mount
  useEffect(() => {
    let recorder: AudioRecorder | null = null;

    async function initRecorder() {
      try {
        const audioSupport = checkAudioSupport();
        if (!audioSupport.supported) {
          setError("Your browser doesn't support audio recording. Please use a modern browser.");
          return;
        }

        recorder = await createAudioRecorder({
          onStop: (blob) => {
            handleTranscription(blob);
          },
          onError: (err) => {
            setError(err.message);
            setIsProcessing(false);
          },
        });
        recorderRef.current = recorder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize audio recorder"
        );
      }
    }

    initRecorder();

    return () => {
      recorder?.dispose();
    };
  }, []);

  // Handle language selection
  const handleLanguageSelect = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    saveLanguage(language);
    setShowLanguageSelection(false);
  }, []);

  // Handle language change from header
  const handleLanguageChange = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    saveLanguage(language);
  }, []);

  // Start recording
  const handleStartRecording = useCallback(async () => {
    if (!recorderRef.current) {
      setError("Audio recorder not initialized");
      return;
    }

    setError(null);
    try {
      await recorderRef.current.start();
      setIsRecording(true);
      setTranscript("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording");
    }
  }, []);

  // Stop recording
  const handleStopRecording = useCallback(async () => {
    if (!recorderRef.current) {
      return;
    }

    try {
      setIsRecording(false);
      setIsProcessing(true);
      await recorderRef.current.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop recording");
      setIsProcessing(false);
    }
  }, []);

  // Handle transcription
  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      // Use mock transcription for demo
      // In production, replace with: transcribeAudioWithSarvam(audioBlob, currentLanguage);
      // Note: audioBlob is intentionally unused in mock mode
      void audioBlob;
      const result = await mockTranscribeAudio(currentLanguage);
      setTranscript(result.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to transcribe audio");
    } finally {
      setIsProcessing(false);
    }
  }, [currentLanguage]);

  // Play as speech
  const handlePlaySpeech = useCallback(async () => {
    if (!transcript) return;

    try {
      setIsPlaying(true);
      
      // Use mock synthesis for demo (uses browser's speech synthesis)
      // In production, replace with: synthesizeSpeechWithSarvam(transcript, currentLanguage);
      await mockSynthesizeSpeech(transcript, currentLanguage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to play speech");
    } finally {
      setIsPlaying(false);
    }
  }, [transcript, currentLanguage]);

  // Stop speech
  const handleStopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  // Clear transcript
  const handleClearTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  const strings = getTranslations(currentLanguage);

  // Show language selection on first load
  if (showLanguageSelection) {
    return (
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageSelect={handleLanguageSelect}
        variant="full"
      />
    );
  }

  // Main app
  return (
    <Layout
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="mx-auto max-w-2xl space-y-8 pb-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {strings.appTitle}
          </h1>
          <p className="text-muted-foreground md:text-lg">
            {strings.appSubtitle}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Voice Controls */}
        <VoiceControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          hasTranscript={Boolean(transcript)}
          isPlaying={isPlaying}
          strings={strings}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onPlaySpeech={handlePlaySpeech}
          onStopSpeech={handleStopSpeech}
          disabled={Boolean(error)}
        />

        {/* Transcript View */}
        <TranscriptView
          transcript={transcript}
          isProcessing={isProcessing}
          strings={strings}
          onClear={handleClearTranscript}
        />

        {/* Info Card */}
        <div className="rounded-lg border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          <p>
            Speak clearly in your selected language. The assistant will transcribe
            your speech and can read it back to you.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
