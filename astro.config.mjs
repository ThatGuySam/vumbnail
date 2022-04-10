import { defineConfig } from 'astro/config' // https://github.com/withastro/astro/tree/main/packages/integrations/vercel
// import vercel from '@astrojs/vercel'

import tailwind from "@astrojs/tailwind"

import vue from "@astrojs/vue"

// https://astro.build/config
export default defineConfig({
  site: 'https://vumbnail.com',
  // projectRoot: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  // pages: './src/pages', // Path to Astro components, pages, and data
  // dist: './dist',       // When running `astro build`, path to final static output
  // public: './public',   // A folder of static files Astro will copy to the root. Useful for favicons, images, and other files that don’t need processing.
  integrations: [tailwind(), vue()]
});