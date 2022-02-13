// import youtubedl from 'youtube-dl-exec'
import urlParser from 'js-video-url-parser'
import axios from 'axios'

import { vercelUrl } from './url.js'


const providerDefaultOptions = {
    'vimeo': {
        extension: 'mp4',
    },
    'youtube': {
        extension: 'webm'
    }
}

const deployUrl = vercelUrl


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


function findFormat ( options = {} ) {
    const {
      extension,
      protocol = 'https',
      targetFormat = 'worstvideo',
      formats
    } = options

    let foundFormat = null
    let smallestSize = Infinity

    for ( const format of formats ) {

        // Skip different extensions
        if ( format.ext !== extension ) {
            continue
        }

        // Skip different protocols
        if ( format.protocol !== protocol ) {
            continue
        }

        if ( format.width < smallestSize ) {
            smallestSize = format.width
            foundFormat = format
        }
    }

    return foundFormat
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

    // console.log('deployUrl', deployUrl)

    const ytdlUrl = new URL(`${ deployUrl }/api/info?q=${ videoUrl }&f=worstvideo[ext=${ extension }]`)

    // console.log('ytdlUrl', ytdlUrl)

    // Get the video data
    const { data: youtubeDlInfo } = await axios.get( ytdlUrl.href )
        .catch(error => {
            console.warn(`Error fetching video ${videoUrl}`, error)
        })

    // const formats = youtubeDlInfo.formats.map( format => {
    //   delete format.url
    //   delete format.fragments
    //   delete format.manifest_url
    //   delete format.http_headers


    //   return format
    // })

    // console.log('formats', formats)

    const foundFormat = findFormat({
        extension,
        formats: youtubeDlInfo.formats,
    })

    // console.log('foundFormat', foundFormat)
    // console.log('url', youtubeDlInfo.url)

    // process.exit()

    return foundFormat.url
}