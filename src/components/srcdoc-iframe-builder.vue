<template>

    <section class="flex flex-col justify-center gap-5 pb-16">

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

        <videos-for-input
            :video-reference="videoReference"

            @update:videoReference="videoReference = $event"
        />

        <div
            class="pb-16"
        >
            <section class="flex w-full">

                <div
                    class="code-area flex flex-col gap-4 w-full overflow-scroll border rounded p-3"
                    style="background-color: #0d1117"
                >
                    <div class="flex items-center gap-4">

                        <h3 class="text-xl font-bold">Code</h3>

                        <div class="w-full flex justify-between items-center">

                            <button
                                ref="copyButton"
                                :class="[
                                    'copy px-3 py-1 border rounded',
                                    'focus:bg-white'
                                ]"

                                @click="animateCopy( $event )"
                            >Copy</button>

                            <div class="end-content">
                                <form
                                    action="https://codepen.io/pen/define/"
                                    method="post"
                                    target="_blank"
                                >
                                     <input
                                        type="hidden"
                                        name="data"
                                        :value='codePenOptions'
                                    >
                                    <button
                                        type="submit"
                                    >Edit on CodePen</button>
                                </form>
                            </div>
                        </div>

                    </div>
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
                    <h3 class="text-xl font-bold pb-4">Preview</h3>
                    <div
                        v-html="embedPlainMarkup"
                    />
                </div>

            </section>


            <br>
            <br>
            <br>
        </div>


    </section>

</template>


<script>

import ClipboardJS from 'clipboard'
import has from 'just-has'

import {
    getAnyHost
} from '../../helpers/url.js'

import VideoReferenceInput from './video-reference-input.vue'
import VideosForInput from './videos-for-input.vue'



const embedTemplate = ({
    embedUrl,
    thumbnailUrl
}) => (
/* html */`<!-- Reference: https://vumbnail.com/examples/srcdoc-iframe-for-lighthouse -->
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
        VideosForInput
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

        animateCopy ( event ) {
            const animateClass = 'animate-ping'

            // Remove any existing animation classes
            event.target.classList.remove( animateClass )

            // Add the animation class
            // to trigger the animation
            event.target.classList.add( animateClass )

            // Remove the animation class
            // after the animation is complete
            setTimeout( () => {
                event.target.classList.remove( animateClass )
            }, 1000 )
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

        // https://blog.codepen.io/documentation/prefill/#all-the-json-options-0
        codePenOptions () {
            // https://codepen.io/ThatGuySam/pen/rNpvrQg
            const parentPen = '60039603'

            const options = {
                title: `Vumbnail Embed for ${ this.videoReference }`,
                description: `Src Embed for ${ this.videoReference } optimized for Google Lighthouse performance`,
                parent: parentPen,
                tags: ['YouTube', 'Vimeo', 'Embed', 'Lighthouse', 'Performance'],
                editors: '100',
                layout: 'left',

                html: this.embedPlainMarkup,
            }

            return JSON.stringify( options, null, 2 )
        },
    },

    mounted () {

        // Setup Copy to Clipboard
        // https://github.com/zenorocha/clipboard.js#advanced-options
        this.clipboard = new ClipboardJS( this.$refs.copyButton , {
            text: () => {
                return this.embedPlainMarkup
            },
        })

        // Initialize the highlighter on client only
        if ( !import.meta.env.SSR ) {
            import('../../helpers/highlighter.js')
                .then(async ( { initHighlighter } ) => {
                    this.highlighter = await initHighlighter()
                })
        }
    },

}
</script>
