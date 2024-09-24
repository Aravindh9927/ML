const sharp = require("sharp");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const { YOLO } = require("ultralytics"); 


async function loadYoloModel() {
  const model = new YOLO('yolov8n.pt');  
  return model;
}


async function detectObjects(imagePath) {
  const model = await loadYoloModel();
  const results = await model.predict(imagePath);
  
  
  const yoloResults = results.boxes.map(box => ({
    x: Math.round(box.xmin),
    y: Math.round(box.ymin),
    width: Math.round(box.xmax - box.xmin),
    height: Math.round(box.ymax - box.ymin),
    className: results.names[box.cls]  
  }));
  
  return yoloResults;
}


async function performOCR(yoloResults, imagePath) {
  try {
    for (const obj of yoloResults) {
      const { x, y, width, height, className } = obj;

     
      const croppedImagePath = `cropped_${className}.png`;

      
      await sharp(imagePath)
        .extract({ left: x, top: y, width, height })
        .toFile(croppedImagePath);

      
      Tesseract.recognize(croppedImagePath, "eng", {
        logger: (m) => console.log(m),  // Log progress
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


async function main() {
  const imagePath = "test/Image_2.jpeg";
  
  
  const yoloResults = await detectObjects(imagePath);
  
  
  await performOCR(yoloResults, imagePath);
}


main().catch(err => console.error(err));
