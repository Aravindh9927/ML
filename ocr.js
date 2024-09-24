const Tesseract = require("tesseract.js");

const imagePath = "test/img/Image_4.jpeg";

Tesseract.recognize(imagePath, "eng", {
  logger: (info) => console.log(info),
  page: 1,
})
  .then(({ data: { text } }) => {
    const serialNumberRegex = /\b(?=.{7})[0-9A-Fa-fSs]{7}\b|\b\d{7}\b/g;

    const serialNumbers = text.match(serialNumberRegex);

    if (serialNumbers) {
      const uniqueSerialNumbers = [...new Set(serialNumbers)];
      console.log(`Extracted Serial Numbers:`);
      console.log(uniqueSerialNumbers.join(", "));
    } else {
      console.log("No serial numbers have been extracted.");
    }
  })
  .catch((err) => {
    console.error("Error:", err);
  });
