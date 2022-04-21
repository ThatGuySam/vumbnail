<template>

    <div class="video-row relative w-full ">

        <div
            ref="row"
            class="video-row-contents flex w-full overflow-x-auto flex-nowrap p-6 gap-6"
            style="scroll-snap-type:x mandatory;"
        >

            <button
                v-for="video in mappedVideos"
                :key="video.reference"

                :class="[
                    'video-card w-full flex-shrink-0 flex-grow-0 border-2 border-transparent rounded-lg aspect-video overflow-hidden',
                    videoReference === video.reference ? 'border-white' : null
                ]"
                style="max-width: 100px; flex-basis: 100px; scroll-snap-align: start;"
                :aria-label="video.label"

                @click="$emit('update:videoReference', video.reference)"
            >
                <!-- Reference Docs: https://vumbnail.com -->
                <img
                    :srcset="`
                        ${ video.thumbnailUrls.medium } 200w,
                        ${ video.thumbnailUrls.small } 100w
                    `"
                    sizes="(max-width: 640px) 100vw, 640px"
                    :src="video.thumbnailUrls.base"
                    role="presentation"
                    class="w-full h-full object-cover object-center"
                />
            </button>

    </div>

</div>

</template>


<script>

import urlParser from 'js-video-url-parser'
// import debounce from 'just-debounce'

// import {
//     getProviderAndIdFromFilename,
//     isValidUrl
// } from '../../helpers/url.js'


const exampleVideos = [
    {
        label: 'J-Money',
        reference: 'https://vimeo.com/376454747'
    },
    {
        label: '🔴 Hourly Billing Is Nuts— Stop Trading Time For Money',
        reference: 'https://www.youtube.com/watch?v=B1b7QlQILRo'
    },
    {
        label: 'How to Build Products Users Love with Kevin Hale',
        reference: 'https://www.youtube.com/watch?v=12D8zEdOPYo'
    },
    {
        label: 'Rahul Vohra on product market fit',
        reference: 'https://www.youtube.com/watch?v=TXXNBYmt6a8'
    },
    {
        label: 'Imagining the Tenth Dimension',
        reference: 'https://www.youtube.com/watch?v=zqeqW3g8N2Q'
    },
    {
        label: 'Avoid These Common Mistakes Junior Developers Make!',
        reference: 'https://www.youtube.com/watch?v=5g3dK2DgW-k'
    },
    {
        label: 'First steps to getting a great Page Experience',
        reference: 'https://www.youtube.com/watch?v=1vs-R-lc-qo'
    },
    {
        label: 'Dad Life',
        reference: 'https://vimeo.com/12714406'
    },
    {
        label: 'City Limits',
        reference: 'https://vimeo.com/23237102'
    },
    {
        label: 'Girl Walk',
        reference: 'https://vimeo.com/32845443'
    },
    {
        label: 'Breathtaking',
        reference: 'https://www.youtube.com/watch?v=W2EMHNhyEnQ'
    },
    {
        label: 'Ricky Boy',
        reference: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
]


let videoReferencesInstance

async function getVideoReferencesInstance () {
    if ( !videoReferencesInstance ) {
        videoReferencesInstance = await import( '../../helpers/video-references.js' )
    }

    return videoReferencesInstance
}


export default {
    props: {
        videoReference: {
            type: String,
            default: '',
        },
    },
    emits: [
        'update:videoReference',
    ],
    data () {
        return {
            videos: [
                ...exampleVideos
            ]
        }
    },

    methods: {
        async prependStoredVideos () {

            const {
                getVideoReferences
            } = await getVideoReferencesInstance()

            const videoReferences = await getVideoReferences()

            this.videos = [
                ...videoReferences
                    // Filter out videos that are already in the list
                    .filter( reference => ! this.videos.some( existingVideo => existingVideo.reference === reference ) )
                    .map( reference => {
                        return {
                            label: `Stored Video ${reference}`,
                            reference,
                        }
                    }),
                ...this.videos,
            ]

            // Wait for next tick and scroll to the left on our row
            await this.$nextTick()

            this.$refs.row.scrollLeft = 0


            // setTimeout( () => {
            //     this.$refs.row.scrollLeft = 0
            // }, 0)

        }
    },

    computed: {
        hasReference () {
            return this.videoReference.trim().length > 0
        },

        mappedVideos () {
            return this.videos.map( video => {
                const videoId = urlParser.parse( video.reference ).id

                return {
                    label: video.label,
                    reference: video.reference,
                    thumbnailUrls: {
                        base: `https://vumbnail.com/${ videoId }.jpg`,
                        small: `https://vumbnail.com/${ videoId }_small.jpg`,
                        medium: `https://vumbnail.com/${ videoId }_medium.jpg`,
                    }
                }
            })
        }
    },

    mounted () {
        this.prependStoredVideos()
    },

    // watch: {
    //     videoReference () {
    //         setTimeout( () => {
    //             this.prependStoredVideos()
    //         }, 100 )
    //     }
    // }

}
</script>
