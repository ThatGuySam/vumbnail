

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

export type VideoId = Opaque<string, 'VideoId'>

export type Provider = 'youtube' | 'vimeo'

export interface ParsedVideoUrl {
    id: VideoId,
    provider: Provider,
}