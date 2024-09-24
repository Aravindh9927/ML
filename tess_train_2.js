const tesseract = require('tesseract.js');
const axios = require('axios');
const Jimp = require('jimp');

// Function to perform object detection using a YOLO API
async function detectTextRegions(imagePath) {
    // Assuming you have a Python YOLO server running locally or an API
    const yoloApiUrl = 'http://localhost:5000/detect';  // Replace with your YOLO API URL
    const image = await Jimp.read(imagePath);
    const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // Send the image to the YOLO API for detection
    const response = await axios.post(yoloApiUrl, imageBuffer, {
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    });

    // Get the bounding boxes from the YOLO response (e.g., [{x1, y1, x2, y2, class}])
    return response.data.textRegions;
}

// Function to extract text from detected regions using Tesseract.js
async function extractTextFromRegions(imagePath, textRegions) {
    const image = await Jimp.read(imagePath);
    let texts = [];

    for (const region of textRegions) {
        const { x1, y1, x2, y2 } = region;
        
        // Crop the detected region
        const croppedRegion = image.clone().crop(x1, y1, x2 - x1, y2 - y1);

        // Save the cropped region to a buffer
        const buffer = await croppedRegion.getBufferAsync(Jimp.MIME_JPEG);

        // Run Tesseract OCR on the cropped region
        const { data: { text } } = await tesseract.recognize(buffer, 'eng');
        texts.push(text);
    }

    return texts;
}

// Main function to run YOLO and Tesseract OCR
async function runYoloAndTesseract(imagePath) {
    try {
        // Detect text regions using YOLO API
        const textRegions = await detectTextRegions(imagePath);

        // Extract text from the detected regions using Tesseract
        const extractedTexts = await extractTextFromRegions(imagePath, textRegions);

        // Output the extracted texts
        extractedTexts.forEach((text, index) => {
            console.log(`Text region ${index + 1}: ${text}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
const imagePath = 'data/sample_image.jpg';  // Replace with your image path
runYoloAndTesseract(imagePath);
