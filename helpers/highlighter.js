// Adapted from https://github.com/shikijs/shiki-playground/blob/ddc3ce7577aca7696eee022da14f6004d24bf60c/src/highlighter.ts

import { getHighlighter, setCDN, setWasm } from 'shiki'
// https://github.com/shikijs/shiki-playground/blob/main/src/preload.ts
// import { preloadedThemes, preloadedLangs } from './preload'

setWasm('/shiki/dist/onigasm.wasm')
setCDN('/shiki/')

let highlighter

export async function initHighlighter() {
    if (highlighter) {
        throw new Error('Highlighter already initialized')
    }

    highlighter = await getHighlighter({
        themes: ['github-dark'],
        langs: ['html'],
    })

    return highlighter
}

// export function getHighlighterInstance () {
//     if ( !highlighter ) throw new Error('Highlighter not initialized')

//     return highlighter
// }
