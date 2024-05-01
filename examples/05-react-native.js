// Embed - https://codepen.io/ThatGuySam/pen/abVWjzp
// Expo Snack - https://snack.expo.dev/@thatguysam/vumbnail-react-native-demo
// Expo Snack Embeddind Docs - https://docs.expo.dev/workflow/snack/#embed-it-on-your-website

export const title = 'React Native'

export const description = 'Vumbnail example for embedding iamge in React Native'

export class ReactNativeExample {
    constructor(options = {}) {
        this.videoId = options.videoId
    }

    title = title

    description = description

    template() {
        return `
import * as React from 'react';
import { Image } from 'react-native'

<Image 
    style={{ width: 320, height: 180 }}
    source={{
        uri: 'https://vumbnail.com/${this.videoId}.jpg',
    }}
/>
        `
    }

    embedHtml() {
        const encodeTitle = encodeURIComponent(this.title)
        const encodeDescription = encodeURIComponent(this.description)
        const encodedExampleCode = encodeURIComponent(this.template())

        return /* html */`
        <div
            data-snack-code="${encodedExampleCode}"
            data-snack-dependencies="expo-constants%2Clodash%404"
            data-snack-name="${encodeTitle}"
            data-snack-description="${encodeDescription}"
            data-snack-preview="true"
            data-snack-platform="web"
            style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.08);border-radius:4px;height:505px;width:100%">
        </div>
        `
    }

    embedScript() {
        return {
            async: true,
            src = 'https://snack.expo.dev/embed.js',
        }
    }
}
