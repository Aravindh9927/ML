const Tesseract = require('tesseract.js');
const fs = require('fs');
const sharp = require('sharp');

// Load the image
const imagePath = 'test/Image_4.jpeg';
const imageBuffer = fs.readFileSync(imagePath);

// Perform OCR using Tesseract.js
Tesseract.recognize(
  imageBuffer,
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(`OCR results for ${imagePath}:`);
  console.log(text);
})
.catch(err => console.error(err));

// Draw a rectangle around the entire image (not bounding boxes, as Tesseract.js doesn't provide them)
sharp(imagePath)
  .modulate({
    r: 0,
    g: 0,
    b: 0
  })
  .toFormat('png')
  .toBuffer((err, buffer) => {
    if (err) {
      console.error(err);
    } else {
      // Save the image with the rectangle
      fs.writeFileSync('test/image_1_with_rectangle.png', buffer);
    }
  });