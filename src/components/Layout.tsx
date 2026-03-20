import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { LanguageSelector } from "./LanguageSelector";
import type { LanguageCode } from "../lib/i18n";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  showLanguageSelector?: boolean;
  className?: string;
}

export function Layout({
  children,
  currentLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  className,
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Voice Assistant</span>
          </div>

          {/* Language Selector (Desktop) */}
          {showLanguageSelector && (
            <div className="hidden md:block">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageSelect={onLanguageChange}
                variant="compact"
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          {showLanguageSelector && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container px-4 py-4">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageSelect={(lang) => {
                  onLanguageChange(lang);
                  setIsMenuOpen(false);
                }}
                variant="default"
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={cn("container px-4 py-6 md:py-8", className)}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>Voice Assistant • Powered by Sarvam AI</p>
        </div>
      </footer>
    </div>
  );
}
