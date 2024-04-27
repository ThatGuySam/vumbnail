// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

// 50 MB Vercel Limit: https://vercel.com/docs/concepts/limits/overview#serverless-function-size

import 'dotenv/config'
import axios from 'axios'
import has from 'just-has'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import { parseOptionsFromPath } from '../../helpers/url.js'
import { getClipFromVideoId } from '../../helpers/get-clip-from-video-url.js'
import { 
    sendErrorResponseMedia,
    sendSuccessResponseMedia
} from '../../helpers/send-response.js'
import { getOutputImage } from '../../helpers/get-thumbnail-url.js'
import { MediaExtension } from '~/src/types.js'


// const ffmpeg = createFFmpeg({ log: true });

export interface VimeoJSONResponse {
    videoData?: any
    error?: any
}

interface HandlerOptions {
    videoId: string
    provider: string
    extension: string
    res: VercelResponse
    req: VercelRequest
}

async function videoHandler ( options: HandlerOptions ) {

    const {
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

async function imageHandler ( options: HandlerOptions ) {

    const {
        res,
    } = options


    // console.log('Options at imageHandler', Object.keys(options))


    const { 
        url: thumbnailUrl
    } = await getOutputImage( options )

    // Throw on no thumbnail URL
    if ( !thumbnailUrl ) {
        throw new Error('No thumbnail URL')
    }

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

export interface MediaRequest extends VercelRequest {}

export interface MediaResponse extends VercelResponse {}

export default async function ( req: MediaRequest, res: MediaResponse ) {
    // Throw on no URL
    if ( !req.url ) {
        throw new Error('No URL provided')
    }

    // Check for display error option here
    const enableErrorMediaResponse = !req.url.includes('disable-error-media')

    const options = parseOptionsFromPath( req.url ) as {
        videoId: string
        provider: string
        extension: MediaExtension
    }

    // Throw on no options
    if ( !options ) {
        throw new Error('No options provided')
    }

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