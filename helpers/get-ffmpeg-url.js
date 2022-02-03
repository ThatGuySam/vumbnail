import youtubedl from 'youtube-dl-exec'
import urlParser from 'js-video-url-parser'


const providerDefaultOptions = {
    'vimeo': {
        extension: 'mp4',
    },
    'youtube': {
        extension: 'webm'
    }
}


export async function getFfmpegUrl ( options = {} ) {
    // https://github.com/Zod-/jsVideoUrlParser#readme
    const { provider } = urlParser.parse(options.videoUrl)

    const defaultOptions = providerDefaultOptions[provider]

    const {
        videoUrl,
        extension
    } = {
        ...defaultOptions,
        ...options
    }

    const output = await youtubedl( videoUrl , {
        getUrl: true,
        // https://askubuntu.com/questions/486297/how-to-select-video-quality-from-youtube-dl
        format: `worstvideo[ext=${ extension }]`,
        // dumpSingleJson: true,
        // noWarnings: true,
        // noCallHome: true,
        // noCheckCertificate: true,
        // preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        // referer: 'https://example.com'
    })
    .catch(error => {
        console.warn(`Error fetching video ${videoUrl}`, error)
    })

    // console.log( 'output', output )

    return output
}