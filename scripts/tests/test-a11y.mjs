import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { assert } from './lib/assert.mjs';

const ROOT_DIR = fileURLToPath(new URL('../../', import.meta.url));

const FILES = [
  'src/screens/LoginScreen.tsx',
  'src/screens/SignupScreen.tsx',
  'src/screens/LocationScreen.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/InsurerLoginScreen.tsx',
  'src/components/dashboard/VoiceAssistant.tsx',
];

async function main() {
  const missingAriaOnIconButtons = [];
  const missingInputLabels = [];

  for (const relativePath of FILES) {
    const absolutePath = join(ROOT_DIR, relativePath);
    const source = await readFile(absolutePath, 'utf8');

    const inputRegex = /<Input[\s\S]*?\/>/g;
    const inputMatches = [...source.matchAll(inputRegex)];

    for (const match of inputMatches) {
      const block = match[0];
      const line = source.slice(0, match.index ?? 0).split('\n').length;
      if (!/\blabel\s*=/.test(block)) {
        missingInputLabels.push(`${relativePath}:${line}`);
      }
    }

    const buttonRegex = /<button\b[\s\S]*?>[\s\S]*?<\/button>/g;
    const buttonMatches = [...source.matchAll(buttonRegex)];

    for (const match of buttonMatches) {
      const block = match[0];
      const openTagMatch = block.match(/^<button\b[\s\S]*?>/);
      const openTag = openTagMatch ? openTagMatch[0] : '';
      const innerHtml = block.slice(openTag.length, -'</button>'.length);
      const textContent = innerHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const hasAriaLabel = /\baria-label\s*=/.test(openTag);
      const hasTitle = /\btitle\s*=/.test(openTag);
      const line = source.slice(0, match.index ?? 0).split('\n').length;

      if (!textContent && !hasAriaLabel && !hasTitle) {
        missingAriaOnIconButtons.push(`${relativePath}:${line}`);
      }
    }
  }

  assert(
    missingInputLabels.length === 0,
    `Missing Input labels found in: ${missingInputLabels.join(', ')}`,
  );

  assert(
    missingAriaOnIconButtons.length === 0,
    `Icon-only buttons without aria-label/title found in: ${missingAriaOnIconButtons.join(', ')}`,
  );

  console.log(
    JSON.stringify(
      {
        suite: 'a11y',
        status: 'passed',
        scannedFiles: FILES.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
