import test from 'ava'

import { getFfmpegUrl } from '../helpers/get-ffmpeg-url.js'
import { isValidUrl } from '../helpers/url.js'


test(`Can test`, t => {
    t.pass()
})


test(`Can get Youtube URL`, async t => {

    const ffmpegUrl = await getFfmpegUrl({
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })

    t.assert( isValidUrl( ffmpegUrl ) )
})


test(`Can get Vimeo URL`, async t => {

    const ffmpegUrl = await getFfmpegUrl({
        videoUrl: 'https://vimeo.com/358629078'
    })

    t.assert( isValidUrl( ffmpegUrl ) )
})

// test(`Can get Twitch URL`, async t => {

//     const ffmpegUrl = await getFfmpegUrl({
//         videoUrl: 'https://clips.twitch.tv/BashfulHelpfulSalamanderPrimeMe'
//     })

//     t.assert( isValidUrl( ffmpegUrl ) )
// })
