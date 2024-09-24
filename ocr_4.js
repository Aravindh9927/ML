const Tesseract = require("tesseract.js");

Tesseract.recognize("test/img/Image_34.jpg", "eng", {
  langPath: "test/img/Image_34.traineddata",
})
  .then(({ data: { text } }) => {
    const regex = /\b[A-Fa-f0-9Ss]{7}\b/g;
    const matches = text.match(regex);
    const uniqueMatches = [...new Set(matches)];
    console.log(uniqueMatches);
  })
  .catch((err) => {
    console.error(err);
  });
