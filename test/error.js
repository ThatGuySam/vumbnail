import test from 'ava'


// import { isValidUrl } from '../helpers/url.js'
// import { getFfmpegUrl } from '../helpers/get-ffmpeg-url.js'
// import { getClipFromVideoUrl } from '../../helpers/get-clip-from-video-url.js'

import videoFunction from '../api/v2/video.js'





test(`Can get non-media error response URL`, async t => {

    let responseData = null

    try {
        await videoFunction(
            // Request
            {
                url: '/!!!!!!!!!_disable-error-media.mp4'
            },
            // Response
            {
                send: data => {
                    responseData = data
                    //t.pass()
                }
            }
        )
    } catch ( error ) {
        // console.log('error', error)

        // Assert that the error is a non-media error
        // t.assert( !!error.message, 'Has error message' )
    }

    t.assert( responseData, 'Has response data' )
})