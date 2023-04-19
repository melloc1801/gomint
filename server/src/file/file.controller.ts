import { get } from "lodash";
import * as path from "path";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { v4 as uuidv4 } from "uuid";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  Controller,
  PayloadTooLargeException,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserGuard } from "src/user/guard/user.guard";

const s3 = new S3Client({
  region: process.env.DO_REGION,
  endpoint: process.env.DO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_AT,
    secretAccessKey: process.env.DO_SAT,
  },
});

export const s3winners = new S3Client({
  region: process.env.DO_WINNERS_REGION,
  endpoint: process.env.DO_WINNERS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_AT,
    secretAccessKey: process.env.DO_SAT,
  },
});

const LIMIT = 2;
const LIMIT_IN_MB = LIMIT * 1024 * 1024;

@Controller("file")
export class FilesController {
  @UseGuards(AuthGuard, UserGuard)
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        const maxFileSize = LIMIT_IN_MB;

        const allowedMimeTypes = [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/gif",
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new UnsupportedMediaTypeException("Invalid file format"), false);
        }

        if (maxFileSize < +get(req.headers, "content-length", 0)) {
          cb(
            new PayloadTooLargeException(
              `File is too large. Limit is ${LIMIT}MB`
            ),
            false
          );
        }

        cb(null, true);
      },
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const params = {
      Body: file.buffer,
      ACL: "public-read",
      Bucket: process.env.DO_BUCKET,
      Key: `${uuidv4()}${path.extname(file.originalname)}`,
    };

    await s3.send(new PutObjectCommand(params));
    return { url: `${process.env.DO_ENDPOINT}/${params.Bucket}/${params.Key}` };
  }
}
