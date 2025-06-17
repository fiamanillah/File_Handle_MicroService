import mongoose from 'mongoose';
export interface IFile {
  name: string;
  path: string;
  size: number;
  type: string;
}

const fileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const FileModel = mongoose.model<IFile>('File', fileSchema);
export default FileModel;
