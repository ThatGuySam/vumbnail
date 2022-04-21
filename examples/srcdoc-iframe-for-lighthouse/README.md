# How to fix Reduce unused JavaScript on YouTube Videos

In this article we go through fixing YouTube Lighthouse issues using a Src Embed.

When optimizing for PageSpeed with tools like Google Lighthouse it can be challenging to get all the parts optimized, but it can be especially frustrating when you're being held back by a page you have no control of, such as  a video embedded in an iframe.

Some common Lighthouse errors for YouTube include:

- Reduce unused JavaScript
- Reduce the impact of third-party code
- Some third-party resources can be lazy loaded with a facade
- Does not use passive listeners to improve scrolling performance
- Reduce JavaScript execution time
- Serve static assets with an efficient cache policy (For YouTube thumbnails)
- Avoid long main-thread tasks

## Enter the Src Embed

There is a trick I like to call a Src Embed the uses a little known attribute for iframes called ["srcdoc"](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc)

This attribute allows us to prefill an iframe with text and html instead of loading another page.

Now this won't give us a YouTube Video however it does let us *link* the video from within our iframe, then, when the link is clicked the full Embeddable YouTube page will be loaded.

This also offers better performance than Lazy Loading since there is no additional JavaScript required.

The code can be kind of verbose so I've setup a simple Embed Builder you can use the generate the code from a YouTube or Vimeo URL:
[Src Embed Builder](https://vumbnail.com/embed-builder)

So without further ado, here's the code:

[Open on CodePen](https://codepen.io/ThatGuySam/pen/rNpvrQg)

```html
<!-- Reference: https://vumbnail.com/examples/srcdoc-iframe-for-lighthouse -->
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
            href='https://www.youtube.com/embed/d1vBNOiRyEI?autoplay=1'
            class='full'
        >
            <img
                src='https://vumbnail.com/d1vBNOiRyEI.jpg'
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
></iframe>
```

This also works for any embed that uses an iframe, such as Vimeo, an embeded slide presentation, or an iframe chat embed.

## Disadvantages

Although this method delivers better load performance than lazy loading, one of it's disadvatages is that sometimes the YouTube player does not autoplay due to [Media Playback policies](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide), meaning that users will need to manually click the video a second time to start playback if the browser thinks your site shouldn't be allowed to autoplay videos yet.

This is mostly relevant for your users that are only going to play videos on your site once or twice, since the browser starts allowing autoplay after the user manually starts autoplay a few times.

One work around is auto-loading the video on hover by simulating a click on the `a` link tag with `onmouseover='this.click()'` like so:

```html
...
<a
    href='https://www.youtube.com/embed/d1vBNOiRyEI?autoplay=1'
    class='full'
    onmouseover='this.click()'
>
    ...
</a>
...
```

Have fun passing Core Web Vitals!

If you need help reach out in on [GitHub](https://github.com/ThatGuySam/vumbnail/discussions).
