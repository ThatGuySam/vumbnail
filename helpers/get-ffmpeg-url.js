import youtubedl from 'youtube-dl-exec'


export async function getFfmpegUrl ( options = {} ) {
    const {
        videoUrl,
        extension = 'webm',
    } = options

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