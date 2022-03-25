// Esbuild Setup - https://github.com/cloudflare/miniflare/blob/dc55621c0767e462b05635f8dd6ba79f4f9445f7/docs/src/content/developing/esbuild.md#-developing-with-esbuild
// Miniflare Documentation - https://miniflare.dev/

const canaryHost = 'canary.vumbnail.com'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

// https://developers.cloudflare.com/workers/examples/respond-with-another-site/
function respondWithSite ( request ) {
    const requestUrl = new URL( request.url )

    // Update URL to use canary
    requestUrl.protocol = 'https:'
    requestUrl.host = canaryHost
    requestUrl.port = ''
    
    // console.log('requestUrl', requestUrl)
    // console.log( 'url string', requestUrl.toString() )

    return fetch( requestUrl.toString() )
}

// Alter Headers - https://developers.cloudflare.com/workers/examples/alter-headers
async function handleRequest( request ) {
    return respondWithSite( request )
}
