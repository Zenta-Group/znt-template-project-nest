import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default {
  files: ['**/*.ts'],
  ignores: [],
  languageOptions: {
    parser,
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: new URL('.', import.meta.url).pathname,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
