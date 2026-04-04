// ShieldRide Sarvam AI Client - Speech-to-Text and Text-to-Speech
import { FAQ_RESPONSES } from './mockData';

export interface SarvamConfig {
  apiKey: string;
  language: string;
}

let sarvamConfig: SarvamConfig | null = null;

// Initialize Sarvam AI with API key
export function initSarvam(config: SarvamConfig): void {
  sarvamConfig = config;
}

// Check if Sarvam is configured
export function isSarvamConfigured(): boolean {
  return sarvamConfig !== null;
}

// Speech-to-Text (Saaras v3)
// Transcribes audio blob to text using Sarvam AI's Saaras v3 model
export async function transcribeAudio(_audioBlob: Blob, language: string): Promise<string> {
  const apiKey = import.meta.env.VITE_SARVAM_API_KEY;
  const sttUrl = import.meta.env.VITE_SARVAM_STT_URL;

  if (!apiKey || !sttUrl) {
    throw new Error('Sarvam STT is not configured. Set VITE_SARVAM_API_KEY and VITE_SARVAM_STT_URL.');
  }

  const formData = new FormData();
  formData.append('file', _audioBlob, 'speech.wav');
  formData.append('language_code', language);

  const response = await fetch(sttUrl, {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Sarvam STT request failed with status ${response.status}`);
  }

  const data = await response.json();
  const transcript =
    data?.transcript ||
    data?.text ||
    data?.output?.transcript ||
    data?.result?.transcript ||
    '';

  if (!transcript) {
    throw new Error('Sarvam STT response did not include transcript text');
  }

  return transcript;
}

// Text-to-Speech (Bulbul v3)
// Synthesizes speech from text using Sarvam AI's Bulbul v3 model
export async function synthesizeSpeech(text: string, language: string): Promise<void> {
  const apiKey = import.meta.env.VITE_SARVAM_API_KEY;
  const ttsUrl = import.meta.env.VITE_SARVAM_TTS_URL;

  if (apiKey && ttsUrl) {
    const response = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        text,
        target_language_code: language,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      if (blob.size > 0) {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        await audio.play();
        URL.revokeObjectURL(audioUrl);
        return;
      }
    }
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Set language based on input
  const langMap: Record<string, string> = {
    'en-IN': 'en-IN',
    'hi-IN': 'hi-IN',
    'kn-IN': 'kn-IN',
  };
  utterance.lang = langMap[language] || 'en-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Try to find a suitable voice
  const voices = window.speechSynthesis.getVoices();
  const suitableVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
  if (suitableVoice) {
    utterance.voice = suitableVoice;
  }

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

// Mock FAQ response generator for voice assistant
export function getFAQResponse(transcript: string, language: string): string {
  const lowerTranscript = transcript.toLowerCase();

  const responses = FAQ_RESPONSES[language as keyof typeof FAQ_RESPONSES] || FAQ_RESPONSES['en-IN'];

  // Keyword matching for FAQ
  if (lowerTranscript.includes('cover') || lowerTranscript.includes('benefit') || lowerTranscript.includes('kya cover hai') || lowerTranscript.includes('cover maduttade')) {
    return responses.coverage;
  }
  if (lowerTranscript.includes('claim') || lowerTranscript.includes('file') || lowerTranscript.includes('kaise file karu') || lowerTranscript.includes('claim madabahudu')) {
    return responses.claim;
  }
  if (lowerTranscript.includes('payment') || lowerTranscript.includes('paid') || lowerTranscript.includes('money') || lowerTranscript.includes('payment milega') || lowerTranscript.includes('payment')) {
    return responses.payment;
  }
  if (lowerTranscript.includes('accident') || lowerTranscript.includes('emergency') || lowerTranscript.includes('accident ho gaya') || lowerTranscript.includes('accident aagide')) {
    return responses.accident;
  }

  // Default response
  const defaults = {
    'en-IN': 'I can help you with information about your coverage, claims, payments, and accident procedures. What would you like to know?',
    'hi-IN': 'मैं आपको कवरेज, दावे, भुगतान और दुर्घटना प्रक्रियाओं के बारे में जानकारी दे सकता हूँ। आप क्या जानना चाहेंगे?',
    'kn-IN': 'ನಾನು ನಿಮ್ಮ ಕವರೇಜ್, ಹಕ್ಕುಗಳು, ಪಾವತಿಗಳು ಮತ್ತು ಅಪಘಾತ ವಿಧಾನಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಹುದು. ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
  };

  return defaults[language as keyof typeof defaults] || defaults['en-IN'];
}

// Audio recording helper
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async start(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('MediaRecorder not supported');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recorder'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      // Stop all tracks to release microphone
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  cancel(): void {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    this.audioChunks = [];
  }
}

export default {
  initSarvam,
  isSarvamConfigured,
  transcribeAudio,
  synthesizeSpeech,
  getFAQResponse,
  AudioRecorder,
};

