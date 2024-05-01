import fs from 'fs-extra'

import {
    errorMedia,
} from './helpers/send-response.js'

const {
    svg,
    png,
    mp4,
} = errorMedia

'Magic happens here';
(async () => {
    const shikiFolder = './public/shiki'

    // https://github.com/shikijs/shiki-playground/blob/ddc3ce7577aca7696eee022da14f6004d24bf60c/package.json#L5
    const foldersToCopy = [
        'dist',
        'languages',
        'samples',
        'themes',
    ]

    // Ensure that the shiki public folder exists
    await fs.ensureDir(shikiFolder)

    // Keep folders that we do want to copy
    for (const folder of foldersToCopy) {
        // Copy onig.wasm from shiki to the public folder
        await fs.copy(
            `./node_modules/shiki/${folder}`,
            `${shikiFolder}/${folder}`,
        )
    }

    console.log('Files generated successfully!')

    process.exit()
})()
