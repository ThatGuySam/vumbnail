export const title = 'React'

export function template ( options = {} ) {
    
    return `
<img 
    srcSet={\`
        https://vumbnail.com/${ options.videoId }_large.jpg 640w, 
        https://vumbnail.com/${ options.videoId }_medium.jpg 200w, 
        https://vumbnail.com/${ options.videoId }_small.jpg 100w
    \`} 
    sizes='(max-width: 640px) 100vw, 640px' 
    src='https://vumbnail.com/${ options.videoId }.jpg' 
/>
`
}