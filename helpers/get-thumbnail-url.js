import axios from 'axios'


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

    'mqdefault': {
        width: 320,
        height: 180,
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
    }

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
    'thumbnail_small': {
        width: 100,
        height: 75,
        pathOptionName: 'small',
    },

    'thumbnail_medium': {
        width: 200,
        height: 150,
        pathOptionName: 'medium',
    },

    'thumbnail_large': {
        width: 640,
        height: 360,
        pathOptionName: 'large',
    },
}

const allSizes = {
    ...youtubeThumbnailSizes,
    ...vimeoThumbnailSizes
}






export async function getThumbnailUrl ( options = {} ) {

    // Get options for provider
    const defaultOptions = providerDefaultOptions[ options.provider ]

    const {
        videoId,
        extension = 'jpg',
        provider,
        quality = null
    } = {
        ...defaultOptions,
        ...options
    }

    // Get thumbnail url
    if ( provider === 'vimeo' ) {
        const videoJsonUrl = `https://vimeo.com/api/v2/video/${ videoId }.json`
        const vimeoQuality = quality || 'thumbnail_large'

        // Fetch thumbnail url from vimeo
        const {
            data: [ videoInfo ]
        } = await axios.get( videoJsonUrl )
          .catch( error => {
              console.error(`Error fetching thumbnail url from vimeo: ${ error }`)
          })

        // console.log('thumbnail_large', thumbnail_large)

        const smallThumbnail = videoInfo.thumbnail_small

        const sizeDetails = allSizes[ vimeoQuality ]

        const thumbnailUrl = smallThumbnail.replace('100x75', `${ sizeDetails.width }x${ sizeDetails.height }`)

        return thumbnailUrl
    }

    if ( provider === 'youtube' ) {
        const youtubeQuality = quality || 'mqdefault'

        // Webp url
        // `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.${extension}`

        return `https://i.ytimg.com/vi/${ videoId }/${ youtubeQuality }.${ extension }`
    }

        

    throw new Error(`Provider not supported yet: ${provider}`)
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