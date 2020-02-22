// URL utility
import url from 'url'
// Axios
import axios from 'axios'


const graph = axios.create({
    baseURL: 'https://graph.facebook.com/v6.0',
    /* other custom settings */
})

module.exports = async function (req, res) {
    // Break out the id param from our request's query string
    const { query: { id } } = url.parse(req.url, true)
    // const perPage = 50

    // https://developers.facebook.com/docs/graph-api/reference/live-video/
    const { data = null, error = null } = await graph.get(`/${id}/live_videos`, {
        params: {
            fields: [
                'embed_html',
                'from',
                'permalink_url',
                'planned_start_time',
                'stream_url',
                'video',
                'broadcast_start_time',
                'status'
            ].join(),
            access_token: process.env.FACEBOOK_ACCESS_TOKEN
        }
    }).catch(error => {
        console.warn('Error fetching live videos')

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('data', error.response.data)
            console.log('status', error.response.status)
            console.log('headers', error.response.headers)
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('request', error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
        }
        console.log(error.config)

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

    const items = data.data

    const latestFound = items.find(item => item.status === 'LIVE') || null

    console.log(`Fetched ${items.length} videos from https://www.facebook.com/${id}`)

    res.json(latestFound)
}
