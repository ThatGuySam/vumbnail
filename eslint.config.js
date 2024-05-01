import antfu from '@antfu/eslint-config'

export default antfu({
    astro: false,
    vue: false,

    stylistic: {
        indent: 4,
    },

    ignores: [
        'pnpm-workspace.yaml',
    ],
})
