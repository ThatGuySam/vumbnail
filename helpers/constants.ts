export const vectorExtensions = [ 'svg' ] as const
export const imageExtensions = [ 'jpg', 'jpeg', 'png' ] as const
export const videoExtensions = [ 'mp4', 'webm' ] as const

export const pixelMediaExtension = [
    ...imageExtensions,
    ...videoExtensions,
]

export const mediaExtensions = [
    ...vectorExtensions,
    ...imageExtensions,
    ...videoExtensions,
]
