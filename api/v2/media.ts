// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

// 50 MB Vercel Limit: https://vercel.com/docs/concepts/limits/overview#serverless-function-size

import 'dotenv/config'
import axios from 'axios'
import has from 'just-has'

import { parseOptionsFromPath } from '../../helpers/url.js'
import { getClipFromVideoId } from '../../helpers/get-clip-from-video-url.js'
import { 
    sendErrorResponseMedia,
    sendSuccessResponseMedia
} from '../../helpers/send-response.js'
import { getOutputImage } from '../../helpers/get-thumbnail-url.js'


// const ffmpeg = createFFmpeg({ log: true });

export interface VimeoJSONResponse {
    videoData?: any
    error?: any
}



async function defaultHandler ({
    req, 
    res,
    options
}) {
    const { videoId } = options

    const apiUrl = `https://vimeo.com/api/v2/video/${ options.videoId }.json`

    const { videoData = null, error = null }: VimeoJSONResponse = await axios.get(apiUrl).then(response => {
        
        // console.log(videoData)
        return {
          videoData: response.data[0]
        }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    }).catch(error => {
        console.warn(`Error fetching video ${videoId}`, error)

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


async function videoHandler ( options = {} ) {

    const {
        req,
        res,
    } = options

    const {
        fileStream,
        videoProcess
    } = await getClipFromVideoId( options.videoId, {
        provider: options.provider, 
        res,
    })

    // Pipe ffmpeg output to response
    await sendSuccessResponseMedia({
        res,
        extension: options.extension,
        fileStream//: ffmpegProcess.stdout
    })

    // Wait for ffmpeg to finish
    await videoProcess

    return
}

async function imageHandler ( options = {} ) {

    const {
        req,
        res,
    } = options


    // console.log('Options at imageHandler', Object.keys(options))


    const { 
        url: thumbnailUrl
    } = await getOutputImage( options )

    // console.log('thumbnailUrl', thumbnailUrl)

    const thumbResponse = await axios.get( thumbnailUrl, {
        responseType: 'stream'
    })

    // Pipe ffmpeg output to response
    await sendSuccessResponseMedia({
        res,
        extension: options.extension,
        fileStream: thumbResponse.data
    })

    return
}

export interface MediaRequest extends Request {
    supressErrors?: boolean
    statusCode?: number
}

export interface MediaResponse extends Response {
    send: (data: any) => void
    statusCode?: number
}

export default async function ( req: MediaRequest, res: MediaResponse ) {

    // Check for display error option here
    const enableErrorMediaResponse = !req.url.includes('disable-error-media')

    const options = parseOptionsFromPath( req.url, { supressErrors: !!req?.supressErrors })

    try {

        // console.log('url', req.url)

        // Check that options is an object
        if ( Object( options ) !== options ) {
            throw new Error('Invalid options')
        }

        const handlers = {
            'mp4': videoHandler,
            'jpg': imageHandler,
            'jpeg': imageHandler,
            'png': imageHandler,
        }

        if ( has( handlers, options.extension ) ) {
            
            const handler = handlers[ options.extension ]

            await handler( {
                ...options,
                req,
                res,
            } )
        
            return
        }


        // Default handler
        // await defaultHandler( options )
    
        // res.json(options)

        throw new Error('Not implemented')

    } catch ( error ) {

        // console.log('options', options)

        if ( enableErrorMediaResponse === false ) {
            // throw 

            res.statusCode = 500
            
            res.send('Error')

            return
        }

        await sendErrorResponseMedia({
            req,
            res,
            error,
            type: options?.extension || 'unknown'
        })
    }
}