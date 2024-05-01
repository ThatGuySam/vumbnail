// URL utility

// @ts-expect-error - No types yet
import lighthouse from 'serverless-lighthouse'

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function (req: VercelRequest, res: VercelResponse) {
    const urlString = req.url

    // Throw an error if the URL is not provided
    if (!urlString) { throw new Error('No URL provided') }

    // Break out the id param from our request's query string
    // const { query: { id, redirect = false, key = null } } = req

    // const videoUrl = `https://www.facebook.com/${id}`

    const urlToBeAudited = 'https://samcarlton.com/'

    const result = await lighthouse.runLighthouse(urlToBeAudited)

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    // console.log(`Fetched video data from https://vimeo.com/${id}`)

    // Respond with Video JSON Data
    res.json(result)
}
