// import url from 'url'
import path from 'path'
import urlParser from 'js-video-url-parser'
import mapValues from 'just-map-values'

import { sizeOptions } from '../helpers/get-thumbnail-url.js'
import { VideoId, VideoOptions } from '../src/types.js'

export function isValidUrl ( url: string ): url is `http${ string }` {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

export function getAnyHost ( maybeUrl: string ) {
    if ( !isValidUrl ( maybeUrl ) ) {
        return ''
    }

    const url = new URL( maybeUrl )

    return url.host
}

export function getDomain () {

    if ( typeof import.meta.env.PUBLIC_VERCEL_URL === 'string' ) {
        return `https://${ import.meta.env.PUBLIC_VERCEL_URL }`
    }

    // @ts-expect-error - window is a global object
    const location = window?.location || undefined

    if ( typeof location !== 'undefined' && !location.host.includes('localhost') ) {
        return `${ location.protocol }//${ location.host }`
    }

    return `https://vumbnail.com`
}

export const optionSets = {
    ...mapValues( sizeOptions, ( value ) => ({ targetSizeKey: value.key }) ),
}

const optionKeys = Object.keys(optionSets)


export function isValidId ( maybeId: string ): maybeId is VideoId {
    const isCorrectLength = maybeId.length >= 8
    const isAlphanumeric = /^[a-zA-Z0-9_-]+$/i.test( maybeId )

    return isCorrectLength && isAlphanumeric
}

export function isSupportedVideoUrl ( maybeUrl: string ): boolean {
    if ( ! isValidUrl( maybeUrl ) ) {
        return false
    }

    // https://github.com/Zod-/jsVideoUrlParser#readme
    // @ts-expect-error - js-video-url-parser is not fully typed
    const urlDetails = urlParser.parse( maybeUrl )

    if ( !urlDetails || !urlDetails.provider ) {
        return false
    }

    // Reject URls with unsupported video IDs
    if ( !isValidId( urlDetails.id ) ) {
        return false
    }

    const supportedProviders = [
        'youtube',
        'vimeo',
    ]

    try {
        return supportedProviders.includes( urlDetails.provider )
    } catch ( error ) {
        return false
    }
}





export function getProviderAndIdFromFilename ( filenameWithoutExtension: string ) {
    // Assumptions
    // Youtube ID = 11 alphanumeric characters
    // https://stackoverflow.com/a/6250619/1397641
    // Vimeo ID = 8+ digits

    // Goal is to be 99.9% accurate


    const defaultDetails = {
        videoPassword: null,
    }


    // Check if the first 8 characters of the filename
    // are digits. If so, assume it's a Vimeo ID
    // since it's not very likely a Youtube ID will start
    // with 8 digits(but not impossible).
    const numericFirst8Chars = /^\d{8,}$/.test( filenameWithoutExtension.substring(0, 8) )
    if ( numericFirst8Chars ) {

        // May contain a password seperated by a colon
        const [ vumbnailIdentifier ] = filenameWithoutExtension.split('_')

        const [
            videoId,
            videoPassword = null,
        ] = vumbnailIdentifier.split(':')

        // console.log( 'vimeo', videoId, videoPassword )

        return {
            ...defaultDetails,
            provider: 'vimeo',
            videoId,
            videoPassword
        }
    }

    // Twitch might go here since it can be up to 25 characters
    // https://stackoverflow.com/a/60724686/1397641


    // Check if the first 11 characters of the filename
    // are alphanumeric. If so, assume it's a Youtube ID.
    const alphanumericFirst11Chars = /^[A-Za-z0-9_\-]{11}$/.test(filenameWithoutExtension.substring(0, 11))
    if ( alphanumericFirst11Chars ) {

        const videoId = filenameWithoutExtension.substring(0, 11)
        return {
            ...defaultDetails,
            provider: 'youtube',
            videoId,
        }
    }

    throw new Error(`Could not determine provider and video ID from filename: ${ filenameWithoutExtension }`)
}

function parsePathPartsFromUrl ( thumbnailPath: string ) {
    const urlPathname = (new URL( thumbnailPath, 'https://example.com' )).pathname

    // Remove any query strings
    const urlPath = urlPathname.split('?')[0]

    return path.parse( urlPath )
}

const pathOptionParsers = {
    'extension': ( thumbnailPath: string ) => {
        const { ext } = parsePathPartsFromUrl( thumbnailPath )

        // console.log('ext', ext)

        // Trim dot from extension
        const extension = ext.substring(1)

        return extension
    },

    'filename': ( thumbnailPath: string ) => {
        const { base } = parsePathPartsFromUrl( thumbnailPath )

        return base
    },

    'filenameWithoutExtension': ( thumbnailPath: string ) => {
        const { name } = parsePathPartsFromUrl( thumbnailPath )

        return name
    },

    'provider': ( thumbnailPath: string ) => {
        const {
            name: filenameWithoutExtension
        } = parsePathPartsFromUrl( thumbnailPath )

        // Handle provides
        const {
            provider,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return provider
    },

    'videoId': ( thumbnailPath: string ) => {
        const {
            name: filenameWithoutExtension
        } = parsePathPartsFromUrl( thumbnailPath )

        // Handle video IDs
        const {
            videoId,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return videoId
    },

    'videoPassword': ( thumbnailPath: string ) => {
        const {
            name: filenameWithoutExtension
        } = path.parse( thumbnailPath )

        // Handle video IDs
        const {
            videoPassword,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return videoPassword
    }
} as const

type OptionKey = keyof VideoOptions

export function parseOptionsFromPath ( thumbnailPath: string , options: {} = {} ): Partial<VideoOptions> {
    let optionsFromPath: Partial<VideoOptions> = {}

    let optionKey: OptionKey
    // Run through parsers and pull out options
    for ( optionKey in pathOptionParsers ) {
        const optionParser = pathOptionParsers[ optionKey ]

        try {
            const optionValue = optionParser(thumbnailPath)

            optionsFromPath[ optionKey ] = optionValue
        } catch ( error ) {
            // console.log(`Could not parse "${optionKey}" from path: ${thumbnailPath}`)
            // console.log(error)
        }
    }

    try {

        const {
            name: filenameWithoutExtension
        } = path.parse( thumbnailPath )

        // Get options from filename
        // Allowed url path characters (https://stackoverflow.com/a/4669755/1397641)
        // A–Z, a–z, 0–9, -, ., _, ~, !, $, &, ', ), (, *, +, ,, ;, =, :, @
        const optionsFromFilename = filenameWithoutExtension.split('_')

        for ( const option of optionsFromFilename ) {
            if ( optionKeys.includes(option) ) {
                optionsFromPath = {
                    ...optionsFromPath,
                    ...optionSets[option]
                }
            }
        }
    } catch ( error ) {
        console.log(`Could not parse options from filename: ${thumbnailPath}`)
    }

    // console.log('optionsFromFilename', optionsFromFilename)

    return optionsFromPath
}
