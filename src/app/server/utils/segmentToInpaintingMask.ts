"use server"

import Jimp from 'jimp';

/**
 * Converts a segment mask (colored pixels over white)
 * into an inpainting mask (black pixels over white)
 * 
 * @param pngBase64 
 * @returns 
 */
export async function segmentToInpaintingMask(pngBase64: string) {
    const black = 0x00000000;
    const white = 0xFFFFFFFF;

    // strip off the "data:image/png;base64," part
    const base64Data = pngBase64.replace(/^data:image\/\w+;base64,/, "");

    // convert base64 to buffer
    const imageData = Buffer.from(base64Data, 'base64');

    // read the image using Jimp
    const image = await Jimp.read(imageData);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const currentColor = image.getPixelColor(x, y);
        if (currentColor !== white) {
            image.bitmap.data[idx] = black;
        }
    });

    // get base64 data
    const base64Image = await image.getBase64Async(Jimp.MIME_PNG);
    return "data:image/png;base64," + base64Image.split(",")[1];
}