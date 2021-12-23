const s3 = require('../s3');
const HttpError = require('../utils/HttpError');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

exports.uploadImage = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    const result = await s3.uploadFile(file);
    if (!result) {
      throw new HttpError('cant upload file to storage', 400);
    }
    await unlink(file.path);
    console.log(result);
    res
      .status(200)
      .json({message: 'success', data: {imagePath: `/images/${result.Key}`}});
  } catch (e) {
    next(e);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = s3.getFileStream(key);
    readStream.pipe(res);
  } catch (e) {
    next(e);
  }
};
