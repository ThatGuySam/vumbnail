<template>

    <div
        class="flex items-center flex-col px-6"
    >

        <div
            class="w-full max-w-3xl py-16"
        >

            <section class="text-center pb-16">
                A quick way to get Vimeo Thumbnails with just an ID. 
            </section>

            <section class="flex flex-col justify-center text-center max-w-3xl pb-16">

                <label>
                    <h3 class="sr-only">
                        Enter your Video URL or ID
                    </h3>
                    <input
                        v-model="videoReference"
                        class="border rounded bg-transparent w-full max-w-xl text-2xl py-4 px-8"
                        placeholder="Paste a video url or id..."
                        autofocus
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
                        <h2
                            id="animated-image"
                            class="text-4xl"
                        >Coming Soon - Animated Thumbnail Example</h2>
                        <h4 class="text-xl">An animated preview thumbnail of the Vimeo video. </h4>
                        <a
                            class="inline-block bg-transparent hover:bg-gray-500 font-semibold hover:text-white border border-gray-500 hover:border-transparent rounded py-2 px-4 my-3"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeFU6f19pAEJMI8yJYOzGIV8y8Sg5NvSnaM6tXz83VtvZeU7Q/viewform?usp=pp_url&entry.5778473=Animated+Thumbnails"
                        >Get Notified</a>
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

        <footer
            class="w-full py-8"
            style="max-width: 960px;"
        >
            <ul class="flex">
                <li class="mr-6">
                    <a class="text-blue-500 hover:text-blue-800" href="https://github.com/ThatGuySam/vimeo-thumbnail-server/discussions">Help</a>
                </li>
            </ul>
        </footer>

    </div>

</template>


<script>

import ClipboardJS from 'clipboard'
import urlParser from 'js-video-url-parser'
import debounce from 'just-debounce'


function isValidUrl ( maybeUrl ) {
    try {
        const url = new URL( maybeUrl )

        return true
    } catch ( error ) {
        return false
    }
}

function isSupportedVideoUrl ( maybeUrl ) {
    if ( ! isValidUrl( maybeUrl ) ) {
        return false
    }

    // https://github.com/Zod-/jsVideoUrlParser#readme
    const urlDetails = urlParser.parse( maybeUrl )

    const supportedProviders = [
        'youtube',
        'vimeo',
    ]

    try {
        return supportedProviders.includes( urlDetails.provider )
    } catch ( error ) {
        return false
    }
}

function isValidId ( maybeId ) {
    const isCorrectLength = maybeId.length >= 8
    const isAlphanumeric = /^[a-zA-Z0-9]+$/i.test( maybeId )

    return isCorrectLength && isAlphanumeric
}

function getAnyHost ( maybeUrl ) {
    if ( !isValidUrl ( maybeUrl ) ) {
        return ''
    }

    const url = new URL( maybeUrl )

    return url.host
}

function getDomain () {

    if ( typeof window !== 'undefined' ) {
        return `${window.location.protocol}//${window.location.host}`
    }

    if ( typeof import.meta.env.VITE_VERCEL_URL === 'string' ) {
        return `https://${ import.meta.env.VITE_VERCEL_URL }`
    }

    return `https://vumbnail.com`
}

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
    data () {
        return {
            videoReference: '',
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
        hasReference () {
            return this.videoReference.trim().length > 0
        }, 
        hasSupportedReference () {
            
            // Are the first 8 characters alphanumeric? 
            // If not, it's probably a URL.
            if ( isValidId( this.videoReference ) ) {
                return true
            }

            return isSupportedVideoUrl( this.videoReference )
        },
        showInputError () {
            return this.hasReference && !this.hasSupportedReference
        },
        videoId () {
            const defaultId = this.exampleVideos[Math.floor(Math.random() * this.exampleVideos.length)].id// '358629078'

            if ( ! this.hasReference ) {
                return defaultId
            }

            if ( !this.hasSupportedReference ) {
                return defaultId
            }

            // If the srting is a valid ID on it's own, use it.
            if ( isValidId( this.videoReference ) ) {
                return this.videoReference
            }

            const urlDetails = urlParser.parse( this.videoReference )

            return urlDetails.id
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
        // copyImageUrl ( event ) {
        //     const { copyUrl } = event.target.dataset

        //     console.log('Copying', copyUrl)
        //     const clipboard = new ClipboardJS(event.target, {
        //         // text: (trigger) => {
        //         //     return copyUrl
        //         // }
        //     })

        //     // clipboard.target(event.target)

        //     clipboard.action('copy')

        //     console.log('clipboard', clipboard)

        // }
    },
    mounted () {
        // This may break on the next render
        new ClipboardJS('.copy')
    },
    watch: {
        showInputError: debounce(function (newVal) {
            this.showInputError = newVal
        }, 750)
    }
}
</script>
