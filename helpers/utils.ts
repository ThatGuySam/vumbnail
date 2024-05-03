function isAlpha ( char: string ): boolean {
    const code = char.charCodeAt( 0 )
    return ( code >= 65 && code <= 90 ) || ( code >= 97 && code <= 122 )
}

export function trimNonAlpha ( str: string ): string {
    let start = 0
    let end = str.length - 1

    // Find the first non-alpha character from the start
    while ( start <= end && !isAlpha( str[ start ] ) ) {
        start++
    }

    // Find the first non-alpha character from the end
    while ( end >= start && !isAlpha( str[ end ] ) ) {
        end--
    }

    // Return the substring that excludes alpha characters from both ends
    return str.slice( start, end + 1 )
}

export function onlyDigits ( maybeDigits: string ): boolean {
    for ( let i = maybeDigits.length - 1; i >= 0; i-- ) {
        const d = maybeDigits.charCodeAt( i )
        if ( d < 48 || d > 57 ) {
            return false
        }
    }
    return true
}
