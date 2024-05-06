import type { AxiosResponse } from 'axios'
import axios from 'axios'
import has from 'just-has'
import type { Entries, IsStringLiteral } from 'type-fest'

import type { ImageExtension, MediaExtension, VideoId } from '../src/types.js'

const youtubeDefaultSize = 'hqdefault'

const vimeoDefaultSize = 'thumbnail_large'

const providerDefaultOptions = {
    vimeo: {
        extension: 'jpg',
    },
    youtube: {
        extension: 'jpg',
    },
}

// const deployUrl = vercelUrl

interface ThumbnailSize {
    width: number
    height: number
    pathOptionName: string | boolean
}

type ThumbnailSizes = Record<string, ThumbnailSize>

// https://stackoverflow.com/a/20542029/1397641
const youtubeThumbnailSizes = {

    // Default size
    mqdefault: {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    default: {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    hqdefault: {
        width: 480,
        height: 360,
        pathOptionName: true,
    },

    maxresdefault: {
        width: 1280,
        height: 720,
        pathOptionName: true,
    },

    0: {
        width: 480,
        height: 360,
        pathOptionName: false,
    },

    1: {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    2: {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    3: {
        width: 120,
        height: 90,
        pathOptionName: false,
    },

    mq1: {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    mq2: {
        width: 320,
        height: 180,
        pathOptionName: true,
    },

    mq3: {
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
} as const satisfies ThumbnailSizes

const vimeoThumbnailSizes = {

    // Default size
    thumbnail_large: {
        width: 640,
        height: 360,
        pathOptionName: 'large',
    },

    thumbnail_medium: {
        width: 200,
        height: 150,
        pathOptionName: 'medium',
    },

    thumbnail_small: {
        width: 100,
        height: 75,
        pathOptionName: 'small',
    },

} as const satisfies ThumbnailSizes

export const baseSizes = {
    ...youtubeThumbnailSizes,
    ...vimeoThumbnailSizes,
} satisfies ThumbnailSizes

type OnlyStrings<T> = T extends string ? T : never

type BaseSizes = typeof baseSizes
type BaseSizeKey = keyof BaseSizes
type PathKey = OnlyStrings<BaseSizes[BaseSizeKey]['pathOptionName']>
type SizeKey = BaseSizeKey | PathKey
type SizeOption = BaseSizes[BaseSizeKey]

const allSizeEntries = Object.entries( baseSizes ) as Entries<BaseSizes>

const pathKeys = Object.values( baseSizes )
    .filter( ( { pathOptionName } ) => typeof pathOptionName === 'string' )
    .map( ( { pathOptionName } ) => pathOptionName ) as PathKey[]

const baseKeys = Object.keys( baseSizes ) as BaseSizeKey[]

export const sizeKeys = [
    ...baseKeys,
    ...pathKeys,
]

function getSizeForPathKey ( key: PathKey ): BaseSizeKey {
    for ( const [ sizeKey, { pathOptionName } ] of allSizeEntries ) {
        if ( pathOptionName === key ) {
            return sizeKey
        }
    }

    throw new Error( `No size option found for path: ${ key }` )
}

function isPathKey ( key: BaseSizeKey | PathKey ): key is PathKey {
    return Object.prototype.hasOwnProperty.call( baseSizes, key ) === false
}

function getSizeForKey ( key: BaseSizeKey | PathKey ): SizeOption {
    const isAllKey = !isPathKey( key )
    if ( isAllKey ) {
        return baseSizes[ key ]
    }

    return baseSizes[ getSizeForPathKey( key ) ]
}

/**
 * Remove any known _option segments from a given filename
 * @param filename
 * @returns Filename without options
 */
export function removeFilenameOptions ( filename: string ) {
    // Return early if we can't find any underscores
    if ( !filename.includes( '_' ) ) {
        return filename
    }

    for ( const sizeKey of sizeKeys ) {
        // Break if we can't find any more underscores
        if ( !filename.includes( '_' ) ) {
            break
        }

        // Skip if the key is not in the filename
        const segment = `_${ sizeKey }`

        if ( !filename.includes( segment ) ) {
            continue
        }

        // Remove the size option from the filename
        filename = filename.replace( segment, '' )
    }

    return filename
}

interface VimeoThumbnailEntry {
    thumbnail_small: string
}

async function getPublicVimeoThumbnail ( videoId: VideoId ) {
    const videoJsonUrl = `https://vimeo.com/api/v2/video/${ videoId }.json`

    // Fetch thumbnail url from vimeo
    const {
        data: [ videoInfo ],
    } = await axios.get<any, AxiosResponse<VimeoThumbnailEntry[]>>( videoJsonUrl )
        .catch( ( error ) => {
            console.error( `Error fetching thumbnail url from vimeo: ${ error }` )
            throw error
        } )

    // console.log('thumbnail_large', thumbnail_large)

    const smallThumbnail = videoInfo.thumbnail_small

    return smallThumbnail
}

// Example: https://player.vimeo.com/video/358629078/config
async function getVimeoThumbnailFromEmbedConfig ( videoId: VideoId ) {
    const videoJsonUrl = `https://player.vimeo.com/video/${ videoId }/config`

    // Fetch thumbnail url from vimeo
    const {
        video: {
            thumbs: {
                base,
            },
        },
    } = await axios.get( videoJsonUrl )
        .then( response => response.data )
        .catch( ( error ) => {
            console.error( `Error fetching thumbnail url from vimeo: ${ error }` )
            throw error
        } )

    // console.log('base', base)

    return `${ base }_640`
}

interface VimeoOembedResponse {
    thumbnail_url: string
}

async function getVimeoThumbnailFromOembed ( videoId: VideoId, videoPassword?: string ) {
    let videoJsonUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${ videoId }`

    if ( videoPassword && videoPassword.length > 0 ) {
        videoJsonUrl += `/${ videoPassword }`
    }

    // Fetch thumbnail url from vimeo
    const {
        data: { thumbnail_url },
    } = await axios.get<any, AxiosResponse<VimeoOembedResponse>>( videoJsonUrl )
        .catch( ( error ) => {
            console.error( `Error fetching thumbnail url from vimeo: ${ error }` )
            throw error
        } )

    return thumbnail_url
}

async function tryThumbnailUrlMethods ( options: {
    methods: ( ( videoId: VideoId ) => Promise<string> )[]
    videoId: VideoId
} ) {
    const {
        methods,
        videoId,
    } = options

    for ( const method of methods ) {
        let thumbnailUrl

        try {
            thumbnailUrl = await method( videoId )
        }
        catch ( error ) {
            console.error( `Thumbnails method ${ method.name } failed. Trying next method.` )
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

export async function getInputImageDetails ( options: {
    videoId: VideoId
    videoPassword?: string
    provider: 'vimeo' | 'youtube'
    targetSizeKey?: SizeKey
} ) {
    const {
        videoId,
        videoPassword,
        provider,
        targetSizeKey = vimeoDefaultSize,
    } = options

    let inputUrl: string | null
    let size: SizeOption
    let extension: MediaExtension

    // Get thumbnail url
    if ( provider === 'vimeo' ) {
        // Get size details

        size = getSizeForKey( targetSizeKey )

        // console.log('options', options)

        // Check that size is valid
        if ( !size ) {
            throw new Error( `Invalid size: ${ targetSizeKey }` )
        }

        if ( videoPassword ) {
            inputUrl = await getVimeoThumbnailFromOembed( videoId, videoPassword )
        }
        else {
            inputUrl = await tryThumbnailUrlMethods( {
                methods: [
                    getPublicVimeoThumbnail,
                    getVimeoThumbnailFromOembed,
                    getVimeoThumbnailFromEmbedConfig,
                    // Maybe a YoutubeDL method?
                ],
                videoId,
            } )
        }

        if ( !inputUrl ) {
            throw new Error( `Could not get thumbnail URL for vimeo video: ${ videoId }` )
        }

        // console.log( 'inputUrl', inputUrl, targetSizeKey, size, options )

        // Vimeo can convert to any size
        // by just updating the url
        const separator = '_'
        const newSize = `${ size.width }x${ size.height }`

        const lastIndexOfUnderscore = inputUrl.lastIndexOf( separator )
        const inputUrlPrefix = inputUrl.substr( 0, lastIndexOfUnderscore )

        inputUrl = ( [
            inputUrlPrefix,
            newSize,
        ] ).join( separator )

        extension = 'jpg'

        return {
            inputUrl,
            size,
            extension,
        }
    }

    if ( provider === 'youtube' ) {
        const youtubeSizeKey = has( youtubeThumbnailSizes, [ targetSizeKey ] ) ? targetSizeKey : youtubeDefaultSize
        size = getSizeForKey( youtubeSizeKey )

        // Webp url
        // `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.${extension}`
        // extension = 'webm'

        inputUrl = `https://i.ytimg.com/vi/${ videoId }/${ youtubeSizeKey }.jpg`
        extension = 'jpg'

        return {
            inputUrl,
            size,
            extension,
        }
    }

    throw new Error( 'Unsupported provider' )
}

export async function getOutputImage ( options: {
    videoId: VideoId
    provider: 'vimeo' | 'youtube'
    extension?: ImageExtension
    targetSizeKey?: SizeKey
} ) {
    // Get options for provider
    const defaultOptions = providerDefaultOptions[ options.provider ]

    const {
        videoId,
        // extension = 'jpg',
        provider,
        targetSizeKey,
    } = {
        ...defaultOptions,
        ...options,
    }

    const {
        inputUrl,
        size,
        // extension,
    } = await getInputImageDetails( {
        ...options,

        videoId,
        provider,
        targetSizeKey,
    } )

    // Resize and convert images here

    return {
        url: inputUrl,
        size,
        // extension,
    }
}

type SizeOptionWithKey = SizeOption & {
    key: SizeKey
}

function mapBaseSizesToOptions ( baseSizes: BaseSizes ) {
    const sizeOptions = {} as Record<SizeKey, SizeOptionWithKey>

    const sizeEntries = Object.entries( baseSizes ) as Entries<BaseSizes>

    for ( const [ key, sizeDetails ] of sizeEntries ) {
        // console.log('sizeDetails', key, sizeDetails)

        // Skip falsy pathOptionNames
        if ( !sizeDetails.pathOptionName ) {
            continue
        }

        const shouldUseKeyAsPathOption = sizeDetails.pathOptionName === true
        const optionName = shouldUseKeyAsPathOption
            ? key
            : sizeDetails.pathOptionName

        sizeOptions[ optionName ] = {
            ...sizeDetails,
            key,
        }
    }

    return sizeOptions
}

export const sizeOptions = mapBaseSizesToOptions( baseSizes )

// console.log('sizeOptions', sizeOptions)
