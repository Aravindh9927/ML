const sharp = require("sharp");
const Tesseract = require("tesseract.js");
const fs = require("fs");

async function performOCR(yoloResults, imagePath) {
  try {
    for (const obj of yoloResults) {
      const { x, y, width, height, className } = obj;

      const croppedImagePath = `cropped_${className}.png`;

      await sharp(imagePath)
        .extract({ left: x, top: y, width, height })
        .toFile(croppedImagePath);

      Tesseract.recognize(croppedImagePath, "eng", {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          console.log(`Detected text for ${className}:`, text);

          fs.unlinkSync(croppedImagePath);
        })
        .catch((err) => {
          console.error("Error during OCR:", err);
        });
    }
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

const yoloResults = [
  { x: 750, y: 1000, width: 750, height: 1500, className: "object1" },
];

const imagePath = "test/Image_2.jpeg";

performOCR(yoloResults, imagePath);
