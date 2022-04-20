import axios from 'axios'
import has from 'just-has'


const youtubeDefaultSize = 'hqdefault'

const vimeoDefaultSize = 'thumbnail_large'


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

// Example: https://player.vimeo.com/video/358629078/config
async function getVimeoThumbnailFromEmbedConfig ( videoId ) {
    const videoJsonUrl = `https://player.vimeo.com/video/${ videoId }/config`

    // Fetch thumbnail url from vimeo
    const {
        video: {
            thumbs: {
                base
            }
        }
    } = await axios.get( videoJsonUrl )
        .then( response => response.data )
        .catch( error => {
            console.error(`Error fetching thumbnail url from vimeo: ${ error }`)
        })

    // console.log('base', base)

    return base + '_640'
}

async function getVimeoThumbnailFromOembed ( videoId, videoPassword = null ) {
    let videoJsonUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${ videoId }`

    if ( videoPassword !== null ) {
        videoJsonUrl += `/${ videoPassword }`
    }

    // Fetch thumbnail url from vimeo
    const {
        data: { thumbnail_url }
    } = await axios.get( videoJsonUrl )
        .catch( error => {
            console.error(`Error fetching thumbnail url from vimeo: ${ error }`)
        })

    return thumbnail_url
}

async function tryThumbnailUrlMethods ( options = {} ) {
    const {
        methods,
        videoId,
    } = options

    for ( const method of methods ) {
        let thumbnailUrl

        try {
            thumbnailUrl = await method( videoId )
        } catch ( error ) {
            console.log(`Thumbnails method ${ method.name } failed. Trying next method.`)
            continue
        }

        // Skip if type is not string
        if ( typeof thumbnailUrl !== 'string' ) {
            continue
        }

        // Skip if url is empty
        if ( thumbnailUrl.length === 0 ) {
            continue
        }

        return thumbnailUrl
    }

    return null
}

export async function getInputImageDetails ( options = {} ) {

    const {
        videoId,
        videoPassword,
        provider,
        targetSizeKey = vimeoDefaultSize,
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
            inputUrl = await getVimeoThumbnailFromOembed( videoId, videoPassword )
        } else {
            inputUrl = await tryThumbnailUrlMethods({
                methods: [
                    getPublicVimeoThumbnail,
                    getVimeoThumbnailFromOembed,
                    getVimeoThumbnailFromEmbedConfig,
                    // Maybe a YoutubeDL method?
                ],
                videoId
            })
        }

        // console.log( 'inputUrl', inputUrl, targetSizeKey, size, options )

        // Vimeo can convert to any size
        // by just updating the url
        const separator = '_'
        const newSize = `${ size.width }x${ size.height }`

        const lastIndexOfUnderscore = inputUrl.lastIndexOf( separator )
        const inputUrlPrefix = inputUrl.substr(0, lastIndexOfUnderscore)

        inputUrl = ([
            inputUrlPrefix,
            newSize
        ]).join( separator )

        extension = 'jpg'
    }


    if ( provider === 'youtube' ) {
        const youtubeSizeKey = has( youtubeThumbnailSizes, [ targetSizeKey ]) ? targetSizeKey : youtubeDefaultSize
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
        targetSizeKey,
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
