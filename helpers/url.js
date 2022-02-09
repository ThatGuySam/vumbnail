// import url from 'url'
import path from 'path'


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
    'medium': {
        size: 'medium',
    }
}

const optionKeys = Object.keys(optionSets)



function getProviderAndIdFromFilename ( filename ) {
    // Assumptions
    // Youtube ID = 11 alphanumeric characters
    // https://stackoverflow.com/a/6250619/1397641
    // Vimeo ID = 8+ digits
    
    // Goal is to be 99.9% accurate

    // Stripe out extension
    const extension = path.extname(filename)
    const filenameWithoutExtension = filename.replace(extension, '')

    // Check if the first 8 characters of the filename
    // are digits. If so, assume it's a Vimeo ID
    // since it's not very likely a Youtube ID will start
    if ( /^\d{8,}$/.test(filenameWithoutExtension.substring(0, 8)) ) {
    // with 8 digits(but not impossible). 

        const [ videoId ] = filenameWithoutExtension.split('_')
        return {
            provider: 'vimeo',
            videoId
        }
    }

    // Twitch might go here since it can be up to 25 characters
    // https://stackoverflow.com/a/60724686/1397641


    // Check if the first 11 characters of the filename
    // are alphanumeric. If so, assume it's a Youtube ID.
    if ( /^[A-Za-z0-9_\-]{11}$/.test(filenameWithoutExtension.substring(0, 11)) ) {
            
        const videoId = filenameWithoutExtension.substring(0, 11)
        return {
            provider: 'youtube',
            videoId
        }
    }

    throw new Error(`Could not determine provider and video ID from filename: ${filename}`)
}


export function parseOptionsFromPath ( thumbnailPath ) {
    let optionsFromPath = {}

    // https://stackoverflow.com/a/31615711/1397641
    const {
        name: filenameWithoutExtension,
        ext,
        base: filename,
    } = path.parse( thumbnailPath )

    // Trim dot from extension
    const extension = ext.substring(1)

    // Get options from filename
    // Allowed url path characters (https://stackoverflow.com/a/4669755/1397641)
    // A–Z, a–z, 0–9, -, ., _, ~, !, $, &, ', ), (, *, +, ,, ;, =, :, @
    const optionsFromFilename = filenameWithoutExtension.split('_')

    // Handle video IDs
    const {
        provider,
        videoId,
    } = getProviderAndIdFromFilename(filename)

    for ( const option of optionsFromFilename ) {
        if ( optionKeys.includes(option) ) {
            optionsFromPath = {
                ...optionsFromPath,
                ...optionSets[option]
            }
        }
    }

    // console.log('optionsFromFilename', optionsFromFilename)

    return {
        videoId,
        extension,
        filename,
        provider,
        ...optionsFromPath,
    }
}