import fs from 'fs-extra'
import sharp from 'sharp'
import pathToFfmpeg from 'ffmpeg-static'
import { execa } from 'execa'

import { 
    svgTemplate, 
    errorMedia
} from './helpers/send-response.js'


const {
    svg,
    png,
    mp4
} = errorMedia


// Write SVG Error image
await fs.writeFile(
    svg.path,
    svgTemplate()
)

// Generate png from svg
await sharp( svg.path )
    .resize( png.width, png.height )
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
    mp4.path
]

// Run command
await execa( pathToFfmpeg, ffmpegArgs )