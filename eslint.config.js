import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['assets/dist/**', 'demo/**', 'node_modules/**', 'vendor/**'],
  },
  eslint.configs.recommended,
  prettier,
  {
    files: ['assets/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        AbortController: 'readonly',
        CustomEvent: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        queueMicrotask: 'readonly',
        setTimeout: 'readonly',
      },
      sourceType: 'module',
    },
  },
];
