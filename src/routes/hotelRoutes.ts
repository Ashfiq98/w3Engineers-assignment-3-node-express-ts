import express, { Request, Response } from 'express';
import { createHotel} from '../controllers/hotelController';
import multer from 'multer';

const router = express.Router();

// Multer setup for image uploads
const upload = multer({ dest: 'uploads/' });

router.post('/hotel', createHotel);  // Route to create a new hotel
// router.get('/hotel/:hotelId', getHotel);  // Route to get hotel details by ID
// router.put('/hotel/:hotelId', updateHotel);  // Route to update hotel data

// Upload multiple images
router.post('/images', upload.array('images', 10), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];  // Type files correctly
  const filePaths = files?.map(file => file.path) || [];
  res.json({ filePaths });
});

export default router;
