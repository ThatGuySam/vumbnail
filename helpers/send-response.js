

export const svgTemplate = () => `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 80 45" 
        stroke="rgba(0,0,0,0.1)"
    >
        <rect width="100%" height="100%" fill="white" />
        <path 
            transform="translate(28, 10.5)"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
        />
    </svg>
`

export function sendErrorResponseVideo(options = {}) {
    const {
        req,
        res,
        error
    } = options

    res.contentType = `video/${ options.extension }`

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#syntax
    // res.setHeader(
    //     'Content-Disposition',
    //     'inline'
    //     // contentDisposition(`${info.title}.${audioOnly ? "mp3" : "mp4"}`)
    // )

    res.status(500).send({
        error: error.message,
        stack: error.stack
    })
}