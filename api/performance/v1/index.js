// URL utility
import url from 'url'

import lighthouse from 'serverless-lighthouse'



export default async function ( req, res ) {
    // Break out the id param from our request's query string
    const { query: { id, redirect = false, key = null } } = url.parse(req.url, true)

    // const videoUrl = `https://www.facebook.com/${id}`
    
    
    const urlToBeAudited = 'https://samcarlton.com/'
    
    const result = await lighthouse.runLighthouse( urlToBeAudited )


    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    // console.log(`Fetched video data from https://vimeo.com/${id}`)

    // Repond with Video JSON Data
    res.json( result )
}