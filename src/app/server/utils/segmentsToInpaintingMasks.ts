import Jimp from "jimp"

import { SemanticLayer, SemanticLayers } from "@/lib/config"

import { SegmentationResults } from "../segment"

function getEuclideanDistance(color1: number[], color2: number[]): number {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

export async function segmentsToInpaintingMasks(segmentationResults: SegmentationResults): Promise<SemanticLayers> {
  const image = await Jimp.read(Buffer.from(segmentationResults.bitmap.replace(/^data:image\/\w+;base64,/, ""), 'base64'));

  const resultImages: Partial<Record<SemanticLayer, Jimp>> = {}
    // Convert all result images to base64 strings
    const base64Images: SemanticLayers = {}

  for (let layer in segmentationResults.data) {
    resultImages[layer as SemanticLayer] = new Jimp(image)
    base64Images[layer as SemanticLayer] = ""
  }

  // Iterate through each pixel in the image
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    // Get the color of the current pixel
    const color = Jimp.intToRGBA(image.getPixelColor(x, y));
    const currentColor = [color.r / 255, color.g / 255, color.b / 255];

    // Determine which category the color belongs to
    let minDistance = Infinity;
    let closestLayer: SemanticLayer | null = null;

    for (let layer in segmentationResults.data) {
      const layerColor = segmentationResults.data[layer as SemanticLayer]!.color;
      const distance = getEuclideanDistance(currentColor, layerColor);

      if(distance < minDistance) {
        minDistance = distance;
        closestLayer = layer as SemanticLayer;
      }
    };

    if (!closestLayer) {
      return;
    }

    // Set the color of the pixel in the corresponding result image to black, and white in others
    for (let layer in resultImages) {
      // used to guarantee the !.bitmap
      if (!resultImages[layer as SemanticLayer]?.bitmap) {
        continue
      }

      for (let i = 0; i < 4; i++) {
        if (layer === closestLayer) {
          if(i < 3)
            resultImages[layer as SemanticLayer]!.bitmap.data[idx + i] = 0x00; // set rgb channels to black
          else
            resultImages[layer as SemanticLayer]!.bitmap.data[idx + i] = 0xFF; // set alpha channel to maximum
        } else {
          resultImages[layer as SemanticLayer]!.bitmap.data[idx + i] = 0xFF;   // set rgba channels to white
        }
      }
    }
  });

  // Convert all result images to base64 strings
  for (let layer in resultImages) {
    const base64Image = await resultImages[layer as SemanticLayer]!.getBase64Async(Jimp.MIME_PNG);
    base64Images[layer as SemanticLayer] = "data:image/png;base64," + base64Image.split(",")[1];
  }

  return base64Images;
}