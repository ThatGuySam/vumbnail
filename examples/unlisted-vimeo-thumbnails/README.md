<!-- Syntax Languages - https://github.com/github/linguist/blob/master/vendor/README.md -->
# How to show Unlisted Vimeo Thumbnails with Vumbnail

This example shows how to get thumbnails for Unlisted Vimeo videos that require an extra secret url part.

Keep in mind that your video secret will be visible to anyone who can view you app code or see requests made.

## URL Example

```nim
https://vumbnail.com/692839122:3144c3edfc.jpg
```

## Usage Examples

<details open>
    <summary>HTML</summary>

```html
<!-- Unlisted Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails -->
<img
    srcset="
        https://vumbnail.com/692839122:3144c3edfc_large.jpg 640w,
        https://vumbnail.com/692839122:3144c3edfc_medium.jpg 200w,
        https://vumbnail.com/692839122:3144c3edfc_small.jpg 100w
    "
    sizes="(max-width: 640px) 100vw, 640px"
    src="https://vumbnail.com/692839122:3144c3edfc.jpg"
/>
```

</details>
<details>
    <summary>React</summary>

```jsx
{ /* Unlisted Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails --> */ }
    <img
        srcSet={`
        https://vumbnail.com/692839122:3144c3edfc_large.jpg 640w,
        https://vumbnail.com/692839122:3144c3edfc_medium.jpg 200w,
        https://vumbnail.com/692839122:3144c3edfc_small.jpg 100w
    `}
        sizes="(max-width: 640px) 100vw, 640px"
        src="https://vumbnail.com/692839122:3144c3edfc.jpg"
    />
```

</details>
<details>
    <summary>React Native</summary>

```javascript
// Unlisted Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
import * as React from 'react'
import { Image } from 'react-native'

export default () => (
    <Image
        style={{ width: 320, height: 180 }}
        source={{
            uri: 'https://vumbnail.com/692839122:3144c3edfc.jpg',
        }}
    />
)
```

</details>
<details>
    <summary>Swift</summary>

```swift
// Unlisted Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
let url = URL(string: 'https://vumbnail.com/692839122:3144c3edfc.jpg')

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
// Unlisted Thumbnails Reference - https://vumbnail.com/examples/unlisted-vimeo-thumbnails
Image.network(
    'https://vumbnail.com/692839122:3144c3edfc.jpg',
)
```

</details>

If you need help reach out in on [GitHub](https://github.com/ThatGuySam/vumbnail/discussions).
