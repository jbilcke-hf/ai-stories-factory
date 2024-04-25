/**
 * This merges multiple layers into one image
 * 
 * @param layersInBase64 
 * @returns 
 */
export async function mergeLayers(layersInBase64: string[]): Promise<string> {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  
  if (!ctx) { throw new Error(`couldn't get the 2D context`) }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
      });      
  };

  for (const base64Image of layersInBase64) {
      const image = await loadImage(base64Image);

      // the default is 'source-over' and it would make sense if the background is transparent,
      // but I think right now we want as a hack to use maybe 'overlay'
      // ctx.globalCompositeOperation = 'source-over';
      ctx.globalCompositeOperation = 'overlay';

      //if (!canvas.width || !canvas.height) {
          canvas.width = image.width;
          canvas.height = image.height;
      //}
      ctx.drawImage(image, 0, 0);
  }

  return canvas.toDataURL();
}