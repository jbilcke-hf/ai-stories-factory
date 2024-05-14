export async function logImage(uri: string, scale = 1.0): Promise<void> {
  // Create an image element
  const img = new Image();
  
  // Load the image asynchronously
  img.src = uri;
  await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (error) => reject(error);
  });

  // Get the image dimensions
  let { width, height } = img;
  width *= scale
  height *= scale

  // Log the image in the console
  console.log(
      "%c+",
      `font-size: 1px; padding: ${Math.floor(height / 4)}px ${Math.floor(width / 2)}px; line-height: ${Math.round(height * 0.52)}px; background: url('${uri}'); background-size: ${width}px ${height}px; background-repeat: no-repeat; color: transparent;`
  );
}

(async function() {

  if (typeof window !== "undefined") {
    // Add the logImage function to the console object
    (console as any).image = logImage;
    
    // Example usage
    // console.image('https://example.com/path/to/your/image.jpg');
  }
})()
