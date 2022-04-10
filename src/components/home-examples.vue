<template>

    <div
        id="app"
        class="flex items-center flex-col px-6"
    >
        
        <nav
            class="w-full py-8"
            style="max-width: 960px;"
        >
            <ul class="flex">
                <li class="mr-6">
                  <a class="font-bold text-blue-500 hover:text-blue-800" href="/">Vumbnail</a>
                </li>
                <li class="mr-6">
                    <a class="text-blue-500 hover:text-blue-800" href="#responsive-image">Examples</a>
                </li>
                
                <!--
                <li class="mr-6">
                    <a class="text-blue-500 hover:text-blue-800" href="#medium-image">Medium Example</a>
                </li>
                <li class="mr-6">
                    <a class="text-blue-500 hover:text-blue-800" href="#small-image">Small Example</a>
                </li> -->
                <li class="mr-6">
                  <a class="text-blue-500 hover:text-blue-800" href="https://docs.google.com/forms/d/e/1FAIpQLSeFU6f19pAEJMI8yJYOzGIV8y8Sg5NvSnaM6tXz83VtvZeU7Q/viewform?usp=sf_link">Send me updates</a>
                </li>

                <li class="mr-6">
                    <a class="text-blue-500 hover:text-blue-800" href="https://github.com/ThatGuySam/vimeo-thumbnail-server/discussions">Help</a>
                </li>
            </ul>
        </nav>

        <main
            class="w-full py-16"
            style="max-width: 960px;"
        >

            <section class="text-center pb-16">
                A quick way to get Vimeo Thumbnails with just an ID. 
            </section>

            <section class="flex justify-center text-center pb-16">
                <div>

                    <label>
                        <h3 class="pb-3">
                            Enter your Vimeo Video ID
                        </h3>
                        <input
                            v-model="vimeoId"
                            class="border rounded bg-transparent p-3"
                            focus
                        />
                    </label>

                    <div class="example-videos py-5">
                        <h3 class="pb-3">
                            Example Videos
                        </h3>
                        <div class="button-group px-4">
                            <button
                                v-for="video in exampleVideos"
                                :key="video.id"
                                class="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white border border-gray-500 hover:border-transparent rounded py-2 px-4 mx-3"
                                @click="vimeoId = video.id"
                            >{{ video.label }}</button>
                        </div>
                    </div>

                </div>
            </section>
    
    
            <section class="pb-16">
                <div
                    class="pb-16"
                >
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
                        class="responsive-image-html whitespace-pre block border rounded p-3"
                    >
                        {{ responsiveImageHtml }}
                    </code>

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

        </main>

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


function getDomain () {

    if ( typeof window !== 'undefined' ) {
        return `${window.location.protocol}//${window.location.host}`
    }

    return `https://${ import.meta.env.VITE_VERCEL_URL }`
}

const imageTemplate = ( srcset, src ) => (
`<!-- Reference Docs: https://vumbnail.com -->
<img
    srcset="
        ${srcset}
    "
    sizes="(max-width: 640px) 100vw, 640px"
    src="${src}"
    alt="Vimeo Thumbnail"
/>`
)

export default {
    data () {
        return {
            vimeoId: '358629078',
            exampleVideos: [
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
                }
            ],
            items: [
                {
                    heading: 'JPG Example',
                    id: 'regular-image',
                    imageSrcTemplate: `/{vimeoId}.jpg`,
                    imageAlt: 'Regular Thumbnail Example',
                    width: 640
                },
                {
                    heading: 'JPG Large Example',
                    id: 'large-image',
                    imageSrcTemplate: `/{vimeoId}_large.jpg`,
                    imageAlt: 'Large Thumbnail Example',
                    width: 640
                },
                {
                    heading: 'JPG Medium Example',
                    id: 'medium-image',
                    imageSrcTemplate: `/{vimeoId}_medium.jpg`,
                    imageAlt: 'Medium Thumbnail Example',
                    width: 200
                },
                {
                    heading: 'JPG Small Example',
                    id: 'small-image',
                    imageSrcTemplate: `/{vimeoId}_small.jpg`,
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

                item.imageSrc = getDomain() + item.imageSrcTemplate.replace('{vimeoId}', this.vimeoId)

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
    }
}
</script>
