

type ImageExtension = 'jpg' | 'jpeg' | 'png'
type VideoExtension = 'mp4'
type MediaExtension = ImageExtension | VideoExtension

export interface ImageDetails {
    extension: MediaExtension,
    inputUrl?: string,
    size: {
        width: number,
        height: number,
        pathOptionName: string | boolean,
    }
}