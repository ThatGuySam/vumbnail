export interface Global extends NodeJS.Global {
    location: Location | undefined
}

declare const globalThis: Global
