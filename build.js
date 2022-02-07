import fs from 'fs-extra'
import sharp from 'sharp'
import pathToFfmpeg from 'ffmpeg-static'
import { execa } from 'execa'

import { svgTemplate } from './helpers/send-response.js'


const errorSvgPath = './public/media/error.svg'
const errorPngPath = './public/media/error.png'
const errorMp4Path = './public/media/error.mp4'

const defaultWidth = 640
const defaultHeight = 360


// Write SVG Error image
await fs.writeFile(
    errorSvgPath,
    svgTemplate()
)

// Generate png from svg
await sharp( errorSvgPath )
    .resize(defaultWidth, defaultHeight)
    .removeAlpha()
    .toFile( errorPngPath )

// Build error video from error svg
// ffmpeg -r 1 -f image2 -s 1920x1080 -i error.svg -vcodec libx264 -crf 25  -pix_fmt yuv420p error.mp4
// https://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/
const ffmpegArgs = [ 
    '-r',
    '1', 
    '-f', 
    'image2',
    '-s', 
    `${ defaultWidth }x${ defaultHeight }`,
    '-i',
    errorPngPath, 
    '-vcodec', 
    'libx264', 
    '-crf', 
    '25', 
    '-pix_fmt', 
    'yuv420p',
    errorMp4Path
]

// Run command
await execa( pathToFfmpeg, ffmpegArgs )