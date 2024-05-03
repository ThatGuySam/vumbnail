import { expect, it } from 'vitest'

import { getInputImageDetails, getOutputImage } from '../../helpers/get-thumbnail-url.js'
import type { ImageDetails } from '../../src/types.js'

interface ImageExample {
    options: {
        videoId: string
        targetSizeKey: string
        provider: string
    }
    expected: ImageDetails
}

it( 'can get Youtube Thumbnail URL', async () => {
    const videoId = 'W2EMHNhyEnQ'

    const { url } = await getOutputImage( {
        videoId,
        provider: 'youtube',
        extension: 'jpg',
        targetSizeKey: 'mqdefault',
    } )

    // t.log('url', url)

    expect( url?.includes( videoId ) )
} )

it( 'can get Vimeo Thumbnail URL', async () => {
    const { url } = await getOutputImage( {
        videoId: '376454747',
        provider: 'vimeo',
        extension: 'jpg',
        targetSizeKey: 'thumbnail_large',
    } )

    expect( url?.includes( 'https://i.vimeocdn.com/video/' ) )
} )

it( 'can get Vimeo Thumbnail URL without size', async () => {
    const { url } = await getOutputImage( {
        videoId: '376454747',
        provider: 'vimeo',
        extension: 'jpg',
        // targetSizeKey: 'thumbnail_large',
    } )

    expect( url?.includes( 'https://i.vimeocdn.com/video/' ) )
} )

// test(`Can get Twitch URL`, async t => {

//     const ffmpegUrl = await getFfmpegUrl({
//         videoUrl: 'https://clips.twitch.tv/BashfulHelpfulSalamanderPrimeMe'
//     })

//     t.assert( isValidUrl( ffmpegUrl ) )
// })

const youtubeImageDetailExamples = [
    {
        options: {
            videoId: '5e7QWV9LB_c',
            targetSizeKey: 'mqdefault',
            provider: 'youtube',
        },
        expected: {
            extension: 'jpg',
            inputUrl: 'https://i.ytimg.com/vi/5e7QWV9LB_c/mqdefault.jpg',
            size: {
                width: 320,
                height: 180,
                pathOptionName: true,
            },
        },
    },
    {
        options: {
            videoId: '5e7QWV9LB_c',
            targetSizeKey: 'thumbnail_large',
            provider: 'youtube',
        },
        expected: {
            extension: 'jpg',
            inputUrl: 'https://i.ytimg.com/vi/5e7QWV9LB_c/hqdefault.jpg',
            size: {
                width: 480,
                height: 360,
                pathOptionName: true,
            },
        },
    },
] as const satisfies ImageExample[]

for ( const imageDetails of youtubeImageDetailExamples ) {
    it( 'can get valid input Youtube image: ', async () => {
        const details = await getInputImageDetails( imageDetails.options )

        // t.deepEqual(details, imageDetails.expected)
        expect( details ).toEqual( imageDetails.expected )
    } )
}

const vimeoImageDetailExamples = [
    {
        options: {
            videoId: '358629078',
            targetSizeKey: 'thumbnail_large',
            provider: 'vimeo',
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 640,
                height: 360,
                pathOptionName: 'large',
            },
        },
    },
    {
        options: {
            videoId: '358629078',
            targetSizeKey: 'thumbnail_medium',
            provider: 'vimeo',
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 200,
                height: 150,
                pathOptionName: 'medium',
            },
        },
    },

    //  non '-d_' url
    {
        options: {
            videoId: '643816644',
            targetSizeKey: 'thumbnail_large',
            provider: 'vimeo',
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 640,
                height: 360,
                pathOptionName: 'large',
            },
        },
    },
] as const satisfies ImageExample[]

for ( const imageDetails of vimeoImageDetailExamples ) {
    it( 'can get valid input Vimeo image: ', async () => {
        const details = await getInputImageDetails( imageDetails.options ) as ImageDetails

        // We check the url starts with the vimeo cdn
        expect( details.inputUrl?.includes( 'https://i.vimeocdn.com/video/' ) )

        // We check the url end with the correct size
        expect( details.inputUrl?.split( '_' )[ 1 ] ).toEqual( `${ imageDetails.expected.size.width }x${ imageDetails.expected.size.height }` )

        // Then delete the url since it's not an exact match we can put in the test
        delete details.inputUrl

        expect( details ).toEqual( imageDetails.expected )
    } )

    // test(`Can handler key from path: ${pathExample.path}`, t => {
    //     const options = parseOptionsFromPath(pathExample.path)

    //     t.deepEqual(options, pathExample.expected)
    // })
}
