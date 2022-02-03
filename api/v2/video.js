// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4

import 'dotenv/config'
// URL utility
import axios from 'axios'


import { parseOptionsFromPath } from '../../helpers/url.js'
import { getClipFromVideoUrl } from '../../helpers/get-clip-from-video-url.js'


// const ffmpeg = createFFmpeg({ log: true });


async function defaultHandler ({
    req, 
    res,
    options
}) {
    const apiUrl = `https://vimeo.com/api/v2/video/${ options.videoId }.json`

    const { videoData = null, error = null } = await axios.get(apiUrl).then(response => {
        
        // console.log(videoData)
        return {
          videoData: response.data[0]
        }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    }).catch(error => {
        console.warn(`Error fetching video ${id}`, error)

        return { error }
    })
    
    
    return {
        headers: {
            // Set Cors Headers to allow all origins so data can be requested by a browser
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        sendResponse: () => {
            res.json(videoData)
        }
    }
}


export default async function (req, res) {

    // await ffmpeg.load()

    console.log('url', req.url)

    const options = parseOptionsFromPath(req.url)

    // console.log('parseOptionsFromPath', options)

    if ( options.extension === 'mp4' ) {
        console.log('Is mp4')

        // videoUrl: `https://vimeo.com/${ options.videoId }`,
        const videoUrl = `https://www.youtube.com/watch?v=${ options.videoId }`

        res.contentType = `video/${ options.extension }`

        res.setHeader(
            'Content-Disposition',
            'inline'
            // contentDisposition(`${info.title}.${audioOnly ? "mp3" : "mp4"}`)
        )

        await getClipFromVideoUrl( videoUrl, {
            res
        })

        return
    }

    res.json(options)

    return

    // Break out the id param from our request's query string
    const { query: { id, redirect = false, key = null } } = url.parse(req.url, true)
    
    const apiUrl = `https://vimeo.com/api/v2/video/${id}.json`

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    console.log(`Fetched video data from https://vimeo.com/${id}`)

    // Repond with Video JSON Data
    res.json(videoData)
}