
// URL utility
import { urlParse } from 'https://deno.land/x/url_parse/mod.ts'
import axiod from 'https://deno.land/x/axiod/mod.ts'

// const microRedirect = require("micro-redirect")

// const fbvid = require('fbvideos')


// 307 - Temporary Redirect
const tempRedirectCode = 307


export default async function (req, res) {
    const serverRequestUrl = new URL(req.url)
    console.log('serverRequestUrl', serverRequestUrl)
    // Break out the id param from our request's query string
    const { query: { id, redirect = false, key = null } } = urlParse(req.url, true)
    // const perPage = 50

    // const videoUrl = `https://www.facebook.com/${id}`
    
    const apiUrl = "https://vimeo.com/api/v2/video/" + id + ".json"

    const { videoData = null, error = null } = await axiod.get(apiUrl).then(response => {
        
        // console.log(videoData)
        return {
          videoData: response.data[0]
        }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    }).catch(error => {
        console.warn(`Error fetching video ${id}`, error)

        return { error }
    })
    
    // if there's no video data the stop
    if (videoData === null) return
    
    
    
    if (key) {
        const thumbResponse = await axiod.get(videoData[key], {
            responseType: 'stream'
        })
        
        // Set a header for jpg
        res.setHeader('Content-Type', 'image/jpeg')
            
        thumbResponse.data.pipe(res)
        
        // microRedirect(res, tempRedirectCode, videoData[key])
        return
    }
    

    if ( redirect ) {
        
        req.respond({
            status: tempRedirectCode,
            headers: new Headers({
              'Location': videoData.url
            })
        })
        
        // microRedirect(res, tempRedirectCode, videoData.url)

        return
    }

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    // Send an error response if something went wrong
    if (error !== null) {
        res.json({
            error: 'Error fetching'
        })
        
        // Fire 
        return
    }

    console.log(`Fetched video data from https://vimeo.com/${id}`)

    // res.json(videoData)
    req.respond({ body: videoData })
}
