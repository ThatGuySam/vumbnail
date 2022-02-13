import test from 'ava'

import { getThumbnailUrl } from '../helpers/get-thumbnail-url.js'



test(`Can get Youtube Thumbnail URL`, async t => {

    const videoId = 'W2EMHNhyEnQ'

    const imageUrl = await getThumbnailUrl({
        videoId,
        provider: 'youtube',
        extension: 'jpg'
    })

    t.assert( imageUrl.includes( videoId ) )
})


// test(`Can get Vimeo Thumbnail URL`, async t => {

//     const imageUrl = await getThumbnailUrl({
//         videoId: '376454747',
//         provider: 'vimeo',
//         extension: 'jpg'
//     })

//     t.assert( imageUrl.includes('https://i.vimeocdn.com/video/') )
// })

// test(`Can get Twitch URL`, async t => {

//     const ffmpegUrl = await getFfmpegUrl({
//         videoUrl: 'https://clips.twitch.tv/BashfulHelpfulSalamanderPrimeMe'
//     })

//     t.assert( isValidUrl( ffmpegUrl ) )
// })