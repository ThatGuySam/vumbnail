/**
 * Generated via Quicktype from the JSON responses of the following:
 * https://vimeo.com/376454747
 * https://www.youtube.com/watch?v=H5k209MZWRY
 */
export interface YouTubeDlpResponse {
    id: string
    title: string
    formats: YouTubeDlpFormat[]
    thumbnails: Thumbnail[]
    thumbnail: string
    description: string
    channel_id?: string
    channel_url?: string
    duration: number
    view_count: number
    average_rating?: null
    age_limit?: number
    webpage_url: string
    categories?: string[]
    tags?: string[]
    playable_in_embed?: boolean
    live_status?: string
    release_timestamp?: null
    _format_sort_fields: string[]
    automatic_captions?: { [key: string]: AutomaticCaption[] }
    subtitles: Subtitles
    comment_count: number
    chapters?: Chapter[]
    heatmap?: null
    like_count: number
    channel?: string
    channel_follower_count?: number
    uploader: string
    uploader_id: string
    uploader_url: string
    upload_date: string
    availability?: string
    original_url: string
    webpage_url_basename: string
    webpage_url_domain: string
    extractor: string
    extractor_key: string
    playlist: null
    playlist_index: null
    display_id: string
    fulltitle: string
    duration_string: string
    release_year: null
    is_live?: boolean
    was_live?: boolean
    requested_subtitles: null
    _has_drm: null
    epoch: number
    requested_formats: RequestedFormat[]
    format: string
    format_id: string
    ext: AudioextEnum
    protocol: string
    language: Language | null
    format_note: string
    filesize_approx: number | null
    tbr: number
    width: number
    height: number
    resolution: string
    fps: number
    dynamic_range: DynamicRange
    vcodec: string
    vbr: number
    stretched_ratio: null
    aspect_ratio: number
    acodec: Acodec
    abr: number
    asr: number
    audio_channels: number | null
    timestamp?: number
    license?: string
}

export enum Acodec {
    Mp4A402 = 'mp4a.40.2',
    Mp4A405 = 'mp4a.40.5',
    None = 'none',
    Opus = 'opus',
}

export interface AutomaticCaption {
    ext: AutomaticCaptionext
    url: string
    name: string
}

export enum AutomaticCaptionext {
    Json3 = 'json3',
    Srv1 = 'srv1',
    Srv2 = 'srv2',
    Srv3 = 'srv3',
    Ttml = 'ttml',
    Vtt = 'vtt',
}

export interface Chapter {
    start_time: number
    title: string
    end_time: number
}

export enum DynamicRange {
    SDR = 'SDR',
}

export enum AudioextEnum {
    M4A = 'm4a',
    Mhtml = 'mhtml',
    Mp4 = 'mp4',
    None = 'none',
    Webm = 'webm',
}

export interface YouTubeDlpFormat {
    format_id: string
    format_note?: string
    ext: AudioextEnum
    protocol: Protocol
    acodec?: Acodec
    vcodec: string
    url: string
    width?: number | null
    height?: number | null
    fps?: number | null
    rows?: number
    columns?: number
    fragments?: FormatFragment[]
    resolution: string
    aspect_ratio: number | null
    filesize_approx?: number | null
    http_headers: Subtitles
    audio_ext: AudioextEnum
    video_ext: AudioextEnum
    vbr: number | null
    abr: number | null
    tbr: number | null
    format: string
    format_index?: null
    manifest_url?: string
    language?: Language | null
    preference?: null
    quality?: number | null
    has_drm?: boolean
    source_preference?: number
    asr?: number | null
    filesize?: number | null
    audio_channels?: number | null
    language_preference?: number
    dynamic_range?: DynamicRange | null
    container?: Container
    downloader_options?: DownloaderOptions
    fragment_base_url?: string
    manifest_stream_number?: number
    is_dash_periods?: boolean
}

export enum Container {
    M4ADash = 'm4a_dash',
    Mp4Dash = 'mp4_dash',
    WebmDash = 'webm_dash',
}

export interface DownloaderOptions {
    http_chunk_size: number
}

export interface FormatFragment {
    url?: string
    duration?: number
    path?: string
}

export interface Subtitles {
}

export enum Language {
    En = 'en',
}

export enum Protocol {
    HttpDashSegments = 'http_dash_segments',
    Https = 'https',
    M3U8Native = 'm3u8_native',
    Mhtml = 'mhtml',
}

export interface RequestedFormat {
    asr?: number | null
    filesize?: number | null
    format_id: string
    format_note?: string
    source_preference?: number
    fps: number | null
    audio_channels?: number | null
    height: number | null
    quality?: number | null
    has_drm?: boolean
    tbr: number
    filesize_approx?: number
    url: string
    width: number | null
    language?: Language | null
    language_preference?: number
    preference?: null
    ext: AudioextEnum
    vcodec: string
    acodec: Acodec
    dynamic_range: DynamicRange | null
    container?: Container
    downloader_options?: DownloaderOptions
    protocol: Protocol
    resolution: string
    aspect_ratio: number | null
    http_headers: Subtitles
    video_ext: AudioextEnum
    audio_ext: AudioextEnum
    abr: number
    vbr: number
    format: string
    format_index?: null
    manifest_url?: string
    fragment_base_url?: string
    fragments?: RequestedFormatFragment[]
    manifest_stream_number?: number
    is_dash_periods?: boolean
}

export interface RequestedFormatFragment {
    path: string
    duration?: number
}

export interface Thumbnail {
    url: string
    preference?: number
    id: string
    height?: number
    width?: number | null
    resolution?: string
}

export interface Album {
    name: string
    artist: ArtistClass
    tracks: Track[]
}

export interface ArtistClass {
    name: string
    founded: number
    members: string[]
}

export interface Track {
    name: string
    duration: number
}
