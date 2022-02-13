import axios from 'axios'

import { vercelUrl } from './url.js'


const ONE_HOUR = 60 * 60
const ONE_DAY = ONE_HOUR * 24
const ONE_WEEK = ONE_DAY * 7
const ONE_MONTH = ONE_DAY * 30
const ONE_YEAR = ONE_DAY * 365

// We want to keep error caching time low
// so we get the newest data from the API
// max-age === Browser Cache
// s-maxage === Cloudflare Cache
// Cache Control Header Examples - https://developers.cloudflare.com/cache/about/cache-control#examples
export const errorCacheHeaders = {
    'Cache-Control': `public, max-age=0, s-maxage=${ ONE_HOUR }`,
}



export const successCacheHeaders = {
    'Cache-Control': `public, max-age=${ ONE_DAY }, s-maxage=${ ONE_YEAR }`,
}



export const svgTemplate = () => `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 80 45" 
        stroke="rgba(255,255,255,0.1)"
    >
        <rect width="100%" height="100%" fill="black" />
        <path 
            transform="translate(28, 10.5)"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
        />
    </svg>
`

const defaultWidth = 640
const defaultHeight = 360

export const errorMedia = {
    svg: {
        path: './public/media/error.svg',
        width: defaultWidth,
        height: defaultHeight,
        mimeType: 'image/svg+xml',
    },
    png: {
        path: './public/media/error.png',
        width: defaultWidth,
        height: defaultHeight,
        mimeType: 'image/png',
    },
    jpg: {
        path: './public/media/error.png',
        width: defaultWidth,
        height: defaultHeight,
        mimeType: 'image/png',
    },
    mp4: {
        path: './public/media/error.mp4',
        width: defaultWidth,
        height: defaultHeight,
        mimeType: 'video/mp4',
    }
    // TODO: Webm
}


export const errorUrls = Object.fromEntries(Object.entries( errorMedia ).map( ([key, fileDetails]) => {
    const urlPath = fileDetails.path.replace('./public', '')
    
    return [
        key,
        {
            ...fileDetails,
            url: `${ vercelUrl }${ urlPath }`
        }
    ]
}))


export async function sendErrorResponseMedia(options = {}) {
    const {
        // req,
        res,
        responseType = 'stream',
        type,
        error,
    } = options

    // console.log('type', type)

    const {
        url,
        mimeType
    } = errorUrls[type]


    console.log('Streaming media error: ', type, error)

    // res.statusCode = 200

    // Set Content-Type header
    res.contentType = mimeType

    // Set Caching Headers
    for ( const [key, value] of Object.entries(errorCacheHeaders) ) {
        res.setHeader(key, value)
    }


    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#syntax
    res.setHeader(
        'Content-Disposition',
        `inline; filename="error.${ type }"`
        // contentDisposition(`${info.title}.${audioOnly ? "mp3" : "mp4"}`)
    )

    const thumbResponse = await axios.get( url, {
        responseType
    })
    
    thumbResponse.data.pipe(res)

    // Stop function
    return
}




export async function sendSuccessResponseMedia(options = {}) {
    const {
        // req,
        res,
        extension,
        videoFileStream
    } = options

    const headers = {
        ...successCacheHeaders,
        'Content-Disposition': `inline; filename="video.${ extension }"`,
        'Content-Type': `video/${ extension }`
    }

    // Set Headers
    for ( const [key, value] of Object.entries( headers ) ) {
        res.setHeader(key, value)
    }

    videoFileStream.pipe(res)

    // Stop function
    return
}