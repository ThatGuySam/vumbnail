// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

// 50 MB Vercel Limit: https://vercel.com/docs/concepts/limits/overview#serverless-function-size

import 'dotenv/config'
// URL utility
import axios from 'axios'


import { parseOptionsFromPath } from '../../helpers/url.js'
import { getClipFromVideoId } from '../../helpers/get-clip-from-video-url.js'
import { sendErrorResponseMedia } from '../../helpers/send-response.js'


// const ffmpeg = createFFmpeg({ log: true });


async function defaultHandler ({
    req, 
    res,
    options
}) {
    const apiUrl = `https://vimeo.com/api/v2/video/${ options.videoId }.json`

    const { videoData = null, error = null } = await axios.get(apiUrl).then(response => {
        
        // console.log(videoData)
        return {
          videoData: response.data[0]
        }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    }).catch(error => {
        console.warn(`Error fetching video ${id}`, error)

        return { error }
    })
    
    
    return {
        headers: {
            // Set Cors Headers to allow all origins so data can be requested by a browser
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        sendResponse: () => {
            res.json(videoData)
        }
    }
}


export default async function (req, res) {

    // Check for error option here
    

    try {

        console.log('url', req.url)

        const options = parseOptionsFromPath(req.url)

        if ( options.extension === 'mp4' ) {
            console.log('Is mp4')
    
            // videoUrl: `https://vimeo.com/${ options.videoId }`,
            // const videoId = `https://www.youtube.com/watch?v=${ options.videoId }`
    
            await getClipFromVideoId( options.videoId, {
                provider: options.provider, 
                res,
            })
    
            return
        }
    
        // res.json(options)

        throw new Error('Not implemented')
    
        return

    } catch ( error ) {
        await sendErrorResponseMedia({
            req,
            res,
            error,
            type: options.extension
        })
    }
}