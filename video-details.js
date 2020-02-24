
// URL utility
import url from 'url'

const got = require('got')

const microRedirect = require("micro-redirect")

// const fbvid = require('fbvideos')

module.exports = async function (req, res) {
    // Break out the id param from our request's query string
    const { query: { id, redirect = false } } = url.parse(req.url, true)
    // const perPage = 50

    const videoUrl = `https://www.facebook.com/${id}`

    const { videoDetails = null, error = null } = await got(videoUrl).then(res => {
        const rawJSON = res.body.split('<script type="application/ld+json">')[1].split('</script>')[0]

        return {
            videoDetails: JSON.parse(rawJSON)
        }
    }).catch(error => {
        if (error) {
            error.message = 'Something went wrong getting the data'
        }
        
        console.warn(`Error fetching details for video ${id}`, error)

        return { error }
    })

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

    console.log(`Fetched details from https://www.facebook.com/${id}`)

    res.json(videoDetails)
}
