import ytdl from 'ytdl-core'


export async function getFfmpegUrl ( options = {} ) {
    const {
        videoUrl,
        extension = 'webm',
    } = options

    const videoId = ytdl.getURLVideoID(videoUrl)

    const info = await ytdl.getInfo( videoId )
    const format = ytdl.chooseFormat(info.formats, {
        quality: 'lowestvideo',
        filter: format => {
            // console.log('format', format)
            return format.container === extension
        }
    })

    // console.log( 'format.url', format.url )

    return format.url
}