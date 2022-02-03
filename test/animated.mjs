import test from 'ava'

import { getFfmpegUrl } from '../helpers/get-ffmpeg-url.mjs'
import { isValidUrl } from '../helpers/url.mjs'


test(`Can test`, t => {
    t.pass()
})


test(`Can get Youtube URL`, async t => {

    const ffmpegUrl = await getFfmpegUrl({
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })

    t.assert( isValidUrl( ffmpegUrl ) )
})
