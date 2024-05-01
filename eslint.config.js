import antfu from '@antfu/eslint-config'

// antfu lint - https://github.com/antfu/eslint-config
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

    // Spacing
    {
        files: [ '**/*.ts', '**/*.tsx', '**/*.js', '**/*.yaml' ],
        rules: {
            'style/space-in-parens': [ 'error', 'always' ],
            'style/space-before-function-paren': [ 'error', 'always' ],
            'style/object-curly-spacing': [ 'error', 'always' ],
            'style/array-bracket-spacing': [ 'error', 'always' ],
            'style/computed-property-spacing': [ 'error', 'always' ],
            'style/template-curly-spacing': [ 'error', 'always' ],
            'style/jsx-curly-spacing': [ 'error', 'always' ],
        },
    },

    // Misc
    // If this section gets too big, consider moving to a separate config group
    {
        files: [ '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx' ],
        rules: {
            'test/prefer-lowercase-title': 'off',
            'curly': [ 'error', 'all' ],
            'quotes': [ 'error', 'single' ],
        },
    },
)
