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
    const optionsFromFilename = filenameWithoutExtension.split('_')

    // TODO: Handle video IDs with underscores in them
    const videoId = optionsFromFilename[0]

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
        ...optionsFromPath,
    }
}