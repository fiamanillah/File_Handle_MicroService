import { Request, Response } from 'express';
import FileModel from '@models/File';
import fs from 'fs';
import { promisify } from 'util';
interface UploadedFileResponse {
  name: string;
  path: string;
  size: number;
  type: string;
}

const unlinkAsync = promisify(fs.unlink);

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

    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000/'}`;

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

export const deleteMultipleFiles = async (req: Request, res: Response) => {
  const { fileIds } = req.body;

  try {
    // Validate input
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res
        .status(400)
        .json({ error: 'Please provide an array of file IDs to delete' });
    }

    // Find and delete files from database
    const filesToDelete = await FileModel.find({ _id: { $in: fileIds } });

    if (filesToDelete.length === 0) {
      return res
        .status(404)
        .json({ error: 'No files found with the provided IDs' });
    }

    // Delete files from filesystem
    const deletePromises = filesToDelete.map(async (file) => {
      try {
        await unlinkAsync(file.path);
      } catch (err: Error | any) {
        // If file doesn't exist in filesystem, we can still delete the DB record
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    });

    await Promise.all(deletePromises);

    // Delete records from database
    const deleteResult = await FileModel.deleteMany({ _id: { $in: fileIds } });

    res.json({
      message: 'Files deleted successfully',
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    res.status(500).json({ error: 'Failed to delete files' });
  }
};
