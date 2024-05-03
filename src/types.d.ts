import type { VideoInfo } from 'js-video-url-parser/lib/urlParser'
import type {
    imageExtensions,
    vectorExtensions,
    videoExtensions,
} from '~/helpers/constants.ts'

type VectorExtension = typeof vectorExtensions[number]
type ImageExtension = typeof imageExtensions[number]
type VideoExtension = typeof videoExtensions[number]
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
    extension: PixelMediaExtension | ''
    filename: string// `${ string }.${ MediaExtension }`
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
