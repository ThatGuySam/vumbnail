<template>

    <div
        class="flex items-center flex-col px-6"
    >

        <div
            class="w-full max-w-3xl py-16"
        >

            <section class="text-center pb-16">
                Simple Video Thumbnails for Frontend Developers
            </section>

            <section class="flex flex-col justify-center text-center max-w-3xl pb-16">

                <label>
                    <h3 class="sr-only">
                        Enter your Video URL or ID
                    </h3>
                    <!-- videoReference: {{ videoReference }} -->
                    <video-reference-input
                        :video-reference="videoReference"

                        autofocus

                        @update:videoReference="videoReference = $event"
                        @update:videoId="videoId = $event"
                        @update:showInputError="showInputError = $event"
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
                    <h2 class="sr-only pb-3">
                        Examples
                    </h2>
                    <videos-for-input
                        :video-reference="videoReference"

                        @update:videoReference="videoReference = $event"
                    />
                </div>

            </section>


            <section class="pb-16">
                <div
                    class="pb-16"
                >
                    <section>
                        <h2
                            id="responsive-image"
                            class="text-4xl"
                        >Responsive Image (Recommended)</h2>
                        <h4 class="text-xl pb-4">Let's the browser pick the exact right image for the screen size so it loads as fast as possible. </h4>
                        <div
                            v-html="responsiveImageHtml"
                        ></div>

                        <br>

                        <h3 class="text-xl pb-4">Image HTML</h3>
                        <code
                            class="responsive-image-html block whitespace-pre-wrap border rounded p-3"
                        >
                            {{ responsiveImageHtml }}
                        </code>
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

                <!-- Examples Loop -->

                <div
                    v-for="item in mappedItems"
                    :key="item.heading"
                    class="pb-16"
                >
                    <h2 class="text-4xl">{{ item.heading }}</h2>
                    <img
                        :src="item.imageSrc"
                        :alt="item.imageAlt"
                    />

                    <br>

                    <h3
                        :id="item.id"
                        class="text-xl pb-4"
                    >Image URL</h3>
                    <code
                        class="block border rounded p-3"
                        style="word-break: break-all;"
                    >
                        {{ item.imageSrc }}
                    </code>

                    <div class="flex gap-5 py-5">

                        <div class="inline">
                            <button
                                class="copy p-3 border rounded"
                                :data-clipboard-text="item.imageSrc"
                            >Copy</button>
                        </div>

                        <div class="inline">
                            <a
                                :href="item.imageSrc"
                                :title="`View ${item.heading}`"
                            >
                                <div class="border rounded p-3">
                                    View Image
                                </div>
                            </a>
                        </div>

                    </div>


                    <br>
                    <br>
                    <br>
                </div>

                <!-- End Examples Loop -->


                <div
                    class="pb-16"
                >
                    <div class="heading-area pb-4">
                        Coming Soon
                        <div class="flex gap-3">
                            <h2
                                id="animated-image"
                                class="text-4xl"
                            >Animated Thumbnail Example</h2>
                            <div class="pro-pill h-5 text-xs font-bold bg-black flex justify-center items-center outline-0 rounded-full ease px-2" style="top: -1em; right: 0px;">
                                Pro
                            </div>
                        </div>
                        <h4 class="text-xl">An animated preview thumbnail of the Vimeo video. </h4>
                        <a
                            class="inline-block bg-transparent hover:bg-gray-500 font-semibold hover:text-white border border-gray-500 hover:border-transparent rounded py-2 px-4 my-3"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeFU6f19pAEJMI8yJYOzGIV8y8Sg5NvSnaM6tXz83VtvZeU7Q/viewform?usp=pp_url&entry.5778473=Animated+Thumbnails"
                        >Join Waitlist</a>
                    </div>

                    <div
                        v-html="animatedThumbnailHtml"
                    ></div>

                    <br>

                    <h3 class="text-xl pb-4" style="filter: blur(15px);">Animated Thumbnail HTML</h3>
                    <code
                        class="animated-image-html block bg-gray-300 rounded p-3"
                        style="word-break: break-all; filter: blur(15px);"
                    >
                        {{ animatedThumbnailHtml }}
                    </code>

                    <div class="py-5 -mx-2" style="filter: blur(15px);">

                        <div class="inline p-3 text-blue-800">
                            <button
                                class="copy"
                                data-clipboard-target=".animated-image-html"
                            >Copy</button>
                        </div>

                    </div>


                    <br>
                    <br>
                    <br>
                </div>


            </section>

        </div>

    </div>

</template>


<script>

import ClipboardJS from 'clipboard'
// import debounce from 'just-debounce'

import {
    getAnyHost,
    getDomain
} from '~/helpers/url'

import VideoReferenceInput from './video-reference-input.vue'
import VideosForInput from './videos-for-input.vue'

const imageTemplate = ( srcset, src ) => (
`<!-- Reference Docs: https://vumbnail.com -->
<img
    srcset="
        ${ srcset }
    "
    sizes="(max-width: 640px) 100vw, 640px"
    src="${ src }"
    alt="Vimeo Thumbnail"
/>`
)

export default {
    components: {
        VideoReferenceInput,
        VideosForInput,
    },
    data () {
        return {
            videoReference: '',
            videoId: '621585396',
            showInputError: false,
            exampleVideos: [
                {
                    label: 'Making Films',
                    id: '358629078'
                },
                {
                    label: 'Dad Life',
                    id: '12714406'
                },
                {
                    label: 'City Limits',
                    id: '23237102'
                },
                {
                    label: 'Girl Walk',
                    id: '32845443'
                },
                {
                    label: 'J-Money',
                    id: '376454747'
                }
            ],
            items: [
                {
                    heading: 'JPG Example',
                    id: 'regular-image',
                    imageSrcTemplate: `/{videoId}.jpg`,
                    imageAlt: 'Regular Thumbnail Example',
                    width: 640
                },
                {
                    heading: 'JPG Large Example',
                    id: 'large-image',
                    imageSrcTemplate: `/{videoId}_large.jpg`,
                    imageAlt: 'Large Thumbnail Example',
                    width: 640
                },
                {
                    heading: 'JPG Medium Example',
                    id: 'medium-image',
                    imageSrcTemplate: `/{videoId}_medium.jpg`,
                    imageAlt: 'Medium Thumbnail Example',
                    width: 200
                },
                {
                    heading: 'JPG Small Example',
                    id: 'small-image',
                    imageSrcTemplate: `/{videoId}_small.jpg`,
                    imageAlt: 'Small Thumbnail Example',
                    width: 100
                }
            ]
        }
    },
    computed: {
        domain () {
            return getDomain()
        },
        mappedItems () {
            return this.items.map(item => {
                // console.log('item', item)
                // console.log('item.imageSrcTemplate', item.imageSrcTemplate)

                item.imageSrc = getDomain() + item.imageSrcTemplate.replace('{videoId}', this.videoId)

                return item
            })
        },
        responsiveImageHtml () {
            const src = this.mappedItems[0].imageSrc
            const srcset = this.mappedItems.map(({ imageSrc, width }) => `${imageSrc} ${width}w`).join(', \r\n        ')

            // console.log('srcset', srcset)

            return imageTemplate( srcset, src )
        },
        animatedThumbnailHtml () {
            // const src = this.mappedItems[0].imageSrc
            // const srcset = this.mappedItems.map(({ imageSrc, width }) => `${imageSrc} ${width}w`).join(', ')

            // console.log('srcset', srcset)

            return `
                <!-- You're clever. This is just filler code for now, but since you found this here's something special for you: https://forms.gle/uPY9odQvVJwmNsYj6 -->
                <video autoplay muted loop playsinline preload="none">
                    <source src="${this.domain}/media/breathtaking.mp4" type="video/mp4">
                </video>
            `
        }
    },
    methods: {
        getAnyHost,
    },
    mounted () {
        // This may break on the next render
        new ClipboardJS('.copy')
    }
}
</script>
