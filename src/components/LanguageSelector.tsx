import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { LanguageCode, LanguageConfig } from "../lib/i18n";
import { LANGUAGE_CONFIGS } from "../lib/i18n";
import { cn } from "../lib/utils";

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageSelect: (language: LanguageCode) => void;
  showLabels?: boolean;
  variant?: "default" | "compact" | "full";
}

export function LanguageSelector({
  currentLanguage,
  onLanguageSelect,
  showLabels = true,
  variant = "default",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentConfig = LANGUAGE_CONFIGS[currentLanguage];

  if (variant === "compact") {
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={currentConfig.label}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          <span>{currentConfig.flag}</span>
        </Button>

        {isOpen && (
          <Card className="absolute right-0 top-full z-50 mt-2 min-w-[200px] p-2 shadow-lg">
            <div role="listbox" aria-label="Select language">
              {(Object.entries(LANGUAGE_CONFIGS) as [LanguageCode, LanguageConfig][]).map(
                ([code, config]) => (
                  <button
                    key={code}
                    role="option"
                    aria-selected={code === currentLanguage}
                    onClick={() => {
                      onLanguageSelect(code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      code === currentLanguage
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <span className="text-lg">{config.flag}</span>
                    <span className="font-medium">{config.nativeLabel}</span>
                  </button>
                )
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo/Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-lg">
            <Globe className="h-10 w-10 text-primary" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome
            </h1>
            <p className="text-lg text-muted-foreground">
              Select your preferred language to continue
            </p>
          </div>

          {/* Language Options */}
          <div className="space-y-3" role="listbox" aria-label="Select your language">
            {(Object.entries(LANGUAGE_CONFIGS) as [LanguageCode, LanguageConfig][]).map(
              ([code, config]) => (
                <Card
                  key={code}
                  role="option"
                  aria-selected={code === currentLanguage}
                  className={cn(
                    "cursor-pointer border-2 transition-all hover:shadow-lg",
                    code === currentLanguage
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => onLanguageSelect(code)}
                >
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{config.flag}</span>
                      <div className="text-left">
                        <p className="text-xl font-semibold">{config.nativeLabel}</p>
                        <p className="text-sm text-muted-foreground">{config.label}</p>
                      </div>
                    </div>
                    {code === currentLanguage && (
                      <Badge variant="default" className="ml-2">
                        Selected
                      </Badge>
                    )}
                  </div>
                </Card>
              )
            )}
          </div>

          {/* Continue hint */}
          {currentLanguage && (
            <p className="text-sm text-muted-foreground">
              Click on a language above to continue
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={currentConfig.label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span>{currentConfig.flag}</span>
        {showLabels && <span>{currentConfig.nativeLabel}</span>}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full z-50 mt-2 min-w-[200px] p-2 shadow-lg">
          <div role="listbox" aria-label="Select language">
            {(Object.entries(LANGUAGE_CONFIGS) as [LanguageCode, LanguageConfig][]).map(
              ([code, config]) => (
                <button
                  key={code}
                  role="option"
                  aria-selected={code === currentLanguage}
                  onClick={() => {
                    onLanguageSelect(code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    code === currentLanguage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <span className="text-lg">{config.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{config.nativeLabel}</span>
                    <span className="text-xs opacity-70">{config.label}</span>
                  </div>
                </button>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
