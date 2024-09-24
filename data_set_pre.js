const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


const inputDir = './test/img';  
const outputDir = './output_images'; 


if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}


const processImages = async () => {
    try {
        // Read all files in the input directory
        const files = fs.readdirSync(inputDir);

        for (const file of files) {
            const filePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            // Process the image with sharp (you can adjust options as needed)
            await sharp(filePath)
                .resize(256, 256) // Resize to 256x256 pixels
                .toFile(outputFilePath);

            console.log(`Processed: ${file}`);
        }
        
        console.log('All images processed successfully!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
};

// Run the function to process images
processImages();
