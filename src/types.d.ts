import type { VideoInfo } from 'js-video-url-parser/lib/urlParser'

type VectorExtension = 'svg'
type ImageExtension = 'jpg' | 'jpeg' | 'png'
type VideoExtension = 'mp4' | 'webm'
type PixelMediaExtension = ImageExtension | VideoExtension
type MediaExtension = ImageExtension | VideoExtension | VectorExtension

export interface ImageDetails {
    extension: MediaExtension
    inputUrl?: string
    size: {
        width: number
        height: number
        pathOptionName: string | boolean
    }
}

export type VideoId = Opaque<string, 'VideoId'>

export type Provider = 'youtube' | 'vimeo'

export interface ParsedVideoUrl {
    id: VideoId
    provider: Provider
}

export interface VideoOptions {
    videoId: VideoId
    provider: Provider
    extension: PixelMediaExtension
    filename: `${ string }.${ MediaExtension }`
    filenameWithoutExtension: string
    videoPassword: string | null
}

export interface HandlerOptions extends Partial<VideoOptions> {
    res: VercelResponse
    req: VercelRequest
    provider: Provider
}

export interface VideoInfoStrict extends VideoInfo {
    provider?: Provider
    extension?: PixelMediaExtension
}
