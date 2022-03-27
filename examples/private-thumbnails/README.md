# How to show Unlisted Vimeo Thumbnails with Vumbnail

This example shows how to get thumbnails for Unlisted Vimeo Thumbnails that require an extra secret url part.

Keep in mind that your video secret will be visible to anyone who can view you app code or see requests made.

```css
https://vumbnail.com/692839122:3144c3edfc.jpg
```

<details open>
    <summary>HTML</summary>

```html
    <!--  -->
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
<details open>
    <summary>Swift</summary>

```swift
    let url = URL(string: 'https://vumbnail.com/692839122:3144c3edfc.jpg')

    DispatchQueue.global().async {
        let data = try? Data(contentsOf: url!)
        DispatchQueue.main.async {
            imageView.image = UIImage(data: data!)
        }
    }
```

</details>
