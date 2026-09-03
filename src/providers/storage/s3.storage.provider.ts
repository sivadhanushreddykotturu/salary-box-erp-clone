import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageProvider {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET_NAME || 'erp-hrms-documents';
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret',
      },
    });
  }

  async getPresignedUploadUrl(
    s3Key: string,
    mimeType: string,
    expiresInSeconds = 900
  ): Promise<{ uploadUrl: string; s3Key: string; bucket: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    return { uploadUrl, s3Key, bucket: this.bucket };
  }

  async getPresignedDownloadUrl(s3Key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }
}

export const storageProvider = new S3StorageProvider();