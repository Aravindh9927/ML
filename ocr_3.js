const Tesseract = require('tesseract.js');
 
/**
* Function to extract the serial number from an image.
* @param {string} imagePath - Path to the image file.
* @returns {Promise<string|null>} - The extracted serial number or null if not found.
*/
const extractSerialNumber = async (imagePath) => {
    try {
       
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'test/img/img_1/Image_.traineddata', 
            {
                logger: info => console.log(info) 
            }
        );
 
       
        const regex = /Serial Number:\s*(\S+)/i; 
        const match = text.match(regex);
 
        if (match) {
            console.log(`Extracted Serial Number: ${match[1]}`); 
            return match[1]; 
        } else {
            console.log('No serial number found.'); 
            return null; 
        }
    } catch (error) {
        console.error('Error:', error); 
    }
};
 

const imagePath = 'test/img/img_1/Image_1.jpg'; 
extractSerialNumber(imagePath);