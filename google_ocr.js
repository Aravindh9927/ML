
const vision = require('@google-cloud/vision');


const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/aravindhv/Documents/generate_yolo_trainings/.venv/stickersheet-extractor-key.json', 
});


const fileName = 'test/Image_2.jpeg';


async function detectText() {
  try {
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    console.log('Text detections:');
    detections.forEach(text => console.log(text.description));
  } catch (error) {
    console.error('ERROR:', error);
  }
}


detectText();
