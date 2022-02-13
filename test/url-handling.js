import test from 'ava'

import { parseOptionsFromPath } from '../helpers/url.js'


const pathExamples = [
    {
        path: '/358629078',
        expected: {
            videoId: '358629078',
            provider: 'vimeo',
            extension: '',
            filename: '358629078',
            filenameWithoutExtension: '358629078',
        }
    },
    {
        path: '/358629078_medium.mp4',
        expected: {
            videoId: '358629078',
            provider: 'vimeo',
            size: 'medium',
            extension: 'mp4',
            filename: '358629078_medium.mp4',
            filenameWithoutExtension: '358629078_medium',
        }
    },
    {
        path: '/5e7QWV9LB_c.mp4',
        expected: {
            videoId: '5e7QWV9LB_c',
            provider: 'youtube',
            extension: 'mp4',
            filename: '5e7QWV9LB_c.mp4',
            filenameWithoutExtension: '5e7QWV9LB_c',
        }
    },
    {
        path: '/V-66rBGAGns.webm',
        expected: {
            videoId: 'V-66rBGAGns',
            provider: 'youtube',
            extension: 'webm',
            filename: 'V-66rBGAGns.webm',
            filenameWithoutExtension: 'V-66rBGAGns',
        }
    }
]

for ( const pathExample of pathExamples ) {

    test(`Can parse options from path: ${pathExample.path}`, t => {
        const options = parseOptionsFromPath(pathExample.path)
        
        t.deepEqual(options, pathExample.expected)
    })


    test(`Can handler key from path: ${pathExample.path}`, t => {
        const options = parseOptionsFromPath(pathExample.path)
        
        t.deepEqual(options, pathExample.expected)
    })

}
