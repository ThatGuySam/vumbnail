<template>

    <section class="flex flex-col justify-center pb-16">

        <label>
            <h3 class="sr-only">
                Paste your Video URL or ID
            </h3>
            <video-reference-input
                :video-reference="videoReference"

                autofocus

                @update:videoReference="videoReference = $event"
                @update:videoId="videoId = $event"
                @update:showInputError="showInputError = $event"
                @update:provider="provider = $event"
            />
            <div
                v-if="showInputError"
                class="text-sm py-3"
            >
                <p class="">
                    <span>
                        Not yet supported.
                    </span>
                    <span>
                        <a
                            class="underline"
                            :href="`https://github.com/ThatGuySam/vumbnail/discussions?discussions_q=${ getAnyHost(videoReference) }`"
                            target="_blank"
                        >Request</a>
                    </span>
                </p>
            </div>
        </label>

        <div class="example-videos py-5">
            <h2 class="pb-3">
                Examples
            </h2>
            <div class="button-group px-4">
                <button
                    v-for="video in exampleVideos"
                    :key="video.id"
                    class="bg-transparent hover:bg-gray-500 text-gray-300 hover:text-white border border-gray-500 hover:border-transparent rounded py-1 px-2 mx-3"
                    @click="videoReference = video.id"
                >{{ video.label }}</button>
            </div>
        </div>

        <div
            class="pb-16"
        >
            <section class="flex w-full">

                <div
                    class="code-area w-full overflow-scroll border rounded p-3"
                    style="background-color: #0d1117"
                >
                    <h3 class="text-xl pb-4">Code</h3>
                    <hr>
                    <div
                        v-if="embedHighlightedMarkup"
                        v-html="embedHighlightedMarkup"
                    />
                    <code
                        v-else
                        class="responsive-image-html block whitespace-pre-wrap"
                    >{{ embedPlainMarkup }}</code>
                </div>

                <div class="preview-area w-full  p-3">
                    <h3 class="text-xl pb-4">Preview</h3>
                    <div
                        v-html="embedPlainMarkup"
                    />
                </div>

            </section>

            <div class="py-5">

                <div class="inline">
                    <button
                        class="copy p-3 border rounded"
                        data-clipboard-target=".responsive-image-html"
                    >Copy</button>
                </div>

            </div>


            <br>
            <br>
            <br>
        </div>


    </section>

</template>


<script>

import has from 'just-has'

import {
    getAnyHost
} from '../../helpers/url.js'

import VideoReferenceInput from './video-reference-input.vue'



const embedTemplate = ({
    embedUrl,
    thumbnailUrl
}) => (
/* html */`
<!-- Reference: https://vumbnail.com/examples/srcdoc-iframe-for-lighthouse -->
<iframe
    srcdoc="
        <style>
            body, .full {
                width: 100%;
                height: 100%;
                margin: 0;
                position: absolute;
                display: flex;
                justify-content: center;
                object-fit: cover;
            }
        </style>
        <a
            href='${ embedUrl }'
            class='full'
        >
            <img
                src='${ thumbnailUrl }'
                class='full'
            />
            <svg
                version='1.1'
                viewBox='0 0 68 48'
                width='68px'
                style='position: relative;'
            >
                <path d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z' fill='#f00'></path>
                <path d='M 45,24 27,14 27,34' fill='#fff'></path>
            </svg>
        </a>
    "
    style="max-width: 640px; width: 100%; aspect-ratio: 16/9;"
    frameborder="0"
></iframe>`
)

export default {
    components: {
        VideoReferenceInput,
    },
    data () {
        return {
            highlighter: null,

            videoReference: '',
            videoId: 'd1vBNOiRyEI',
            provider: 'youtube',

            showInputError: false,
            exampleVideos: [],
            highlightedCode: {}
        }
    },

    methods: {
        getAnyHost,

        hasHighlightedCode ( reference ) {
            return has( this.highlightedCode, [reference] )
        },

        generateEmbedMarkup () {
            const html = this.highlighter.codeToHtml( this.embedPlainMarkup , { lang: 'html' })

            this.highlightedCode[ this.videoReference ] = html
        },
    },
    computed: {
        hasHighlighterInstance () {
            return this.highlighter !== null
        },

        embedUrl () {

            if( this.provider === 'youtube' ) {
                return `https://www.youtube.com/embed/${ this.videoId }?autoplay=1`
            }

            return `https://player.vimeo.com/video/${ this.videoId }?autoplay=1&autopause=0`
        },

        thumbnailUrl () {
            return `https://vumbnail.com/${ this.videoId }.jpg`
        },

        embedPlainMarkup () {
            return embedTemplate({
                embedUrl: this.embedUrl,
                thumbnailUrl: this.thumbnailUrl,
            })
        },

        embedHighlightedMarkup () {
            if ( !this.hasHighlighterInstance ) {
                return null
            }

            return this.highlighter.codeToHtml( this.embedPlainMarkup , { lang: 'html' })
        },

        // embedMarkup () {

        //     console.log('this.hasHighlightedCode( this.videoReference )', this.hasHighlightedCode( this.videoReference ))
        //     // If we have the highlighted code, use that.
        //     if ( this.hasHighlightedCode( this.videoReference ) ) {
        //         return this.highlightedCode[ this.videoReference ]
        //     }

        //     // Otherwise, use the plain markup.
        //     return this.embedPlainMarkup
        // }
    },

    mounted () {

        // Initialize the highlighter on client only
        if ( !import.meta.env.SSR ) {
            import('../../helpers/highlighter.js')
                .then(async ( { initHighlighter } ) => {
                    this.highlighter = await initHighlighter()

                    // Generate initial markup
                    // this.generateEmbedMarkup()
                })
        }
    },

    watch: {
        // videoId () {
        //     // If we don't have this highlighted code yet,
        //     // we need to generate it.

        //     if ( this.hasHighlighterInstance && ! this.hasHighlightedCode( this.videoReference ) ) {
        //         this.generateEmbedMarkup()
        //         // console.log('highlighted', html)
        //     }

        // }
    }

}
</script>
