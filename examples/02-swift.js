export const title = 'Swift'

export function template ( options = {} ) {
    return `
let url = URL(string: 'https://vumbnail.com/${ options.videoId }.jpg')

DispatchQueue.global().async {
    let data = try? Data(contentsOf: url!)
    DispatchQueue.main.async {
        imageView.image = UIImage(data: data!)
    }
}
`
}
