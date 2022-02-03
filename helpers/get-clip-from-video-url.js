// https://github.com/eugeneware/ffmpeg-static
import pathToFfmpeg from 'ffmpeg-static'
import { execa } from 'execa'


import { getFfmpegUrl } from './get-ffmpeg-url.js'


export async function getClipFromVideoUrl ( videoUrl, options = {} ) {

    const {
        res = null,
        extension = 'mp4',
    } = options

    const ffpemgUrl = await getFfmpegUrl({
        videoUrl,
        extension,
    })

    // Only download 5 seconds
    // https://unix.stackexchange.com/a/282413/255649
    // `ffmpeg -ss 00:00:15.00 -i "URL" -t 00:00:05.00 -c copy ./file.mp4`
    const ffmpegArgs = [ '-ss', '00:00:15.00', '-i', ffpemgUrl, '-t', '00:00:05.00' ]

    ffmpegArgs.push(
        "-c:v",
        "libx264",
        "-acodec",
        "aac",
        "-movflags",
        "frag_keyframe+empty_moov",
        "-f",
        "mp4"
    )

    ffmpegArgs.push('-')

    // Run command
    const ffmpegProcess = execa( pathToFfmpeg, ffmpegArgs )

    if ( res ) {
        // Pipe ffmpeg output to response
        ffmpegProcess.stdout.pipe(res)

        // Wait for ffmpeg to finish
        await ffmpegProcess
    }

    return {
        pipe: ffmpegProcess.stdout.pipe,
        process: ffmpegProcess
    }
}