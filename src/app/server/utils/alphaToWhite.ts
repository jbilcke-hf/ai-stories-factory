import Jimp from 'jimp';

/**
 * Convert a PNG with an alpha channel to a PNG with a white background
 * 
 * this also makes sure the image is 1024x1024, as the segmentation algorithm is finicky
 * and will fail if this is not respected
 * @param dataUri 
 * @returns 
 */
export async function alphaToWhite(dataUri: string): Promise<string> {


  // strip off the "data:image/png;base64," part
  const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");
  if (!base64Data) {
    throw new Error(`invalid image, cannot convert from alpha to white background`)
  }

  // convert base64 to buffer
  const imageData = Buffer.from(base64Data, 'base64');

  // read the image using Jimp
  let img = await Jimp.read(imageData);

  img = img.background(0xFFFFFFFF).resize(1024, 1024);
  
  return new Promise((resolve, reject) => {
    img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      if (err) reject(err);
      else resolve(`data:${Jimp.MIME_PNG};base64,${buffer.toString('base64')}`);
    });
  });
}