import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
    async uploadCloudinary(
        file: Express.Multer.File,
        folder = 'tennis-star',
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No result returned from Cloudinary'));
                    resolve(result);
                },
            );

            toStream(file.buffer).pipe(upload);
        });
    }

    async uploadImages(
        files: Express.Multer.File[],
        folder?: string,
    ): Promise<UploadApiResponse[]> {
        return Promise.all(
            files.map(file => this.uploadCloudinary(file, folder)),
        );
    }
}
