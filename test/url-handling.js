import test from 'ava'

import { parseOptionsFromPath } from '../helpers/url.js'


const pathExamples = [
    {
        path: '/358629078',
        expected: {
            videoId: '358629078',
            filename: '358629078',
            extension: '',
        }
    },
    {
        path: '/358629078_medium.mp4',
        expected: {
            videoId: '358629078',
            size: 'medium',
            extension: 'mp4',
            filename: '358629078_medium.mp4'
        }
    }
]

for ( const pathExample of pathExamples ) {
    test(`Can parse options from path: ${pathExample.path}`, t => {
        const options = parseOptionsFromPath(pathExample.path)
        
        t.deepEqual(options, pathExample.expected)
    })
}
