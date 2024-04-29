import { VideoInfo } from "js-video-url-parser/lib/urlParser"


type ImageExtension = 'jpg' | 'jpeg' | 'png'
type VideoExtension = 'mp4' | 'webm'
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

export interface VideoOptions {
    videoId: VideoId,
    provider: Provider,
    extension: MediaExtension
    filename: `${string}.${MediaExtension}`
    filenameWithoutExtension: string,
    videoPassword: string | null,
}
