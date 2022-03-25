import test from 'ava'

import { getOutputImage } from '../helpers/get-thumbnail-url.js'
import { 
    getInputImageDetails
} from '../helpers/get-thumbnail-url.js'



test(`Can get Youtube Thumbnail URL`, async t => {

    const videoId = 'W2EMHNhyEnQ'

    const { url } = await getOutputImage({
        videoId,
        provider: 'youtube',
        extension: 'jpg',
        targetSizeKey: 'mqdefault',
    })

    // t.log('url', url)

    t.assert( url.includes( videoId ) )
})


test(`Can get Vimeo Thumbnail URL`, async t => {

    const { url } = await getOutputImage({
        videoId: '376454747',
        provider: 'vimeo',
        extension: 'jpg',
        targetSizeKey: 'thumbnail_large',
    })

    t.assert( url.includes('https://i.vimeocdn.com/video/') )
})

test(`Can get Vimeo Thumbnail URL without size`, async t => {

    const { url } = await getOutputImage({
        videoId: '376454747',
        provider: 'vimeo',
        extension: 'jpg',
        // targetSizeKey: 'thumbnail_large',
    })

    t.assert( url.includes('https://i.vimeocdn.com/video/') )
})

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
            provider: 'youtube'
        },
        expected: {
            extension: 'jpg',
            inputUrl: 'https://i.ytimg.com/vi/5e7QWV9LB_c/mqdefault.jpg',
            size: {
                width: 320,
                height: 180,
                pathOptionName: true,
            }
        }
    },
    {
        options: {
            videoId: '5e7QWV9LB_c',
            targetSizeKey: 'thumbnail_large', 
            provider: 'youtube'
        },
        expected: {
            extension: 'jpg',
            inputUrl: 'https://i.ytimg.com/vi/5e7QWV9LB_c/hqdefault.jpg',
            size: {
                width: 480,
                height: 360,
                pathOptionName: true,
            }
        }
    }
]

for ( const imageDetails of youtubeImageDetailExamples ) {

    test(`Can get valid input Youtube image: ${JSON.stringify( Object.values( imageDetails.options ) )}`, async t => {
        const details = await getInputImageDetails( imageDetails.options )
        
        t.deepEqual(details, imageDetails.expected)
    })

}



const vimeoImageDetailExamples = [
    {
        options: {
            videoId: '358629078',
            targetSizeKey: 'thumbnail_large', 
            provider: 'vimeo'
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 640,
                height: 360,
                pathOptionName: 'large',
            }
        }
    },
    {
        options: {
            videoId: '358629078',
            targetSizeKey: 'thumbnail_medium', 
            provider: 'vimeo'
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 200,
                height: 150,
                pathOptionName: 'medium',
            }
        }
    },

    //  non '-d_' url
    {
        options: {
            videoId: '643816644',
            targetSizeKey: 'thumbnail_large', 
            provider: 'vimeo'
        },
        expected: {
            extension: 'jpg',
            // inputUrl: 'https://i.vimeocdn.com/video/...',
            size: {
                width: 640,
                height: 360,
                pathOptionName: 'large',
            }
        }
    }
]

for ( const imageDetails of vimeoImageDetailExamples ) {

    test(`Can get valid input Vimeo image: ${JSON.stringify( Object.values( imageDetails.options ) )}`, async t => {

        const details = await getInputImageDetails( imageDetails.options )

        // We check the url starts with the vimeo cdn 
        t.assert( details.inputUrl.includes('https://i.vimeocdn.com/video/') )

        // We check the url end with the correct size
        t.is( details.inputUrl.split('_')[1], `${ imageDetails.expected.size.width }x${ imageDetails.expected.size.height }` )

        // Then delete the url since it's not an exact match we can put in the test
        delete details.inputUrl
        
        t.deepEqual(details, imageDetails.expected)
    })


    // test(`Can handler key from path: ${pathExample.path}`, t => {
    //     const options = parseOptionsFromPath(pathExample.path)
        
    //     t.deepEqual(options, pathExample.expected)
    // })

}

