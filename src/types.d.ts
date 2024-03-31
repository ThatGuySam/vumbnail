

export interface ImageDetails {
    extension: string,
    inputUrl?: string,
    size: {
        width: number,
        height: number,
        pathOptionName: string | boolean,
    }
}