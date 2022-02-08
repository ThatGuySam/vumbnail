import test from 'ava'

import { parseOptionsFromPath } from '../helpers/url.js'


const pathExamples = [
    {
        path: '/358629078',
        expected: {
            videoId: '358629078',
            provider: 'vimeo',
            filename: '358629078',
            extension: '',
        }
    },
    {
        path: '/358629078_medium.mp4',
        expected: {
            videoId: '358629078',
            provider: 'vimeo',
            size: 'medium',
            extension: 'mp4',
            filename: '358629078_medium.mp4'
        }
    },
    {
        path: '/5e7QWV9LB_c.mp4',
        expected: {
            videoId: '5e7QWV9LB_c',
            provider: 'youtube',
            extension: 'mp4',
            filename: '5e7QWV9LB_c.mp4'
        }
    },
    {
        path: '/V-66rBGAGns.webm',
        expected: {
            videoId: 'V-66rBGAGns',
            provider: 'youtube',
            extension: 'webm',
            filename: 'V-66rBGAGns.webm'
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
