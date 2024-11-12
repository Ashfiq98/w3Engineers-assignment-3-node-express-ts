// controllers/hotelController.ts
import { Request, Response } from 'express';
import { getHotels, saveHotels } from '../models/hotelModel';
import { filePath ,updateHotelById,addHotelToData} from '../models/hotelModel';

import { v4 as uuidv4 } from 'uuid';  // Import uuid
import slugify from 'slugify';  // Import slugify
// import { addHotelToData } from './hotelModel';  // Import the model function to add hotel data

// Controller to add a new hotel
export const addHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelData = req.body;  // Get the hotel data from the request body

    // Validate required fields (e.g., title and description)
    if (!hotelData.title || !hotelData.description) {
      res.status(400).send('Title and description are required');
      return;
    }

    // Automatically generate hotelId (UUID) and slug from the title
    const hotelId = uuidv4();  // Generate a unique hotelId
    const slug = slugify(hotelData.title, { lower: true });  // Generate a slug from the title

    // Create a new hotel object, including the generated hotelId and slug
    const newHotel = {
      hotelId,       // Add the generated hotelId
      slug,          // Add the generated slug
      ...hotelData,  // Include all fields from the request body
    };

    // Save the hotel data by calling the model function
    const savedHotel = await addHotelToData(newHotel);

    // Send a success response with the saved hotel data
    res.status(201).send({
      message: 'Hotel added successfully',
      hotel: savedHotel,  // Return the saved hotel object
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// adding image

import { getHotelById, updateHotelImages } from '../models/hotelModel';

export const uploadHotelImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = req.body.hotelId;

    if (!hotelId) {
      res.status(400).send('No hotelId provided');
      return;
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).send('No files uploaded');
      return;
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    const imageUrls = files.map((file) => `http://localhost:${process.env.PORT || 3000}/uploads/${file.originalname}`);

    const hotel = await getHotelById(hotelId);
    if (!hotel) {
      res.status(404).send('Hotel not found');
      return;
    }

    await updateHotelImages(hotelId, imageUrls);

    res.status(201).send({
      message: 'Images uploaded and hotel data updated successfully',
      imageUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// room image
// import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { Hotel } from '../models/hotelModel';

export const uploadRoomImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = req.body.hotelId;  // Get hotelId from the form data
    const roomSlug = req.body.roomSlug;  // Get roomSlug from the form data

    if (!hotelId || !roomSlug) {
      res.status(400).send('No hotelId or roomSlug provided');
      return;
    }

    if (!req.files || req.files.length === 0) {
      res.status(400).send('No files uploaded');
      return;
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];

    // Read hotels data from the JSON file
    const hotelsData: Hotel[] = await fs.readJson(filePath);
    const hotel = hotelsData.find((h: Hotel) => h.hotelId === hotelId);

    if (!hotel) {
      res.status(404).send('Hotel not found');
      return;
    }

    const room = hotel.rooms?.find((r: any) => r.roomSlug === roomSlug);

    if (!room) {
      res.status(404).send('Room not found');
      return;
    }

    // Initialize roomImages if it's undefined or not an array
    room.roomImages = room.roomImages ?? [];

    // Add image URLs to roomImages
    files.forEach((file: any) => {
      const imageUrl = `/uploads/${file.originalname}`;
      room.roomImages?.push(`http://localhost:${process.env.PORT || 3000}${imageUrl}`);
    });

    // Save the updated hotel data back to the hotels JSON file
    await fs.writeJson(filePath, hotelsData, { spaces: 2 });

    res.status(201).send({
      message: 'Room images uploaded and hotel data updated successfully',
      roomImageUrls: files.map((file: any) => `http://localhost:${process.env.PORT || 3000}/uploads/${file.originalname}`),
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
};


// get hotel detail

export const getHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = req.params.hotelId;  // Get hotelId from the URL parameter
    
    // Fetch hotel data using the model function
    const hotel = await getHotelById(hotelId);

    if (!hotel) {
      res.status(404).send('Hotel not found');
      return;
    }

    // If the hotel has images, modify the URLs to be fully functional
    if (hotel.images) {
      hotel.images = hotel.images.map((image: string) => `${image}`);
    }

    // If the hotel has rooms, modify the room image URLs to be fully functional
    if (hotel.rooms) {
      hotel.rooms.forEach((room: any) => {
        if (room.roomImage) {
          room.roomImage = `${room.roomImage}`;
        }
      });
    }

    // Send the hotel data as the response
    res.status(200).send({
      message: 'Hotel data retrieved successfully',
      hotelData: hotel,  // Return the specific hotel object
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// put detail

export const updateHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = req.params.hotelId;  // Get hotelId from the URL parameter
    const updatedHotelData = req.body;  // Get the updated hotel data from the request body

    // Validate the required fields in the request body
    if (!updatedHotelData.title || !updatedHotelData.description) {
      res.status(400).send('Title and description are required');
      return;
    }

    // Call the model function to update the hotel data
    const updatedHotel = await updateHotelById(hotelId, updatedHotelData);

    // Return success response with the updated hotel data
    res.status(200).send({
      message: 'Hotel data updated successfully',
      hotel: updatedHotel,  // Return the updated hotel object
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
};