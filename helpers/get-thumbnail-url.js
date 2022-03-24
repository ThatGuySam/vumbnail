import axios from 'axios'
import has from 'just-has'


const providerDefaultOptions = {
    'vimeo': {
        extension: 'jpg',
    },
    'youtube': {
        extension: 'jpg'
    }
}

// const deployUrl = vercelUrl


// https://stackoverflow.com/a/20542029/1397641
const youtubeThumbnailSizes = {

    // Default size
    'mqdefault': {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    'default': {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    'hqdefault': {
        width: 480,
        height: 360,
        pathOptionName: true,
    },

    'maxresdefault': {
        width: 1280,
        height: 720,
        pathOptionName: true,
    },

    '0': {
        width: 480,
        height: 360,
        pathOptionName: false,
    },

    '1': {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    '2': {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    '3': {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    'mq1': {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    'mq2': {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    'mq3': {
        width: 320,
        height: 180,
        pathOptionName: true,
    }, 

    // May or may not be available

    // 'sddefault': {
    //     width: 640,
    //     height: 480
    // },

    // 'hq720': {
    //     width: 1280,
    //     height: 720
    // },

    // 'maxresdefault': {
    //     width: 1920,
    //     height: 1080
    // },
}

const vimeoThumbnailSizes = {

    // Default size
    'thumbnail_large': {
        width: 640,
        height: 360,
        pathOptionName: 'large',
    },

    'thumbnail_medium': {
        width: 200,
        height: 150,
        pathOptionName: 'medium',
    },

    'thumbnail_small': {
        width: 100,
        height: 75,
        pathOptionName: 'small',
    },

}

export const allSizes = {
    ...youtubeThumbnailSizes,
    ...vimeoThumbnailSizes
}


async function getPublicVimeoThumbnail ( videoId ) {
    const videoJsonUrl = `https://vimeo.com/api/v2/video/${ videoId }.json`

    // Fetch thumbnail url from vimeo
    const {
        data: [ videoInfo ]
    } = await axios.get( videoJsonUrl )
        .catch( error => {
            console.error(`Error fetching thumbnail url from vimeo: ${ error }`)
        })

    // console.log('thumbnail_large', thumbnail_large)

    const smallThumbnail = videoInfo.thumbnail_small

    return smallThumbnail
}

async function getPrivateVimeoThumbnail ( videoId, videoPassword ) {
    const videoJsonUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${ videoId }/${ videoPassword }`

    // Fetch thumbnail url from vimeo
    const {
        data: { thumbnail_url }
    } = await axios.get( videoJsonUrl )
        .catch( error => {
            console.error(`Error fetching thumbnail url from vimeo: ${ error }`)
        })

    return thumbnail_url
}

export async function getInputImageDetails ( options = {} ) {

    const {
        videoId, 
        videoPassword,
        provider, 
        targetSizeKey, 
        targetExtension = 'jpg',
    } = options
    
    
    let inputUrl
    let size
    let extension

    // Get thumbnail url
    if ( provider === 'vimeo' ) {
        // Get size details

        size = allSizes[ targetSizeKey ]

        // console.log('options', options)

        // Check that size is valid
        if ( !size ) {
            throw new Error(`Invalid size: ${ targetSizeKey }`)
        }

        if ( !!videoPassword ) {
            inputUrl = await getPrivateVimeoThumbnail( videoId, videoPassword )
        } else {
            inputUrl = await getPublicVimeoThumbnail( videoId )
        }

        // console.log( 'inputUrl', inputUrl, targetSizeKey, size, options )

        // Vimeo can convert to any size
        // by just updating the url
        const inputUrlPrefix = inputUrl.split('-d_')[0]
        inputUrl = ([
            inputUrlPrefix, 
            `${ size.width }x${ size.height }`
        ]).join('-d_')

        console.log('inputUrl', inputUrl)
        
        extension = 'jpg'
    }


    if ( provider === 'youtube' ) {
        const youtubeSizeKey = has( youtubeThumbnailSizes, [ targetSizeKey ]) ? targetSizeKey : 'mqdefault'
        size = youtubeThumbnailSizes[ youtubeSizeKey ]

        // Webp url
        // `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.${extension}`
        // extension = 'webm'

        inputUrl = `https://i.ytimg.com/vi/${ videoId }/${ youtubeSizeKey }.jpg`
        extension = 'jpg'
    }

    

    return {
        inputUrl, 
        size, 
        extension, 
    }
}



export async function getOutputImage ( options = {} ) {

    // Get options for provider
    const defaultOptions = providerDefaultOptions[ options.provider ]

    const {
        videoId,
        // extension = 'jpg',
        provider,
        targetSizeKey = 'mqdefault',
    } = {
        ...defaultOptions,
        ...options
    }
    
    const {
        inputUrl,
        size,
        // extension,
    } = await getInputImageDetails({
        ...options,

        videoId,
        provider,
        targetSizeKey,
        // targetExtension: extension,
    })


    // Resize and convert images here

    
    return {
        url: inputUrl,
        size,
        // extension,
    }
}



function mapAllSizesToOptions ( allSizes ) {
    const sizeOptions = {}

    for ( const [ key, sizeDetails ] of Object.entries( allSizes ) ) {
        // console.log('sizeDetails', key, sizeDetails)

        // Skip falsy pathOptionNames
        if ( !sizeDetails.pathOptionName ) {
            continue
        }

        const optionName = sizeDetails.pathOptionName === true ? key : sizeDetails.pathOptionName

        sizeOptions[ optionName ] = {
            ...sizeDetails,
            key,
        }
    }

    return sizeOptions
}


export const sizeOptions = mapAllSizesToOptions( allSizes )

// console.log('sizeOptions', sizeOptions)