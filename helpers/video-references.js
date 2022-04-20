import localForage from 'localforage'


const storageKey = 'video-references'

// Initialize localForage
localForage.config({
    driver: localForage.INDEXEDDB,
    name: storageKey
})

// If there's no list stored yet
// then initialize the reference list
// with an empty array
export async function getVideoReferences () {
    const initialValue = []

    const videoReferences = await localForage.getItem( storageKey )

    // Return the stored list
    if ( !!videoReferences ) {
        return videoReferences
    }

    // Intialize the reference list
    await localForage.setItem( storageKey, initialValue )

    // Return initial value
    return initialValue
}

export async function getLatestReference () {
    const videoReferences = await getVideoReferences()

    return videoReferences[ 0 ]
}


export async function saveReference ( newReference ) {
    // Get the reference list
    const videoReferences = await getVideoReferences()

    // console.log('saveReference', newReference, videoReferences)

    // Exlude any existing references that match
    const updatedVideoReferences = videoReferences.filter( ( storedReference ) => {
        return newReference !== storedReference
    })

    // Save the updated reference list
    await localForage.setItem( storageKey, [
        newReference,
        ...updatedVideoReferences
    ] )
}
