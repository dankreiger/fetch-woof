/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const babelRuntimeVersion = pkg.devDependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
);

const config = [
  {
    output: {
      file: pkg.main,
      format: 'cjs',
    },
  },
  {
    output: {
      file: pkg.module,
      format: 'es',
    },
  },
].map(({ output }) => ({
  input: 'src/index.ts',
  output,
  treeshake: {
    propertyReadSideEffects: false,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfigDefaults: {
        exclude: [
          // all TS test files, regardless whether co-located or in test/ etc
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/*.spec.tsx',
          '**/*.test.tsx',
          // TS defaults below
          'node_modules',
        ],
        compilerOptions: {
          sourceMap: false,
          declaration: false,
          jsx: 'react',
        },
      },
      tsconfigOverride: {
        compilerOptions: {
          target: 'esnext',
          declaration: false,
          declarationMap: false,
          emitDeclarationOnly: false,
        },
      },
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-transform-runtime',
        {
          version: babelRuntimeVersion,
          useESModules: output.format === 'es',
        },
      ],
      babelHelpers: 'runtime',
    }),
    terser({
      output: { comments: false },
      compress: {
        unsafe: true,
        keep_infinity: true,
        pure_getters: true,
        passes: 10,
      },
      ecma: output.format === 'es' ? 2020 : 5,
    }),
  ],
  external: [...Object.keys(pkg.devDependencies)],
}));

export default config;
