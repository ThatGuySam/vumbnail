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
    const videoReferences = await localForage.getItem( storageKey )

    if ( !videoReferences ) {
        await localForage.setItem( storageKey, [] )
    }

    return videoReferences
}

export async function getLatestReference () {
    const videoReferences = await getVideoReferences()

    return videoReferences[ videoReferences.length - 1 ]
}


export async function saveReference ( reference ) {
    // Get the reference list
    const videoReferences = await getVideoReferences()

    console.log('saveReference', reference, videoReferences)

    // Add the new reference to the list
    videoReferences.push(reference)

    // Save the updated reference list
    await localForage.setItem( storageKey, videoReferences )
}
