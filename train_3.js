const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');  // Import tesseract.js

const inputDir = './test/img';  
const outputDir = './output_images'; 

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const processImages = async () => {
    try {
        const files = fs.readdirSync(inputDir);

        for (const file of files) {
            const filePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            // Resize the image with sharp
            await sharp(filePath)
                .resize(256, 256)  // Resize to 256x256 pixels
                .toFile(outputFilePath);

            console.log(`Processed: ${file}`);

            // Extract text using Tesseract OCR
            const { data: { text } } = await Tesseract.recognize(outputFilePath, 'eng', {
                logger: (m) => console.log(m),  // Optional logger to track progress
            });

            console.log(`Extracted text from ${file}:`);
            console.log(text);  // Print the extracted text
        }
        
        console.log('All images processed and OCR completed successfully!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
};

// Run the function to process images and extract text
processImages();
