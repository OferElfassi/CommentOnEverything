const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} = require('./config/keys');

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    ACL: 'public-read',
    bucket: AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
});

exports.deleteImage = imageKey => {
  return s3
    .deleteObject({Bucket: AWS_BUCKET_NAME, Key: imageKey}, (err, data) => {
      console.error(err);
      console.log(data);
    })
    .promise();
};




