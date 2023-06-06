import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

export default defineConfig((options: Options) => [
  {
    entry: ['src/index.ts'],
    outDir: 'build',
    target: 'node18',
    platform: 'node',
    format: ['esm'],
    splitting: false,
    sourcemap: options?.env?.NODE_ENV === 'development',
    minify: true,
    shims: true,
    dts: true,
    clean: true
  }
])
