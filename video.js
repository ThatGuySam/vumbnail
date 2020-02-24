
// URL utility
import url from 'url'

const microRedirect = require("micro-redirect")

const fbvid = require('fbvideos')

module.exports = async function (req, res) {
    // Break out the id param from our request's query string
    const { query: { id, redirect = false } } = url.parse(req.url, true)
    // const perPage = 50

    const videoUrl = `https://www.facebook.com/${id}`

    const { videoData = null, error = null } = await fbvid.high(videoUrl).then(videoData => {
        // console.log(videoData)
        return { videoData }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    }).catch(error => {
        console.warn(`Error fetching video ${id}`, error)

        return { error }
    })

    if ( redirect ) {
        // 307 - Temporary Redirect
        const statusCode = 307
        
        microRedirect(res, statusCode, videoData.url)

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

    console.log(`Fetched mp4 video from https://www.facebook.com/${id}`)

    res.json(videoData)
}
