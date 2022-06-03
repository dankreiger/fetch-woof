import "@testing-library/dom";
import "jest-environment-jsdom";
import type { InitialOptionsTsJest } from 'ts-jest/dist/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: InitialOptionsTsJest = {
  globals: {
    'ts-jest': {},
  },
  transform: {
    ...tsjPreset.transform,
  },
  testEnvironment: 'jsdom',
};
export default config;
