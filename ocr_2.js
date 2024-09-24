const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

const directoryPath = "test/img";

const processImage = (imagePath) => {
  Tesseract.recognize(imagePath, "eng", {
    logger: (info) => console.log(info),
    page: 1,
  })
    .then(({ data: { text } }) => {
      const serialNumberRegex = /\b(?=.{7})[0-9A-Fa-fSs]{7}\b|\b\d{7}\b/g;
      const serialNumbers = text.match(serialNumberRegex);
      const outputFileName =
        path.basename(imagePath, path.extname(imagePath)) +
        "_serial_numbers.txt";
      if (serialNumbers) {
        const uniqueSerialNumbers = [...new Set(serialNumbers)];
        console.log(
          `Extracted Serial Numbers from ${path.basename(imagePath)}:`
        );
        console.log(uniqueSerialNumbers.join(", "));

        fs.writeFile(outputFileName, uniqueSerialNumbers.join("\n"), (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log(
              `Serial numbers from ${path.basename(
                imagePath
              )} have been saved to ${outputFileName}`
            );
          }
        });
      } else {
        console.log(
          `No serial numbers extracted from ${path.basename(imagePath)}.`
        );
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error("Error reading directory:", err);
  }

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === ".jpeg" || ext === ".jpg" || ext === ".png") {
      processImage(filePath);
    }
  });
});
