// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

// 50 MB Vercel Limit: https://vercel.com/docs/concepts/limits/overview#serverless-function-size

import '../../helpers/sentry-init.js'
import 'dotenv/config'
import axios from 'axios'
import has from 'just-has'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as Sentry from '@sentry/node'

/**
 * Vercel serverless functions don't seem to like path aliases
 * so we'll use the full path here for now
 */
import { parseOptionsFromPath } from '../../helpers/url.js'
import { getClipFromVideoId } from '../../helpers/get-clip-from-video-url.js'
import { 
    sendErrorResponseMedia,
    sendSuccessResponseMedia
} from '../../helpers/send-response.js'
import { getOutputImage } from '../../helpers/get-thumbnail-url.js'
import { HandlerOptions, ImageExtension, PixelMediaExtension } from '../../src/types.js'


// const ffmpeg = createFFmpeg({ log: true });

export interface VimeoJSONResponse {
    videoData?: any
    error?: any
}

async function videoHandler ( options: HandlerOptions ) {

    const {
        req,
        res,
        extension
    } = options

    if ( !extension ) {
        throw new Error('No extension')
    }

    const {
        fileStream,
        videoProcess
    } = await getClipFromVideoId( options.videoId, {
        ...options
    })

    // Pipe ffmpeg output to response
    await sendSuccessResponseMedia({
        req,
        res,
        extension,
        fileStream//: ffmpegProcess.stdout
    })

    // Wait for ffmpeg to finish
    await videoProcess

    return
}

const imageExtensions = ['jpg', 'jpeg', 'png']
function isImageExtension ( extension: string ): extension is ImageExtension {
    return imageExtensions.includes( extension )
}

async function imageHandler ( options: HandlerOptions ) {

    const {
        req,
        res,
    } = options
    const { extension, videoId, provider } = options

    // console.log('Options at imageHandler', Object.keys(options))

    if ( !extension || !videoId || !provider ) {
        throw new Error('No extension, videoId, or provider')
    }

    if ( !isImageExtension( extension ) ) {
        throw new Error('Invalid extension')
    }

    const { 
        url: thumbnailUrl
    } = await getOutputImage( {
        ...options,
        videoId,
        provider,
        extension
    } )

    // Throw on no thumbnail URL
    if ( !thumbnailUrl ) {
        throw new Error('No thumbnail URL')
    }

    const thumbResponse = await axios.get( thumbnailUrl, {
        responseType: 'stream'
    })

    // Pipe ffmpeg output to response
    await sendSuccessResponseMedia({
        req,
        res,
        extension: extension,
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

    const options = parseOptionsFromPath( req.url )

    try {
        const { provider } = options
        // console.log('url', req.url)

        // Check that options is an object
        if (
            Object( options ) !== options
            || !provider
        ) {
            throw new Error('Invalid options')
        }

        const handlers: Record<PixelMediaExtension, ( options: HandlerOptions ) => Promise<void>> = {
            'mp4': videoHandler,
            'webm': videoHandler,
            'jpg': imageHandler,
            'jpeg': imageHandler,
            'png': imageHandler,
        }

        if ( options.extension && has( handlers, options.extension ) ) {
            
            const handler = handlers[ options.extension ]

            await handler( {
                ...options,
                req,
                res,
                provider
            } )
        
            return
        }


        // Default handler
        // await defaultHandler( options )
    
        // res.json(options)

        throw new Error('Not implemented')

    } catch ( error ) {
        Sentry.captureException( error, {
            extra: {
                url: req.url,
                options
            }
        })

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