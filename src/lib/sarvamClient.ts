/**
 * Sarvam AI Client for STT (Speech-to-Text) and TTS (Text-to-Speech)
 * 
 * This client provides integration with Sarvam's Saaras API for STT
 * and Bulbul API for TTS.
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - VITE_SARVAM_API_KEY: Your Sarvam AI API key
 * - VITE_SARVAM_STT_URL: Saaras STT API endpoint (default: https://api.saaras.ai/v1/stt)
 * - VITE_SARVAM_TTS_URL: Bulbul TTS API endpoint (default: https://api.bulbul.ai/v1/tts)
 */

// API Configuration
const SARVAM_STT_URL = import.meta.env.VITE_SARVAM_STT_URL || "https://api.saaras.ai/v1/stt";
const SARVAM_TTS_URL = import.meta.env.VITE_SARVAM_TTS_URL || "https://api.bulbul.ai/v1/tts";
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || "";

// Language code mapping for Sarvam APIs
const LANGUAGE_CODE_MAP: Record<string, string> = {
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "kn-IN": "kn-IN",
};

/**
 * Error class for Sarvam API errors
 */
export class SarvamError extends Error {
  statusCode?: number;
  endpoint?: string;

  constructor(
    message: string,
    statusCode?: number,
    endpoint?: string
  ) {
    super(message);
    this.name = "SarvamError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

/**
 * STT (Speech-to-Text) Response from Saaras API
 */
export interface STTResponse {
  transcript: string;
  confidence: number;
  language: string;
  duration: number;
  words?: Array<{
    word: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

/**
 * TTS (Text-to-Speech) Request Options for Bulbul API
 */
export interface TTSOptions {
  text: string;
  languageCode: string;
  speaker?: string; // Speaker ID for the voice
  speed?: number; // Speech speed (0.5 to 2.0)
  pitch?: number; // Pitch adjustment (-10 to 10)
  encoding?: "mp3" | "wav" | "pcm";
}

/**
 * TTS Response from Bulbul API
 */
export interface TTSResponse {
  audioData: ArrayBuffer;
  format: string;
  duration?: number;
}

/**
 * Check if the Sarvam API key is configured
 */
export function isSarvamConfigured(): boolean {
  return Boolean(SARVAM_API_KEY && SARVAM_API_KEY.length > 0);
}

/**
 * Get the Sarvam language code for the given language
 */
function getSarvamLanguageCode(languageCode: string): string {
  return LANGUAGE_CODE_MAP[languageCode] || languageCode;
}

/**
 * Transcribe audio using Sarvam's Saaras STT API v3
 * 
 * @param audioBlob - The audio blob to transcribe
 * @param languageCode - The language code (e.g., "en-IN", "hi-IN", "kn-IN")
 * @returns Promise<STTResponse> - The transcription result
 */
export async function transcribeAudioWithSarvam(
  audioBlob: Blob,
  languageCode: string
): Promise<STTResponse> {
  if (!isSarvamConfigured()) {
    throw new SarvamError(
      "Sarvam API key is not configured. Please set VITE_SARVAM_API_KEY environment variable."
    );
  }

  const sarvamLanguage = getSarvamLanguageCode(languageCode);

  try {
    // Convert audio blob to the format required by Sarvam
    // Sarvam typically accepts WAV, MP3, or other audio formats
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("language_code", sarvamLanguage);
    formData.append("model", "saaras_v3"); // Using Saaras v3 model

    const response = await fetch(SARVAM_STT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SARVAM_API_KEY}`,
        // Don't set Content-Type header when using FormData, browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new SarvamError(
        `Sarvam STT API error: ${errorText}`,
        response.status,
        SARVAM_STT_URL
      );
    }

    const data = await response.json();

    // Parse the response based on Sarvam's actual API response structure
    // TODO: Adjust this based on actual Sarvam API response format
    return {
      transcript: data.transcript || data.text || "",
      confidence: data.confidence || 0.95,
      language: sarvamLanguage,
      duration: data.duration || 0,
      words: data.words || [],
    };
  } catch (error) {
    if (error instanceof SarvamError) {
      throw error;
    }
    throw new SarvamError(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Synthesize speech using Sarvam's Bulbul TTS API v3
 * 
 * @param text - The text to synthesize
 * @param languageCode - The language code (e.g., "en-IN", "hi-IN", "kn-IN")
 * @param options - Optional TTS configuration
 * @returns Promise<TTSResponse> - The synthesized audio data
 */
export async function synthesizeSpeechWithSarvam(
  text: string,
  languageCode: string,
  options?: Partial<TTSOptions>
): Promise<TTSResponse> {
  if (!isSarvamConfigured()) {
    throw new SarvamError(
      "Sarvam API key is not configured. Please set VITE_SARVAM_API_KEY environment variable."
    );
  }

  const sarvamLanguage = getSarvamLanguageCode(languageCode);

  try {
    const requestBody = {
      text,
      language_code: sarvamLanguage,
      model: "bulbul_v3", // Using Bulbul v3 model
      speaker: options?.speaker || "default", // TODO: Update with actual speaker IDs
      speed: options?.speed || 1.0,
      pitch: options?.pitch || 0,
      encoding: options?.encoding || "mp3",
    };

    const response = await fetch(SARVAM_TTS_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SARVAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new SarvamError(
        `Sarvam TTS API error: ${errorText}`,
        response.status,
        SARVAM_TTS_URL
      );
    }

    // Get the audio data as ArrayBuffer
    const audioData = await response.arrayBuffer();

    return {
      audioData,
      format: options?.encoding || "mp3",
      duration: undefined, // API may return duration in headers or response
    };
  } catch (error) {
    if (error instanceof SarvamError) {
      throw error;
    }
    throw new SarvamError(
      `Failed to synthesize speech: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Mock version of transcribeAudioWithSarvam for testing/demo purposes
 * This simulates the API response without making actual API calls
 */
export async function mockTranscribeAudio(
  languageCode: string,
  durationMs: number = 2000
): Promise<STTResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockTranscripts: Record<string, string[]> = {
    "en-IN": [
      "Hello, how are you today?",
      "This is a test of the voice assistant.",
      "The weather is beautiful today.",
      "Thank you for listening.",
    ],
    "hi-IN": [
      "नमस्ते, आज आप कैसे हैं?",
      "यह वॉइस असिस्टेंट का परीक्षण है।",
      "आज मौसम बहुत अच्छा है।",
      "सुनने के लिए धन्यवाद।",
    ],
    "kn-IN": [
      "ನಮಸ್ಕಾರ, ಇವತ್ತು ನೀವು ಹೇಗಿದ್ದೀರಿ?",
      "ಇದು ಧ್ವನಿ ಸಹಾಯಕದ ಪರೀಕ್ಷೆಯಾಗಿದೆ.",
      "ಇವತ್ತಿನ ಹವಾಮಾನ ಬಹಳ ಸುಂದರವಾಗಿದೆ.",
      "ಕೇಳಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.",
    ],
  };

  const transcripts = mockTranscripts[languageCode] || mockTranscripts["en-IN"];
  const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];

  return {
    transcript: randomTranscript,
    confidence: 0.92 + Math.random() * 0.07, // Random confidence between 0.92 and 0.99
    language: languageCode,
    duration: durationMs / 1000,
  };
}

/**
 * Mock version of synthesizeSpeechWithSarvam for testing/demo purposes
 * Uses the browser's built-in SpeechSynthesis API
 */
export async function mockSynthesizeSpeech(
  text: string,
  languageCode: string
): Promise<TTSResponse> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new SarvamError("Speech synthesis is not supported in this browser"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      // Return empty audio buffer since we used the browser's TTS
      resolve({
        audioData: new ArrayBuffer(0),
        format: "speech-synthesis",
        duration: undefined,
      });
    };

    utterance.onerror = (event) => {
      reject(new SarvamError(`Speech synthesis error: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
}
