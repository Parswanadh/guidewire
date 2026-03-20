import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { I18nStrings } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface VoiceControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  hasTranscript: boolean;
  isPlaying: boolean;
  strings: I18nStrings;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlaySpeech: () => void;
  onStopSpeech: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceControls({
  isRecording,
  isProcessing,
  hasTranscript,
  isPlaying,
  strings,
  onStartRecording,
  onStopRecording,
  onPlaySpeech,
  onStopSpeech,
  disabled = false,
  className,
}: VoiceControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6",
        className
      )}
    >
      {/* Status Badge */}
      {(isRecording || isProcessing || isPlaying) && (
        <Badge
          variant="secondary"
          className={cn(
            "text-sm font-medium",
            isRecording && "animate-pulse bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}
        >
          {isRecording && strings.recording}
          {isProcessing && strings.processing}
          {isPlaying && strings.listen}
        </Badge>
      )}

      {/* Main Microphone Button */}
      <div className="relative">
        {/* Pulse ring effect when recording */}
        {isRecording && (
          <div className="absolute inset-0 -m-4 rounded-full bg-primary/20 animate-ping" />
        )}
        {isRecording && (
          <div className="absolute inset-0 -m-4 rounded-full bg-primary/30 animate-pulse-ring" />
        )}

        <Button
          size="icon"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={disabled || isProcessing}
          aria-label={isRecording ? strings.stopRecording : strings.startRecording}
          className={cn(
            "h-24 w-24 rounded-full shadow-xl transition-all",
            "hover:scale-105 active:scale-95",
            isRecording && "shadow-2xl shadow-red-500/50",
            !isRecording && "shadow-lg shadow-primary/30"
          )}
        >
          {isRecording ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
      </div>

      {/* Hint text */}
      {!isRecording && !isProcessing && (
        <p className="text-center text-sm text-muted-foreground">
          {strings.readyToListen}
        </p>
      )}

      {/* Play Speech Button */}
      {hasTranscript && !isRecording && (
        <div className="flex items-center gap-3">
          <Button
            variant={isPlaying ? "destructive" : "outline"}
            size="lg"
            onClick={isPlaying ? onStopSpeech : onPlaySpeech}
            disabled={isProcessing}
            aria-label={isPlaying ? strings.stopSpeech : strings.playAsSpeech}
            className="min-w-[160px]"
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-5 w-5" />
                {strings.stopSpeech}
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5" />
                {strings.playAsSpeech}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
