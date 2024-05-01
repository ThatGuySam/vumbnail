import antfu from '@antfu/eslint-config'

export default antfu(
    {
        astro: false,
        vue: false,
        typescript: {
            // tsconfigPath: 'tsconfig.json',
        },

        stylistic: {
            indent: 4,
        },

        ignores: [
            'pnpm-workspace.yaml',
        ],
    },
    // Misc
    // If this section gets too big, consider moving to a separate config group
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            'test/prefer-lowercase-title': 'off',
            'curly': ['error', 'all'],
            'quotes': ['error', 'single'],
        },
    },
)
