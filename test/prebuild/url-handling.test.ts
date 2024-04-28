import { expect, test } from 'vitest'

import { parseOptionsFromPath } from '~/helpers/url.js'


const pathExamples = [
    {
        path: '/358629078',
        expected: {
            videoId: '358629078',
            videoPassword: null,
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
            videoPassword: null,
            provider: 'vimeo',
            targetSizeKey: 'thumbnail_medium',
            extension: 'mp4',
            filename: '358629078_medium.mp4',
            filenameWithoutExtension: '358629078_medium',
        }
    },
    {
        path: '/358629078_hqdefault.mp4',
        expected: {
            videoId: '358629078',
            videoPassword: null,
            provider: 'vimeo',
            targetSizeKey: 'hqdefault',
            extension: 'mp4',
            filename: '358629078_hqdefault.mp4',
            filenameWithoutExtension: '358629078_hqdefault',
        }
    },
    {
        path: '/5e7QWV9LB_c.mp4',
        expected: {
            videoId: '5e7QWV9LB_c',
            videoPassword: null,
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
            videoPassword: null,
            provider: 'youtube',
            extension: 'webm',
            filename: 'V-66rBGAGns.webm',
            filenameWithoutExtension: 'V-66rBGAGns',
        }
    },
    {
        path: '/V-66rBGAGns_mqdefault.webm',
        expected: {
            videoId: 'V-66rBGAGns',
            videoPassword: null,
            provider: 'youtube',
            targetSizeKey: 'mqdefault',
            extension: 'webm',
            filename: 'V-66rBGAGns_mqdefault.webm',
            filenameWithoutExtension: 'V-66rBGAGns_mqdefault',
        }
    },
    {
        path: '/V-66rBGAGns_large.webm',
        expected: {
            videoId: 'V-66rBGAGns',
            videoPassword: null,
            provider: 'youtube',
            targetSizeKey: 'thumbnail_large',
            extension: 'webm',
            filename: 'V-66rBGAGns_large.webm',
            filenameWithoutExtension: 'V-66rBGAGns_large',
        }
    },
    {
        path: '/579958628:c8b4fb043c.jpg',
        expected: {
            videoId: '579958628',
            videoPassword: 'c8b4fb043c',
            provider: 'vimeo',
            extension: 'jpg',
            filename: '579958628:c8b4fb043c.jpg',
            filenameWithoutExtension: '579958628:c8b4fb043c',
        }
    },

    // With Query String
    {
        path: '/643816644.jpg?width=900&crop=1%3A1%2Csmart',
        expected: {
            videoId: '643816644',
            videoPassword: null,
            provider: 'vimeo',
            extension: 'jpg',
            filename: '643816644.jpg',
            filenameWithoutExtension: '643816644',
        }
    },

    // With Period in Query String
    {
        path: '/643816644.jpg?path=358629078.jpg',
        expected: {
            videoId: '643816644',
            videoPassword: null,
            provider: 'vimeo',
            extension: 'jpg',
            filename: '643816644.jpg',
            filenameWithoutExtension: '643816644',
        }
    },

    // With Period in Query String Alt
    {
        path: '/639263424.jpg?mw=539.9999856948853&mh=304.199991941452',
        expected: {
            videoId: '639263424',
            videoPassword: null,
            provider: 'vimeo',
            extension: 'jpg',
            filename: '639263424.jpg',
            filenameWithoutExtension: '639263424',
        }
    },
]

for ( const pathExample of pathExamples ) {

    test(`Can parse options from path: ${pathExample.path}`, () => {
        const options = parseOptionsFromPath(pathExample.path)

        // t.log('options', options)

        expect(options).toEqual(pathExample.expected)
    })


    test(`Can handler key from path: ${pathExample.path}`, () => {
        const options = parseOptionsFromPath(pathExample.path)

        expect(options).toEqual(pathExample.expected)
    })

}
