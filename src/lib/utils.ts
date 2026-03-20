import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp for display
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${remainingSeconds}s`;
}

/**
 * Check if the browser supports the required audio APIs
 */
export function checkAudioSupport(): {
  supported: boolean;
  mediaRecorder: boolean;
  webAudio: boolean;
  speechSynthesis: boolean;
} {
  return {
    supported: 
      typeof MediaRecorder !== "undefined" &&
      typeof window.AudioContext !== "undefined" &&
      typeof window.speechSynthesis !== "undefined",
    mediaRecorder: typeof MediaRecorder !== "undefined",
    webAudio: typeof window.AudioContext !== "undefined",
    speechSynthesis: typeof window.speechSynthesis !== "undefined",
  };
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Convert a language code to Sarvam API format
 */
export function toSarvamLanguageCode(languageCode: string): string {
  const mapping: Record<string, string> = {
    "en-IN": "en",
    "hi-IN": "hi",
    "kn-IN": "kn",
  };
  return mapping[languageCode] || languageCode.split("-")[0];
}
