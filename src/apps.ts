const nextServerPackage = {
  scripts: {
    dev: 'nodemon',
    build: 'next build && tsc --project tsconfig.server.json',
    start: 'NODE_ENV=production node dist/server/index.js',
    test: 'jest',
    'ts:check': 'tsc --noEmit',
  },
};

export const getCommonApp = (appName: string) => ({
  deps: {
    direct: [
      'react',
      'react-dom',
      'react',
      'react-dom',
      'what-input',
    ],
    dev: [
      '@commitlint/config-conventional',
      '@commitlint/cli',
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@types/jest',
      '@types/node',
      '@types/react',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'cypress',
      'eslint',
      '@lasalefamine/eslint-config',
      'eslint-config-next',
      'eslint-plugin-cypress',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-simple-import-sort',
      'husky',
      'identity-obj-proxy',
      'jest',
      'jest-canvas-mock',
      'lint-staged',
      'react-test-renderer',
      'stylelint',
      'stylelint-config-equinusocio',
      'stylelint-config-standard',
      'ts-jest',
      'typescript',
      'postcss-mixins',
      'postcss-easy-import',
      'postcss-normalize',
      'postcss-preset-env',
      'postcss-responsive-type',
      'postcss-inset',
      'postcss',
      'cssnano-preset-advanced',
      'cssnano',
    ],
  },
  package: {
    name: appName,
    version: '0.0.0',
    private: true,
    'lint-staged': {
      '*.{ts,tsx,js,jsx}': 'eslint',
      '*.css': 'stylelint',
    },
    jest: {
      roots: [
        '<rootDir>',
      ],
      moduleNameMapper: {
        '\\.(css)$': 'identity-obj-proxy',
        '\\.svg': '<rootDir>/.jest/__mocks__/svgr-mock.ts',
        '^jest-helpers/(.*)': '<rootDir>/.jest/$1',
        '^components/(.*)': '<rootDir>/src/components/$1',
        '^core/(.*)': '<rootDir>/src/core/$1',
      },
      setupFiles: [
        '<rootDir>/.jest/env.ts',
        'jest-canvas-mock',
      ],
      transform: {
        '^.+\\.(tsx|ts|js|jsx)?$': 'ts-jest',
      },
      testPathIgnorePatterns: [
        'node_modules',
        'cypress',
      ],
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      testEnvironment: 'jsdom',
    },
    browserslist: [
      'last 1 Chrome versions',
      'last 1 Firefox versions',
      'last 1 Safari versions',
      'last 1 Edge versions',
    ],
  },
});

export const getNextApp = () => ({
  defaultTemplate: 'next' as const,
  deps: {
    direct: ['next'],
    dev: [
      '@next/bundle-analyzer',
    ],
  },
  package: {
    scripts: {
      dev: 'next dev',
      build: 'next build',
      export: 'next export -o dist',
      start: 'next start',
      test: 'jest',
      'ts:check': 'tsc --noEmit',
      postinstall: 'husky install',
    },
  },
});

export const templatesDepencencies = {
  'next-i18n': {
    package: nextServerPackage,
    direct: ['next-i18next', 'express'],
    dev: ['nodemon', '@types/express', 'ts-node'],
  },
};
