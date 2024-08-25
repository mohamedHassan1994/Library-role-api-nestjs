/* eslint-disable prettier/prettier */
import { S3 } from 'aws-sdk';
import { Request } from 'express';

interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

export async function uploadImages(files: Express.Multer.File[]) {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });

      const images: Array<{ Bucket: string; Key: string; Location: string }> =
        [];

      files.forEach(async (file) => {
        const filename = file.originalname;

        const params = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/books`,
          Key: filename,
          Body: file.buffer,
        };

        const uploadResponse = await s3.upload(params).promise();

        images.push({
          Bucket: uploadResponse.Bucket,
          Key: uploadResponse.Key,
          Location: uploadResponse.Location,
        });

        if (images.length === files.length) resolve(images);
      });
    } catch (error) {
      reject(error);
    }
  });
}
