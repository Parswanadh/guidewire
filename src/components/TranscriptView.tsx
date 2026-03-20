import * as React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import type { I18nStrings } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface TranscriptViewProps {
  transcript: string;
  isProcessing: boolean;
  strings: I18nStrings;
  onClear?: () => void;
  className?: string;
}

export function TranscriptView({
  transcript,
  isProcessing,
  strings,
  onClear,
  className,
}: TranscriptViewProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (transcript && !isProcessing) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [transcript, isProcessing]);

  if (!transcript && !isProcessing) {
    return (
      <Card
        className={cn(
          "border-dashed bg-muted/30",
          className
        )}
      >
        <CardContent className="flex min-h-[120px] items-center justify-center p-6">
          <p className="text-center text-muted-foreground">
            {strings.transcriptPlaceholder}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {strings.yourTranscript}
        </h3>
        {transcript && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            aria-label={strings.clearTranscript}
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            {strings.clearTranscript}
          </Button>
        )}
      </div>

      <Card
        className={cn(
          "transition-all duration-300",
          isAnimating && "scale-105 shadow-lg",
          isProcessing && "animate-pulse"
        )}
      >
        <CardContent className="p-4">
          {isProcessing && !transcript ? (
            <div className="flex min-h-[80px] items-center justify-center">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          ) : (
            <p className="text-lg leading-relaxed">
              {transcript}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
