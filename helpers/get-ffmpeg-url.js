// import youtubedl from 'youtube-dl-exec'
import urlParser from 'js-video-url-parser'
import axios from 'axios'


const providerDefaultOptions = {
    'vimeo': {
        extension: 'mp4',
    },
    'youtube': {
        extension: 'webm'
    }
}



// https://github.com/saanuregh/youtube-dl-web/blob/master/components/entry.js#L25
function reduceFormats ( youtubeDlInfo ) {
    const targetFormat = youtubeDlInfo.format_id

    return youtubeDlInfo.formats.reduce((a, c) => {
        let x = {
          id: c.format_id,
          label: c.format,
        };
        if (youtubeDlInfo.extractor_key.toLowerCase() === "youtube") {
          const j =
            c.format.includes("audio") && c.format_id !== targetFormat.split("+")[1];
          const k =
            !c.format.includes("audio") &&
            c.ext === "webm" &&
            youtubeDlInfo.formats.filter((i) => i.format_note === c.format_note).length >= 2;
          const l = c.vcodec !== "none" && c.acodec !== "none";
          if (j || k || l) {
            return a;
          }
          if (c.vcodec !== "none" && c.acodec === "none") {
            x = {
              id: `${c.format_id}+${targetFormat.split("+")[1]}`,
              label: c.format,
            };
          }
        }
        return [...a, x];
      }, [])
}


export async function getFfmpegUrl ( options = {} ) {
    // https://github.com/Zod-/jsVideoUrlParser#readme
    const { provider } = urlParser.parse(options.videoUrl)

    // Get options for provider
    const defaultOptions = providerDefaultOptions[provider]

    const {
        videoUrl,
        extension
    } = {
        ...defaultOptions,
        ...options
    }

    const ytdlUrl = new URL(`${process.env.VERCEL_URL}/api/info?q=${ videoUrl }&f=worstvideo[ext=${ extension }]`)

    // Get the video data
    const { data: youtubeDlInfo } = await axios.get( ytdlUrl.href )
        .catch(error => {
            console.warn(`Error fetching video ${videoUrl}`, error)
        })

    // console.log('youtubeDlInfo', youtubeDlInfo)
    // console.log('url', youtubeDlInfo.url)

    return youtubeDlInfo.url
}