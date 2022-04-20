<template>

    <div class="input-container relative flex justify-center">
        <input
            ref="input"
            v-model="videoReference"
            class="border rounded-lg bg-transparent w-full max-w-xl text-2xl py-4 px-8"
            placeholder="Paste a video url or id..."

            :autofocus="autofocus"

            @input="$emit('update:videoReference', $event.target.value)"
        />
        <!-- Thumbnail Preview -->
    </div>

</template>


<script>

import urlParser from 'js-video-url-parser'
import debounce from 'just-debounce'

import {
    getProviderAndIdFromFilename,
    isValidUrl
} from '../../helpers/url.js'


let videoReferences

async function getVideoReferences () {
    if ( !videoReferences ) {
        videoReferences = await import( '../../helpers/video-references.js' )
    }

    return videoReferences
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



export default {
    props: {
        autofocus: {
            type: Boolean,
            default: false
        },
        videoReference: {
            type: String,
            default: '',
        },
    },
    emits: [
        'update:videoReference',
        'update:videoId',
        'update:showInputError',
        'update:provider',
    ],
    data () {
        return {
            // videoReference: '',
        }
    },
    computed: {
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

            if ( ! this.hasReference ) {
                return ''
            }

            if ( !this.hasSupportedReference ) {
                return ''
            }

            // If the string is a valid ID on it's own, use it.
            if ( isValidId( this.videoReference ) ) {
                return this.videoReference
            }

            const urlDetails = urlParser.parse( this.videoReference )

            return urlDetails.id
        },

        provider () {

            if ( this.videoId.length === 0 ) {
                return ''
            }

            const {
                provider
            } = getProviderAndIdFromFilename( `${ this.videoId }.jpg` )

            return provider
        },

    },

    mounted () {
        getVideoReferences()
            .then( async ({ getLatestReference }) => {
                const latestReference = await getLatestReference()

                // Paste the latest reference into the input.
                this.$refs.input.value = latestReference
                this.$emit('update:videoReference', latestReference)
            })
    },

    watch: {
        showInputError: debounce(function ( newVal ) {
            this.showInputError = newVal

            // Emit the error value.
            this.$emit('update:showInputError', newVal)
        }, 750),

        videoId ( newId ) {
            this.$emit( 'update:videoId', newId )

            if ( newId.length !== 0 ) {
                getVideoReferences()
                    .then( async ({ saveReference }) => {
                        await saveReference( this.videoReference )
                    })
            }
        },

        provider ( newProvider ) {
            this.$emit( 'update:provider', newProvider )
        },
    }

}
</script>
