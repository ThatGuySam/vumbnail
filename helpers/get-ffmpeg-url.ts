import process from 'node:process'
// import youtubedl from 'youtube-dl-exec'
import urlParser from 'js-video-url-parser'
import axios from 'axios'
import { z } from 'zod'

import type { VideoInfoStrict } from '~/src/types.js'

const Env = z.object({
    // URL that is https and does not end in a slash
    PRIVATE_VIDEO_API_HOST: z.string()
        .startsWith('https')
        .refine(value => !value.endsWith('/')),
})
    .parse(process.env)

const providerDefaultOptions = {
    vimeo: {
        extension: 'mp4',
    },
    youtube: {
        extension: 'webm',
    },
} as const

const videoApiHost = Env.PRIVATE_VIDEO_API_HOST

interface Format {
    ext: string
    protocol: string
    url: string
    width: number
}

interface FormatOptions {
    extension: string
    protocol?: string
    targetFormat?: string
    formats: Format[]
}

function findFormat(options: FormatOptions) {
    const {
        extension,
        protocol = 'https',
        formats,
    } = options

    let foundFormat = null
    let smallestSize = Number.POSITIVE_INFINITY

    for (const format of formats) {
        // Skip different extensions
        if (format.ext !== extension) { continue }

        // Skip different protocols
        if (format.protocol !== protocol) { continue }

        if (format.width < smallestSize) {
            smallestSize = format.width
            foundFormat = format
        }
    }

    if (foundFormat) { return foundFormat }

    throw new Error(`Could not find format for extension ${extension}`)
}

interface GetFfmpegUrlOptions {
    videoUrl: string
    extension?: string
}

export async function getFfmpegUrl(options: GetFfmpegUrlOptions) {
    // https://github.com/Zod-/jsVideoUrlParser#readme
    // @ts-expect-error - urlParser is not typed
    const { provider }: VideoInfoStrict = urlParser.parse(options.videoUrl)

    if (!provider) { throw new Error(`Could not find provider for video ${options.videoUrl}`) }

    // Get options for provider
    const defaultOptions = providerDefaultOptions[provider]

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
    ].join('/')

    const ytdlUrl = new URL(`${videoApiHost}/api/info?q=${videoUrl}&f=${formatOptions}`)

    // console.log('ytdlUrl', ytdlUrl)

    const requestOptions = {
        // query URL without using browser cache
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    }

    interface YouTubeDLResponse {
        formats: Format[]
    }

    // Get the video data
    const { data: youtubeDlInfo } = await axios.get<YouTubeDLResponse>(ytdlUrl.href, requestOptions)
        .catch((error) => {
            console.warn(`Error fetching video ${videoUrl}`, error)
            throw error
        })

    // const formats = youtubeDlInfo.formats.map( format => {
    //   delete format.url
    //   delete format.fragments
    //   delete format.manifest_url
    //   delete format.http_headers

    //   return format
    // })

    // console.log('formats', formats)

    const foundFormat = findFormat({
        extension,
        formats: youtubeDlInfo.formats,
    })

    // console.log('foundFormat', foundFormat)
    // console.log('url', youtubeDlInfo.url)

    // process.exit()

    return foundFormat.url
}
