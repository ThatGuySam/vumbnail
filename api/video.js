// URL utility
import Url from 'node:url'
import axios from 'axios'
import microRedirect from 'micro-redirect'

// const microRedirect = require("micro-redirect")

// const fbvid = require('fbvideos')

// 307 - Temporary Redirect
const tempRedirectCode = 307

export default async function ( req, res ) {
    // Break out the id param from our request's query string
    const { query: { id, redirect = false, key = null } } = new Url( req.url, true )
    // const perPage = 50

    // const videoUrl = `https://www.facebook.com/${id}`

    const apiUrl = `https://vimeo.com/api/v2/video/${ id }.json`

    const { videoData = null, error = null } = await axios.get( apiUrl ).then( ( response ) => {
        // console.log(videoData)
        return {
            videoData: response.data[ 0 ],
        }
        // => { url: 'https://video.fpat1-1.fna.fbcdn.net/...mp4?934&OE=2kf2lf4g' }
    } ).catch( ( error ) => {
        console.warn( `Error fetching video ${ id }`, error )

        return { error }
    } )

    // Send an error response if something went wrong
    if ( error !== null ) {
        res.json( {
            error: 'Error fetching',
        } )

        // Stop function
        return
    }

    // if there's no video data the stop
    if ( videoData === null ) {
        return // Stop function
    }

    if ( key ) {
        const thumbResponse = await axios.get( videoData[ key ], {
            responseType: 'stream',
        } )

        // Set a header for jpg
        res.setHeader( 'Content-Type', 'image/jpeg' )

        // eslint-disable-next-line no-console
        console.log( 'Streamed image', key )
        thumbResponse.data.pipe( res )

        // microRedirect(res, tempRedirectCode, videoData[key])

        // Stop function
        return
    }

    if ( redirect ) {
        // eslint-disable-next-line no-console
        console.log( 'Redirected image', key )

        microRedirect( res, tempRedirectCode, videoData.url )

        // Stop function
        return
    }

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader( 'Access-Control-Allow-Origin', '*' )
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' )

    // eslint-disable-next-line no-console
    console.log( `Fetched video data from https://vimeo.com/${ id }` )

    // Respond with Video JSON Data
    res.json( videoData )
}
