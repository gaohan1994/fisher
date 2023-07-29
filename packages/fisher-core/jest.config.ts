import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

function getModuleNameMapper() {
  const map = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>', useESM: true });
  for (const key in map) {
    if (typeof map[key] === 'string') {
      map[key] = (map[key] as string).replace('index.js', 'index.ts');
    }
  }
  return map;
}

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    // '^(\\.{1,2}/.*)\\.js$': '$1',
    ...getModuleNameMapper(),
  },
  moduleDirectories: ['node_modules'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    // '^.+\\.[tj]sx?$': ['ts-jest', { useEsm: true }],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/fileTransformer.mjs',
  },
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
} as Config;
