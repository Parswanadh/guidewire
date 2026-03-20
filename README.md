# Voice Assistant - Multilingual Web App

A production-quality, mobile-first voice assistant web application powered by Sarvam AI, supporting multiple Indian languages including Kannada, Hindi, and English.

## Features

- **Multilingual Support**: Native support for Kannada (ಕನ್ನಡ), Hindi (हिंदी), and English
- **Voice Recognition**: Speech-to-Text using Sarvam's Saaras API v3
- **Text-to-Speech**: Natural voice playback using Sarvam's Bulbul API v3
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Optimized for mobile devices with touch-friendly controls
- **Accessible**: Full keyboard navigation and ARIA labels
- **Tested**: Comprehensive E2E tests with Playwright

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui patterns
- **Voice APIs**: Sarvam AI (Saaras v3 for STT, Bulbul v3 for TTS)
- **Testing**: Playwright for E2E testing
- **Build Tool**: Vite

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd guidewire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Sarvam API key:
```
VITE_SARVAM_API_KEY=your_actual_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SARVAM_API_KEY` | Your Sarvam AI API key (required) | - |
| `VITE_SARVAM_STT_URL` | Speech-to-Text API endpoint | `https://api.saaras.ai/v1/stt` |
| `VITE_SARVAM_TTS_URL` | Text-to-Speech API endpoint | `https://api.bulbul.ai/v1/tts` |

## Getting a Sarvam API Key

1. Visit [Sarvam AI](https://sarvam.ai/)
2. Sign up for an account
3. Navigate to the API section
4. Generate your API key
5. Add it to your `.env` file

## Running Tests

### E2E Tests with Playwright

```bash
# Run all tests
npm run test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test language-switch.spec.ts

# View test report
npx playwright show-report
```

### Building for Production

```bash
npm run build
```

The production files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
guidewire/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn-style UI components
│   │   ├── Layout.tsx      # Main layout component
│   │   ├── LanguageSelector.tsx
│   │   ├── VoiceControls.tsx
│   │   └── TranscriptView.tsx
│   ├── lib/                # Utility libraries
│   │   ├── i18n.ts         # Internationalization
│   │   ├── sarvamClient.ts # Sarvam API client
│   │   ├── audioRecorder.ts # Audio recording utilities
│   │   └── utils.ts        # Common utilities
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── tests/
│   └── e2e/                # Playwright E2E tests
│       ├── language-switch.spec.ts
│       └── voice-flow.spec.ts
├── playwright.config.ts    # Playwright configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Adding More Languages

To add support for additional languages:

1. Edit `src/lib/i18n.ts`
2. Add the language code to `LANGUAGE_CONFIGS`:
```typescript
export const LANGUAGE_CONFIGS: Record<LanguageCode, LanguageConfig> = {
  // ... existing languages
  "te-IN": {
    code: "te-IN",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    dir: "ltr",
    flag: "🇮🇳",
  },
};
```

3. Add translations to `TRANSLATIONS`:
```typescript
export const TRANSLATIONS: Record<LanguageCode, I18nStrings> = {
  // ... existing languages
  "te-IN": {
    appTitle: "వాయిస్ అసిస్టెంట్",
    // ... add all other strings
  },
};
```

4. Update the `LanguageCode` type to include the new language

## Deployment

### Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Add `VITE_SARVAM_API_KEY` (prefix with `VITE_` for client-side access)

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

Just run `npm run build` and deploy the `dist` folder.

## Development

### Code Quality

- **TypeScript Strict Mode**: Enabled for maximum type safety
- **ESLint**: Configured for React and TypeScript
- **No `any` types**: All code is fully typed

### Component Patterns

- Functional components with hooks
- Props interfaces for type safety
- Consistent naming conventions
- ARIA labels for accessibility

## License

MIT

## Support

For issues and questions:
- Check the [Sarvam AI Documentation](https://docs.sarvam.ai/)
- Open an issue in the repository

---

Built with ❤️ using Sarvam AI
