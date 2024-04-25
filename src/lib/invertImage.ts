export async function invertImage(base64Image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Unable to get canvas context');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];     // red
        imageData.data[i + 1] = 255 - imageData.data[i + 1]; // green
        imageData.data[i + 2] = 255 - imageData.data[i + 2]; // blue
      }

      ctx.putImageData(imageData, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };
  });
}