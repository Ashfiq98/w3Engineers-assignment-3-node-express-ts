// import { Request, Response, NextFunction } from 'express';
// import { Hotel, generateHotelId } from '../models/hotelModel';
// import { writeHotelData, getHotelData } from '../utils/fileUtils';
// import slugify from 'slugify';

// // Create a new hotel
// export const createHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { title, description, guestCount, bedroomCount, bathroomCount, amenities, hostInfo, address, latitude, longitude, rooms } = req.body;

//   // Basic validation: Ensure required fields are present
//   if (!title || !description || !guestCount || !bedroomCount || !bathroomCount || !address || !latitude || !longitude) {
//     res.status(400).json({ error: 'Missing required fields.' });
//     return;
//   }

//   // Generate unique hotel ID and slug
//   const id = generateHotelId();
//   const slug = slugify(title, { lower: true });

//   const hotel: Hotel = {
//     id,
//     slug,
//     title,
//     description,
//     guestCount,
//     bedroomCount,
//     bathroomCount,
//     amenities,
//     hostInfo,
//     address,
//     latitude,
//     longitude,
//     rooms
//   };

//   try {
//     await writeHotelData(id, hotel);
//     res.status(201).json(hotel);
//   } catch (error) {
//     console.error('Error creating hotel:', error);
//     next(error); // Use next to pass the error to error handling middleware
//   }
// };

// // Retrieve a hotel by ID or slug
// export const getHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { hotelId } = req.params;

//   try {
//     const hotel = await getHotelData(hotelId);
//     if (!hotel) {
//       res.status(404).json({ error: 'Hotel not found' });
//       return;
//     }
//     res.json(hotel);
//   } catch (error) {
//     console.error('Error retrieving hotel:', error);
//     next(error);
//   }
// };

// // Update an existing hotel by ID
// export const updateHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { hotelId } = req.params;
//   const updatedData = req.body;

//   try {
//     const hotel = await getHotelData(hotelId);
//     if (!hotel) {
//       res.status(404).json({ error: 'Hotel not found' });
//       return;
//     }

//     const updatedHotel = { ...hotel, ...updatedData };

//     await writeHotelData(hotelId, updatedHotel);
//     res.json(updatedHotel);
//   } catch (error) {
//     console.error('Error updating hotel:', error);
//     next(error);
//   }
// };

// src/controllers/hotelController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';

const dataPath = path.join(__dirname, '../../data'); // Directory to store hotel data

// POST /hotel - Add a new hotel
export const createHotel = async (req: Request, res: Response) => {
  // Generate a unique ID and slug for the hotel
  const hotelId = uuidv4();
  const slug = req.body.title.toLowerCase().replace(/\s+/g, '-');

  // Define the structure for the hotel data
  const hotelData = {
    id: hotelId,
    slug: slug,
    images: req.body.images || [],
    title: req.body.title,
    description: req.body.description,
    guestCount: req.body.guestCount,
    bedroomCount: req.body.bedroomCount,
    bathroomCount: req.body.bathroomCount,
    amenities: req.body.amenities || [],
    host: req.body.host,
    address: req.body.address,
    location: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    },
    rooms: req.body.rooms || []
  };

  try {
    // Ensure the data directory exists
    await fs.ensureDir(dataPath);

    // Save hotel data as a JSON file named by the hotel ID
    await fs.writeFile(path.join(dataPath, `${hotelId}.json`), JSON.stringify(hotelData, null, 2));
    
    // Respond with success
    res.status(201).json({ message: 'Hotel added successfully', hotel: hotelData });
  } catch (error) {
    res.status(500).json({ error: 'Error saving hotel data' });
  }
};
