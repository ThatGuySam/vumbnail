import { PerformanceObserver, performance } from 'node:perf_hooks'

export const observePerformance = new PerformanceObserver( ( items ) => {
    items.getEntries().forEach( ( entry ) => {
        // console.log(item.name, + ' ' + item.duration)

        const entryDurationSeconds = ( entry.duration ).toFixed( 2 )
        // const durationPerFile = ( entry.duration / fileCount ).toFixed(2)

        // eslint-disable-next-line no-console
        console.log( `${ entry.name }: ${ entryDurationSeconds }ms` )

        // countEntryFiles()
        //     .then( fileCount => {
        //         const entryDurationSeconds = ( entry.duration / 1000 ).toFixed(2)
        //         const durationPerFile = ( entry.duration / fileCount ).toFixed(2)

        //         console.log(`${ entry.name }: ${ entryDurationSeconds }s (${ durationPerFile }ms per file)`)
        //     })
    } )
} )

observePerformance.observe( { entryTypes: [ 'measure' ] } )

export { performance }
