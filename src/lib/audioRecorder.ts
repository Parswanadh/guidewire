/**
 * Audio Recorder using MediaRecorder API
 * Handles capturing audio from the user's microphone
 */

export type RecordingState = "idle" | "recording" | "paused" | "stopped";

export interface AudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onDataAvailable?: (blob: Blob) => void;
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

export interface AudioRecorderResult {
  blob: Blob;
  url: string;
  duration: number;
  mimeType: string;
}

/**
 * Check if the browser supports MediaRecorder
 */
export function isMediaRecorderSupported(): boolean {
  return typeof MediaRecorder !== "undefined";
}

/**
 * Get the best supported MIME type for audio recording
 */
export function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
    "audio/mp3",
    "audio/wav",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "";
}

/**
 * Check if a specific MIME type is supported
 */
export function isMimeTypeSupported(mimeType: string): boolean {
  return MediaRecorder.isTypeSupported(mimeType);
}

/**
 * AudioRecorder class for handling audio recording
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private state: RecordingState = "idle";
  private options: AudioRecorderOptions;

  constructor(options: AudioRecorderOptions = {}) {
    this.options = options;
  }

  /**
   * Get the current recording state
   */
  getState(): RecordingState {
    return this.state;
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.state === "recording";
  }

  /**
   * Check if the recorder is ready (has been initialized)
   */
  isReady(): boolean {
    return this.mediaRecorder !== null;
  }

  /**
   * Get the current duration in milliseconds
   */
  getDuration(): number {
    if (this.state === "recording") {
      return Date.now() - this.startTime;
    }
    if (this.state === "stopped") {
      return this.endTime - this.startTime;
    }
    return 0;
  }

  /**
   * Initialize the recorder with microphone access
   */
  async initialize(constraints: MediaStreamConstraints = {}): Promise<void> {
    try {
      // Default audio constraints for good quality voice recording
      const defaultAudioSettings: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
      };

      const audioSettings =
        typeof constraints.audio === "object"
          ? { ...defaultAudioSettings, ...constraints.audio }
          : defaultAudioSettings;

      const audioConstraints: MediaStreamConstraints = {
        audio: audioSettings,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(audioConstraints);

      // Determine the best MIME type to use
      let mimeType = this.options.mimeType || getSupportedMimeType();
      
      if (!mimeType || !isMimeTypeSupported(mimeType)) {
        mimeType = getSupportedMimeType();
      }

      if (!mimeType) {
        throw new Error("No supported MIME type found for MediaRecorder");
      }

      const mediaRecorderOptions: MediaRecorderOptions = {
        mimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond || 128000,
      };

      this.mediaRecorder = new MediaRecorder(this.stream, mediaRecorderOptions);

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          this.options.onDataAvailable?.(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: mimeType });
        this.options.onStop?.(blob);
      };

      this.state = "idle";
    } catch (error) {
      this.state = "idle";
      throw new Error(
        `Failed to initialize audio recorder: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Start recording
   */
  start(): void {
    if (!this.mediaRecorder) {
      throw new Error("Audio recorder not initialized. Call initialize() first.");
    }

    if (this.state === "recording") {
      return; // Already recording
    }

    this.chunks = [];
    this.startTime = Date.now();
    this.mediaRecorder.start(100); // Collect data every 100ms
    this.state = "recording";
    this.options.onStart?.();
  }

  /**
   * Stop recording and return the result
   */
  async stop(): Promise<AudioRecorderResult> {
    if (!this.mediaRecorder) {
      throw new Error("Audio recorder not initialized.");
    }

    if (this.state !== "recording") {
      throw new Error("Not currently recording.");
    }

    return new Promise((resolve, reject) => {
      const originalOnStop = this.options.onStop;
      
      this.options.onStop = (blob: Blob) => {
        this.endTime = Date.now();
        this.state = "stopped";
        
        const url = URL.createObjectURL(blob);
        const result: AudioRecorderResult = {
          blob,
          url,
          duration: this.endTime - this.startTime,
          mimeType: blob.type,
        };

        // Restore original callback
        this.options.onStop = originalOnStop;
        resolve(result);
      };

      try {
        this.mediaRecorder!.stop();
      } catch (error) {
        this.state = "idle";
        this.options.onStop = originalOnStop;
        reject(error);
      }
    });
  }

  /**
   * Pause recording (if supported)
   */
  pause(): void {
    if (!this.mediaRecorder || this.state !== "recording") {
      return;
    }

    if (this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
      this.state = "paused";
    }
  }

  /**
   * Resume recording (if paused)
   */
  resume(): void {
    if (!this.mediaRecorder || this.state !== "paused") {
      return;
    }

    if (this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
      this.state = "recording";
    }
  }

  /**
   * Cancel the current recording and reset
   */
  cancel(): void {
    if (this.mediaRecorder && this.state === "recording") {
      try {
        this.mediaRecorder.stop();
      } catch {
        // Ignore errors when stopping
      }
    }

    this.chunks = [];
    this.state = "idle";
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    this.cancel();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
    this.state = "idle";
  }
}

/**
 * Create a new audio recorder instance
 */
export async function createAudioRecorder(
  options?: AudioRecorderOptions
): Promise<AudioRecorder> {
  const recorder = new AudioRecorder(options);
  await recorder.initialize();
  return recorder;
}

/**
 * Request microphone permission from the user
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately - we just wanted to check permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if microphone permission has been granted
 */
export async function hasMicrophonePermission(): Promise<boolean> {
  try {
    const permissions = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return permissions.state === "granted";
  } catch {
    // If permissions API is not supported, try to access microphone
    return requestMicrophonePermission();
  }
}
