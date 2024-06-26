import process from 'node:process'
// import youtubedl from 'youtube-dl-exec'
import urlParser from 'js-video-url-parser'
import axios from 'axios'
import { z } from 'zod'

import type { VideoInfoStrict } from '../src/types.js'
import type { YouTubeDlpFormat, YouTubeDlpResponse } from './yt-dlp.js'

const Env = z.object( {
    // URL that is https and does not end in a slash
    PRIVATE_VIDEO_API_HOST: z.string()
        .startsWith( 'https' )
        .refine( value => !value.endsWith( '/' ) ),
} )
    .parse( process.env )

const providerDefaultOptions = {
    vimeo: {
        extension: 'mp4',
    },
    youtube: {
        extension: 'webm',
    },
} as const

const videoApiHost = Env.PRIVATE_VIDEO_API_HOST

interface FormatOptions {
    extension: string
    protocol?: string
    formats: YouTubeDlpFormat[]
}

function findFormat ( options: FormatOptions ) {
    const {
        extension,
        // protocol = 'https',
        formats,
    } = options

    let foundFormat = null
    let smallestSize = Number.POSITIVE_INFINITY

    for ( const format of formats ) {
        // Skip different extensions
        if ( format.ext !== extension ) {
            continue
        }

        // Skip different protocols
        // if ( format.protocol !== protocol ) {
        //     continue
        // }

        if ( format.width && format.width < smallestSize ) {
            smallestSize = format.width
            foundFormat = format
        }
    }

    if ( foundFormat ) {
        return foundFormat
    }

    throw new Error( `Could not find format for extension ${ extension }` )
}

interface GetFfmpegUrlOptions {
    videoUrl: string
    extension?: string
}

export async function getFfmpegUrl ( options: GetFfmpegUrlOptions ) {
    // https://github.com/Zod-/jsVideoUrlParser#readme
    // @ts-expect-error - urlParser is not typed
    const { provider }: VideoInfoStrict = urlParser.parse( options.videoUrl )

    if ( !provider ) {
        throw new Error( `Could not find provider for video ${ options.videoUrl }` )
    }

    // Get options for provider
    const defaultOptions = providerDefaultOptions[ provider ]

    const {
        videoUrl,
        extension,
    } = {
        ...defaultOptions,
        ...options,
    }

    // Preferred format list separated by slashes
    //
    // Vimeo Example: http-240p/http-360p/worstvideo[ext=mp4]/mp4
    // https://github.com/ytdl-org/youtube-dl/blob/master/README.md#format-selection
    const formatOptions = [
        // Vimeo Formats
        'http-240p',
        'http-360p',
        'http-480p',

        // Generic
        'worstvideo[ext=mp4]',
        'mp4',
    ].join( ',' )

    /**
     * We'll attach the string with a template
     * since the server can't read encoded URLs
     */
    const ytdlUrl = `${ videoApiHost }/api/info?query=${ videoUrl }&format=${ formatOptions }`

    // console.log('ytdlUrl', ytdlUrl)

    const requestOptions = {
        // query URL without using browser cache
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    }

    // Get the video data
    const { data: youtubeDlInfo } = await axios.get<YouTubeDlpResponse>( ytdlUrl.href, requestOptions )
        .catch( ( error ) => {
            console.warn( `Error fetching video ${ videoUrl }`, error )
            throw error
        } )

    const foundFormat = findFormat( {
        extension,
        formats: youtubeDlInfo.formats,
    } )

    // console.log('foundFormat', foundFormat)
    // console.log('url', youtubeDlInfo.url)

    // process.exit()

    return foundFormat.url
}
