const compare = require("resemblejs").compare;

function getImageDiff(image1, image2) {
  return new Promise((resolve, reject) => {
    const options = {
      output: {
        errorColor: {
          red: 255,
          green: 0,
          blue: 255,
        },
        errorType: "movement",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true,
      },
      scaleToSameSize: true,
      ignore: "antialiasing",
    };

    compare(image1, image2, options, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.rawMisMatchPercentage < 50);
      }
    });
  });
}

const compareImages = async (sourceImage, targetImages) => {
  const resembleList = [];
  for (const item of targetImages) {
    if (await getImageDiff(sourceImage, item.image.url)) {
      resembleList.push(item);
    }
  }
  return resembleList;
};

module.exports = compareImages
