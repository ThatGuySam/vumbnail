// import url from 'url'
import path from 'path'

import { sizeOptions } from './get-thumbnail-url.js'
import mapValues from 'just-map-values'


// https://stackoverflow.com/a/66011585/1397641
export const vercelUrl = process.env.VERCEL_BETA_URL || `https://${process.env.VERCEL_URL}`

export function isValidUrl ( url ) {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

export const optionSets = {
    ...mapValues( sizeOptions, ( value ) => ({ targetSizeKey: value.key }) ),
}

const optionKeys = Object.keys(optionSets)



function getProviderAndIdFromFilename ( filenameWithoutExtension ) {
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
    if ( /^[A-Za-z0-9_\-]{11}$/.test(filenameWithoutExtension.substring(0, 11)) ) {
            
        const videoId = filenameWithoutExtension.substring(0, 11)
        return {
            ...defaultDetails, 
            provider: 'youtube',
            videoId,
        }
    }

    throw new Error(`Could not determine provider and video ID from filename: ${filename}`)
}


const pathOptionParsers = {
    'extension': thumbnailPath => {
        const { ext } = path.parse( thumbnailPath )

        // console.log('ext', ext)

        // Trim dot from extension
        const extension = ext.substring(1)

        return extension
    },

    'filename': thumbnailPath => {
        const { base } = path.parse( thumbnailPath )

        return base
    },

    'filenameWithoutExtension': thumbnailPath => {
        const { name } = path.parse( thumbnailPath )

        return name
    },

    'provider': thumbnailPath => {
        const { 
            name: filenameWithoutExtension
        } = path.parse( thumbnailPath )

        // Handle provides
        const {
            provider,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return provider
    },

    'videoId': thumbnailPath => {
        const { 
            name: filenameWithoutExtension
        } = path.parse( thumbnailPath )

        // Handle video IDs
        const {
            videoId,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return videoId
    },

    'videoPassword': thumbnailPath => {
        const { 
            name: filenameWithoutExtension
        } = path.parse( thumbnailPath )

        // Handle video IDs
        const {
            videoPassword,
        } = getProviderAndIdFromFilename( filenameWithoutExtension )

        return videoPassword
    }
}


export function parseOptionsFromPath ( thumbnailPath ) {
    let optionsFromPath = {}


    // Run through parsers and pull out options
    for ( const optionKey in pathOptionParsers ) {
        const optionParser = pathOptionParsers[optionKey]

        // console.log(`Parsing option ${optionKey} from path: ${thumbnailPath}`)

        try {
            const optionValue = optionParser(thumbnailPath)

            optionsFromPath[optionKey] = optionValue
        } catch ( error ) {
            // console.log(`Could not parsse "${optionKey}" from path: ${thumbnailPath}`)
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