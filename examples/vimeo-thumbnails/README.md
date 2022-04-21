<!-- Syntax Languages - https://github.com/github/linguist/blob/master/vendor/README.md -->
# How to show Vimeo Thumbnails with Vumbnail

This example shows how to get thumbnails for Vimeo videos with the video id of your video.

This means you don't need to make an intial extra request to get the thumbnails urls for your video first.

## URL Example

```css
https://vumbnail.com/376454747.jpg
```

## Usage Examples

<details open>
    <summary>HTML</summary>

```html
<!-- Vimeo Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails -->
<img 
    srcset="
        https://vumbnail.com/376454747_large.jpg 640w, 
        https://vumbnail.com/376454747_medium.jpg 200w, 
        https://vumbnail.com/376454747_small.jpg 100w
    " 
    sizes="(max-width: 640px) 100vw, 640px" 
    src="https://vumbnail.com/376454747.jpg" 
/>
```

</details>
<details>
    <summary>React</summary>

```jsx
{/* Vimeo Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails --> */}
<img 
    srcSet={`
        https://vumbnail.com/376454747_large.jpg 640w, 
        https://vumbnail.com/376454747_medium.jpg 200w, 
        https://vumbnail.com/376454747_small.jpg 100w
    `} 
    sizes='(max-width: 640px) 100vw, 640px' 
    src='https://vumbnail.com/376454747.jpg' 
/>
```

</details>
<details>
    <summary>React Native</summary>

```javascript
// Vimeo Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
import * as React from 'react'
import { Image } from 'react-native'

export default () => (
    <Image 
        style={{ width: 320, height: 180 }}
        source={{
            uri: 'https://vumbnail.com/376454747.jpg',
        }}
    />
)
```

</details>
<details>
    <summary>Swift</summary>

```swift
// Vimeo Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
let url = URL(string: 'https://vumbnail.com/376454747.jpg')

DispatchQueue.global().async {
    let data = try? Data(contentsOf: url!)
    DispatchQueue.main.async {
        imageView.image = UIImage(data: data!)
    }
}
```

</details>
<details>
    <summary>Flutter</summary>

```dart
// Vimeo Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
Image.network(
    'https://vumbnail.com/376454747.jpg',
)
```

</details>

If you need help reach out in on [GitHub](https://github.com/ThatGuySam/vumbnail/discussions).
