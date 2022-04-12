<!-- Syntax Languages - https://github.com/github/linguist/blob/master/vendor/README.md -->
# How to show Youtube Thumbnails with Vumbnail

> This example shows how to get thumbnails for Youtube videos.

Keep in mind you can also get Youtube Thumbnails directly from [Youtube](https://stackoverflow.com/a/20542029/1397641), this just provides an alternative method with a simpler structure and may deliver better performance in certain contexts.

## URL Example
```css
https://vumbnail.com/W2EMHNhyEnQ.jpg
```
For the Youtube URL https://www.youtube.com/watch?v=W2EMHNhyEnQ

## Usage Examples

<details open>
    <summary>HTML</summary>

```html
<!-- Youtube Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails -->
<img 
    srcset="
        https://vumbnail.com/W2EMHNhyEnQ_large.jpg 640w, 
        https://vumbnail.com/W2EMHNhyEnQ_medium.jpg 200w, 
        https://vumbnail.com/W2EMHNhyEnQ_small.jpg 100w
    " 
    sizes="(max-width: 640px) 100vw, 640px" 
    src="https://vumbnail.com/W2EMHNhyEnQ.jpg" 
/>
```

</details>
<details>
    <summary>React</summary>

```jsx
{/* Youtube Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails --> */}
<img 
    srcSet={`
        https://vumbnail.com/W2EMHNhyEnQ_large.jpg 640w, 
        https://vumbnail.com/W2EMHNhyEnQ_medium.jpg 200w, 
        https://vumbnail.com/W2EMHNhyEnQ_small.jpg 100w
    `} 
    sizes='(max-width: 640px) 100vw, 640px' 
    src='https://vumbnail.com/W2EMHNhyEnQ.jpg' 
/>
```

</details>
<details>
    <summary>React Native</summary>

```javascript
// Youtube Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails
import * as React from 'react'
import { Image } from 'react-native'

export default () => (
    <Image 
        style={{ width: 320, height: 180 }}
        source={{
            uri: 'https://vumbnail.com/W2EMHNhyEnQ.jpg',
        }}
    />
)
```

</details>
<details>
    <summary>Swift</summary>

```swift
// Youtube Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails
let url = URL(string: 'https://vumbnail.com/W2EMHNhyEnQ.jpg')

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
// Youtube Thumbnails Reference - https://vumbnail.com/examples/youtube-thumbnails
Image.network(
    'https://vumbnail.com/W2EMHNhyEnQ.jpg',
)
```

</details>
