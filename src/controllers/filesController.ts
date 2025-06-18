import { Request, Response } from 'express';
import FileModel from '@models/File';
import fs from 'fs';
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

    const baseUrl = `${req.protocol}://${req.get('host')}/files/`;

    // Save file metadata to the database
    const filesData: UploadedFileResponse[] = await Promise.all(
      files.map(async (file) => {
        const newFile = await FileModel.create({
          url: baseUrl + file.filename,
          path: file.path,
          size: file.size,
          originalname: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
        });

        return newFile;
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

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file = await FileModel.findByIdAndDelete(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
        return res
          .status(500)
          .json({ error: 'Failed to delete file from filesystem' });
      }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
