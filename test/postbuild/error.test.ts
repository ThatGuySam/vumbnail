import { expect, it } from 'vitest'

// import { isValidUrl } from '../helpers/url.js'
// import { getFfmpegUrl } from '../helpers/get-ffmpeg-url.js'
// import { getClipFromVideoUrl } from '../../helpers/get-clip-from-video-url.js'

import type { MediaRequest, MediaResponse } from '~/api/v2/media.js'
import videoFunction from '~/api/v2/media.js'

it(`can get non-media error response URL`, async () => {
    let responseData = null

    try {
        await videoFunction(
            // Request
            {
                url: '/!!!!!!!!!_disable-error-media.mp4',
            } as MediaRequest,
            // Response
            {
                send: (data) => {
                    responseData = data
                    // t.pass()
                },
            } as MediaResponse,
        )
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error)

        // Assert that the error is a non-media error
        // t.assert( !!error.message, 'Has error message' )
    }

    expect(responseData).toBeTruthy()
})
