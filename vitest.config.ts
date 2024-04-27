/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // @ts-expect-error - Not sure what's going on here
    plugins: [tsconfigPaths()]
})