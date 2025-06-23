import { upload } from '@config/multer';
import {
  uploadFile,
  deleteFile,
  deleteMultipleFiles,
} from '@controllers/filesController';
import { Router } from 'express';
import { requireApiKey } from 'middlewares/apiKeyAuth';

const router = Router();

router.post(
  '/upload',
  requireApiKey(),
  upload.array('files', 10), // Allow up to 10 files
  uploadFile,
);

router.delete('/delete/:id', requireApiKey(), deleteFile);

router.post('/delete-multiple', requireApiKey(), deleteMultipleFiles);
export default router;
