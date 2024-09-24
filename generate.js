const { exec } = require('child_process');
const path = require('path');

// Function to run a shell command
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Output: ${stdout}`);
            resolve(stdout);
        });
    });
}

// Paths for your image and output
const imagePath = path.join(__dirname, 'train-image.tif');  // Replace with your image file path
const outputBaseName = path.join(__dirname, 'train-output');

// Step 1: Run Tesseract to generate .tr file
async function generateTrFile() {
    try {
        const command = `tesseract ${imagePath} ${outputBaseName} box.train`;
        await runCommand(command);
        console.log("Training file (.tr) created.");
    } catch (error) {
        console.error("Error generating .tr file.");
    }
}

// Execute the function
generateTrFile();