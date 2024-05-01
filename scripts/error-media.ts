import process from 'node:process'
import fs from 'fs-extra'
import sharp from 'sharp'
import pathToFfmpeg from 'ffmpeg-static'
import { execa } from 'execa'

import {
    errorMedia,
    svgTemplate,
} from '../helpers/send-response.js'

const {
    svg,
    png,
    mp4,
} = errorMedia

;( async () => {
    // Write SVG Error image
    console.log( 'Writing SVG image' )
    await fs.writeFile(
        svg.path,
        svgTemplate(),
    )

    // Generate png from svg
    console.log( 'Generating png from svg' )
    await sharp( svg.path )
        .resize( png.width, png.height )
        // https://github.com/lovell/sharp/blob/83bb6a45542cbced5d68a258070f256f6ca8cee3/docs/api-channel.md#examples
        .removeAlpha()
        .toFile( png.path )

    // Build error video from error svg
    // ffmpeg -r 1 -f image2 -s 1920x1080 -i error.svg -vcodec libx264 -crf 25  -pix_fmt yuv420p error.mp4
    // https://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/
    const ffmpegArgs = [
        '-r',
        '1',
        '-f',
        'image2',
        '-s',
        `${ mp4.width }x${ mp4.height }`,
        '-i',
        png.path,
        '-vcodec',
        'libx264',
        '-crf',
        '25',
        '-pix_fmt',
        'yuv420p',
        mp4.path,
    ]

    console.log( 'Generating mp4 from png' )
    // Delete mp4 file if it exists
    if ( fs.existsSync( mp4.path ) ) {
        fs.unlinkSync( mp4.path )
    }

    // Generate mp4 from png
    await execa( String( pathToFfmpeg ), ffmpegArgs )

    console.log( 'Files generated successfully!' )

    process.exit()
} )()
