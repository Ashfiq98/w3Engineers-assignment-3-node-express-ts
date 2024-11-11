import fs from 'fs/promises';
import { Hotel } from '../models/hotelModel';

const HOTEL_DATA_PATH = './data/'; // Directory to store hotel JSON files

// Write hotel data to a file
export const writeHotelData = async (hotelId: string, hotel: Hotel) => {
  const filePath = `${HOTEL_DATA_PATH}${hotelId}.json`;
  await fs.writeFile(filePath, JSON.stringify(hotel, null, 2));
};

// Get hotel data by ID
export const getHotelData = async (hotelId: string): Promise<Hotel | null> => {
  const filePath = `${HOTEL_DATA_PATH}${hotelId}.json`;

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null; // Hotel not found
  }
};
