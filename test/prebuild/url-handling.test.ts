import { expect, it } from 'vitest'

import { parseOptionsFromPath } from '~/helpers/url.js'
import type { MediaExtension } from '~/src/types.js'

function expectedVideo(videoId: string, extension: MediaExtension | '' = 'jpg') {
    return {
        videoId,
        videoPassword: null,
        extension,
        filename: `${videoId}.${extension}`,
        filenameWithoutExtension: videoId,
    } as const
}

function expectedVimeoVideo(videoId: string, extension: MediaExtension | '' = 'jpg') {
    return {
        ...expectedVideo(videoId, extension),
        provider: 'vimeo',
    }
}

function expectedYouTubeVideo(videoId: string, extension: MediaExtension | '' = 'jpg') {
    return {
        ...expectedVideo(videoId, extension),
        provider: 'youtube',
    }
}

const pathExamples = [
    {
        path: '/358629078',
        expected: {
            ...expectedVimeoVideo('358629078', ''),
            videoId: '358629078',
            filename: '358629078',
        },
    },
    {
        path: '/358629078_medium.mp4',
        expected: {
            ...expectedVimeoVideo('358629078', 'mp4'),
            targetSizeKey: 'thumbnail_medium',
            filename: '358629078_medium.mp4',
            filenameWithoutExtension: '358629078_medium',
        },
    },
    {
        path: '/358629078_hqdefault.mp4',
        expected: {
            ...expectedVimeoVideo('358629078', 'mp4'),
            targetSizeKey: 'hqdefault',
            filename: '358629078_hqdefault.mp4',
            filenameWithoutExtension: '358629078_hqdefault',
        },
    },
    {
        path: '/5e7QWV9LB_c.mp4',
        expected: {
            ...expectedYouTubeVideo('5e7QWV9LB_c', 'mp4'),
        },
    },
    {
        path: '/V-66rBGAGns.webm',
        expected: {
            ...expectedYouTubeVideo('V-66rBGAGns', 'webm'),
        },
    },
    {
        path: '/V-66rBGAGns_mqdefault.webm',
        expected: {
            ...expectedYouTubeVideo('V-66rBGAGns', 'webm'),
            targetSizeKey: 'mqdefault',
            filename: 'V-66rBGAGns_mqdefault.webm',
            filenameWithoutExtension: 'V-66rBGAGns_mqdefault',
        },
    },
    {
        path: '/V-66rBGAGns_large.webm',
        expected: {
            ...expectedYouTubeVideo('V-66rBGAGns', 'webm'),
            targetSizeKey: 'thumbnail_large',
            filename: 'V-66rBGAGns_large.webm',
            filenameWithoutExtension: 'V-66rBGAGns_large',
        },
    },
    {
        path: '/579958628:c8b4fb043c.jpg',
        expected: {
            ...expectedVimeoVideo('579958628', 'jpg'),
            videoPassword: 'c8b4fb043c',
            filename: '579958628:c8b4fb043c.jpg',
            filenameWithoutExtension: '579958628:c8b4fb043c',
        },
    },

    // With Query String
    {
        path: '/643816644.jpg?width=900&crop=1%3A1%2Csmart',
        expected: {
            ...expectedVimeoVideo('643816644', 'jpg'),
        },
    },

    // With Period in Query String
    {
        path: '/643816644.jpg?path=358629078.jpg',
        expected: {
            ...expectedVimeoVideo('643816644', 'jpg'),
        },
    },

    // With Period in Query String Alt
    {
        path: '/639263424.jpg?mw=539.9999856948853&mh=304.199991941452',
        expected: {
            ...expectedVimeoVideo('639263424', 'jpg'),
        },
    },

    // Full YouTube URL
    {
        path: '/https:/www.youtube.com/watch?v=8t6h3wid0Pg.jpg',
        expected: {
            ...expectedYouTubeVideo('8t6h3wid0Pg', 'jpg'),
        },
    },
]

for (const pathExample of pathExamples) {
    it(`can parse options from path: `, () => {
        const options = parseOptionsFromPath(pathExample.path)

        // t.log('options', options)

        expect(options).toEqual(pathExample.expected)
    })

    it(`can handler key from path: `, () => {
        const options = parseOptionsFromPath(pathExample.path)

        expect(options).toEqual(pathExample.expected)
    })
}
