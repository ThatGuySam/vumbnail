import 'dotenv/config'
// URL utility
import axios from 'axios'
import pathToFfmpeg from "ffmpeg-static"
import { execa } from 'execa'


import { parseOptionsFromPath } from '../../helpers/url.js'
import { getFfmpegUrl } from '../../helpers/get-ffmpeg-url.js'


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

        const ffpemgUrl = await getFfmpegUrl({
            // videoUrl: `https://vimeo.com/${ options.videoId }`,
            videoUrl: `https://www.youtube.com/watch?v=${ options.videoId }`,
            extension: 'mp4'
        })

        // Create unsecure http url
        // const ffpemgHttpUrl = ffpemgUrl.replace('https://', 'http://')

        res.contentType = `video/${ options.extension }`

        // `ffmpeg -ss 00:00:15.00 -i "${ ffpemgHttpUrl }" -t 00:00:05.00 -c copy ./${ Date.now() }.mp4`
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

        // console.log('stdout', stdout)


        // res.setHeader(
        //     "Content-Disposition",
        //     contentDisposition(`${info.title}.${audioOnly ? "mp3" : "mp4"}`)
        // )

        ffmpegArgs.push('-')

        // Run command
        const ffSp = execa(pathToFfmpeg, ffmpegArgs)

        // Pipe ffmpeg output to response
        ffSp.stdout.pipe(res)

        // Wait for ffmpeg to finish
        await ffSp



        // res.json({
        //     ffpemgUrl
        // })

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