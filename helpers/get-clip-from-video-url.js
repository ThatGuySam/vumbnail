import { getFfmpegUrl } from './get-ffmpeg-url.js'
import { performance } from './performance.js'

function makeVideoUrlFromId ( videoId, provider ) {

    if ( provider === 'youtube' ) {
        return `https://${ provider }.com/watch?v=${ videoId }`
    }

    if ( provider === 'vimeo' ) {
        return `https://${ provider }.com/${ videoId }`
    }


    throw new Error(`Unknown url provider ${ provider }`)
}


export async function getClipFromVideoId ( videoId, options = {} ) {
    const {
        provider
    } = options

    const videoUrl = makeVideoUrlFromId( videoId, provider )

    // console.log('videoUrl', videoUrl)

    return await getClipFromVideoUrl( videoUrl, options )
}


export async function getClipFromVideoUrl ( videoUrl, options = {} ) {

    const {
        res = null,
        extension = 'mp4',
    } = options

    const urlFetchMarkerName = 'url-fetch'
    performance.mark( urlFetchMarkerName )

    const ffmpegUrl = await getFfmpegUrl({
        videoUrl,
        extension,
    })

    performance.measure( 'URL Fetch time', urlFetchMarkerName )
    

    // // Process MPD manifest (dash)
    // // An FFmpeg Solution: https://video.stackexchange.com/a/25389
    // // Youtube-dl MPD Handling: https://github.com/ytdl-org/youtube-dl/blob/1980ff4550a3f040fbc1e054d6b91013e9d8cb96/youtube_dl/extractor/common.py#L2074
    // // Vimeo Handling: https://github.com/ytdl-org/youtube-dl/blob/1980ff4550a3f040fbc1e054d6b91013e9d8cb96/youtube_dl/extractor/vimeo.py
    // if ( ffmpegUrl.includes('mpd') ) {
    // }

    // Only download 5 seconds
    // https://unix.stackexchange.com/a/282413/255649
    // `ffmpeg -ss 00:00:15.00 -i "URL" -t 00:00:05.00 -c copy ./file.mp4`
    // https://ffmpeg.org/ffmpeg.html
    const ffmpegArgs = [ 

        // Set read to start at 15 seconds
        '-ss', 
            '00:00:15.00', 

        // Set input
        '-i', 
            ffmpegUrl, 

        // Filter out audio
        '-an',

        // Set read duration to 5 seconds
        '-t', 
            '00:00:05.00',

        // Video Codec
        '-codec:v',
            'libx264',

        // https://trac.ffmpeg.org/wiki/Encode/H.264
        // '-preset', 
        //     'ultrafast', 

        // Audio Codec
        // '-acodec',
            // 'aac',

        '-movflags',
            'frag_keyframe+empty_moov',

        // Set format
        '-f',
            extension,
        '-'
    ]


    const ffmpegMarkerName = 'ffmpeg-process'
    performance.mark( ffmpegMarkerName )

    performance.measure( 'FFmpeg time', ffmpegMarkerName )

    return {
        fileStream: null,
        videoProcess: null
    }

    // // Run command
    // const ffmpegProcess = execa( pathToFfmpeg, ffmpegArgs )

    // // On pipe end 
    // ffmpegProcess.stdout.on( 'end', () => {
    //     // console.log('ffmpegProcess.stdout.on( \'end\' )')
    //     performance.measure( 'FFmpeg time', ffmpegMarkerName )
    // })

    // return {
    //     fileStream: ffmpegProcess.stdout,
    //     videoProcess: ffmpegProcess
    // }
}