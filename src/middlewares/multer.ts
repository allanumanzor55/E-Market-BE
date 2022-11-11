import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 } from "uuid";

const { AWS_BUCKET_NAME, AWS_REGION: region } = process.env;

const s3 = new S3Client({ region });

export default multer({
  storage: multerS3({
    s3,
    bucket: AWS_BUCKET_NAME!,
    metadata: (_req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req, file, cb) => {
      const uniqueId = v4();
      cb(
        null,
        file.originalname.replace(/.(\.png|jpg|jpeg)/g, `${uniqueId}.$1`)
      );
    },
  }),
});
