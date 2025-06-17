import { Request, Response } from 'express';
import FileModel from '@models/File';

interface UploadedFileResponse {
  name: string;
  path: string;
  size: number;
  type: string;
}

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Handle both single file and multiple files cases
    let files: Express.Multer.File[];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else {
      // If not array, it's an object with fieldname keys
      files = Object.values(req.files).flat();
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save file metadata to the database
    const filesData: UploadedFileResponse[] = await Promise.all(
      files.map(async (file) => {
        await FileModel.create({
          path: file.path,
          size: file.size,
          originalname: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
        });

        return {
          name: file.originalname,
          path: file.path,
          size: file.size,
          type: file.mimetype,
        };
      }),
    );

    res.json({
      message: 'Files uploaded successfully',
      files: filesData,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};
