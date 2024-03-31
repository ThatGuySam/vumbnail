export default () => {
    return {
      require: [
        'dotenv/config',
      ],
      // https://github.com/avajs/ava/blob/main/docs/recipes/watch-mode.md
      watchMode: {
        ignoreChanges: [
          '!**/*.{js,vue}',
          './build',
          './dist',
          './.output',
        ],
      },
      extensions: {
        "ts": "module"
      },
      nodeArguments: [
        "--import=tsimp"
      ],
      // tap: true,
      // verbose: true,
      color: true
    }
}