import test from 'ava'


// import { isValidUrl } from '../helpers/url.js'
// import { getFfmpegUrl } from '../helpers/get-ffmpeg-url.js'
// import { getClipFromVideoUrl } from '../../helpers/get-clip-from-video-url.js'


import type { MediaRequest, MediaResponse } from '../../api/v2/media.ts'
// @ts-expect-error - Vercel wants to know the file extension
import videoFunction from '../../api/v2/media.ts'


test(`Can get non-media error response URL`, async t => {
    let responseData = null

    try {
        await videoFunction(
            // Request
            {
                url: '/!!!!!!!!!_disable-error-media.mp4',
                supressErrors: true,
            } as MediaRequest,
            // Response
            {
                send: data => {
                    responseData = data
                    //t.pass()
                }
            } as MediaResponse
        )
    } catch ( error ) {
        // console.log('error', error)

        // Assert that the error is a non-media error
        // t.assert( !!error.message, 'Has error message' )
    }

    t.assert( responseData, 'Has response data' )
})