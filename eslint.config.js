import { fileURLToPath } from 'node:url';
import globals from 'globals';
import imports from 'eslint-plugin-import';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        turnstile: 'readonly',
        gtag: 'readonly',
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
        svelteConfig,
      },
    },
  },
  {
    plugins: {
      import: imports,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
        },
      ],
      eqeqeq: 'error',
      camelcase: 'error',
      'no-console': 'error',
      'no-unneeded-ternary': 'error',
      'no-var': 'error',
      'require-await': 'error',
      'prefer-template': 'error',
      'no-implicit-coercion': 'error',
      'dot-notation': 'error',
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/no-useless-mustaches': 'error',
      'svelte/no-inspect': 'error',
      'svelte/no-at-debug-tags': 'error',
      'svelte/button-has-type': 'error',
      'svelte/sort-attributes': 'error',
      'svelte/no-top-level-browser-globals': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
);
