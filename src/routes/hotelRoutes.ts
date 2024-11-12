// routes/hotelRoutes.ts
import express from 'express';
import { uploadHotelImages,uploadRoomImages,getHotel,addHotel,updateHotel } from '../controllers/hotelController';
import { upload } from '../middlewares/uploadMiddleware';
// import { addHotel } from '../controllers/hotelController';
// import { uploadRoomImages } from '../controllers/hotelController';

const router = express.Router();

router.post('/hotel', addHotel);

router.post('/image', upload.array('images', 5), uploadHotelImages);

// const router = express.Router();

router.post('/room-image', upload.array('room-image', 5), uploadRoomImages);
router.get('/hotel/:hotelId', getHotel);  // Map the GET request to the controller method
router.put('/hotel/:hotelId', updateHotel); 

export default router;
