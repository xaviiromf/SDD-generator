import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist', 'node_modules', 'test-results', 'playwright-report'] }, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{ts,tsx}'], languageOptions: { globals: { console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', URL: 'readonly', Blob: 'readonly', window: 'readonly', document: 'readonly', navigator: 'readonly', performance: 'readonly', Worker: 'readonly', localStorage: 'readonly', caches: 'readonly', fetch: 'readonly', self: 'readonly' } }
});
