// import { v4 as uuidv4 } from 'uuid';

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface Host {
//   name: string;
//   contact: string;
// }

// interface Room {
//   hotelSlug: string;
//   roomSlug: string;
//   roomImage: string;
//   roomTitle: string;
//   bedroomCount: number;
//   roomImages?: string[];
// }

// interface Hotel {
//   hotelId: string; // UUID as numeric string
//   slug: string;
//   images: string[];
//   title: string;
//   description: string;
//   guestCount: number;
//   bedroomCount: number;
//   bathroomCount: number;
//   amenities: string[];
//   host: Host;
//   address: string;
//   location: Location;
//   rooms: Room[];
// }

// const createHotel = ({
//   title,
//   slug,
//   description,
//   guestCount,
//   bedroomCount,
//   bathroomCount,
//   amenities,
//   host,
//   address,
//   location,
//   rooms,
//   images
// }: Partial<Omit<Hotel, 'hotelId'>>): Hotel => {
//   return {
//     hotelId: uuidv4().replace(/\D/g, '').slice(0, 10), // Generate a UUID with only numbers
//     slug,
//     title,
//     description,
//     guestCount,
//     bedroomCount,
//     bathroomCount,
//     amenities,
//     host,
//     address,
//     location,
//     rooms,
//     images
//   } as Hotel;
// };

// export { Hotel, Room, Host, Location, createHotel };


// models/hotelModel.ts
import fs from 'fs-extra';
import path from 'path';

export const dataPath = path.join(__dirname, '../data');
export const filePath = path.join(dataPath, 'hotels.json');

// post hotel
export const addHotelToData = async (newHotel: any): Promise<any> => {
  try {
    const hotelsData = await fs.readJson(filePath);  // Read existing hotel data from JSON file

    // Add the new hotel to the hotels data array
    hotelsData.push(newHotel);

    // Save the updated hotels data back to the JSON file
    await fs.writeJson(filePath, hotelsData, { spaces: 2 });

    return newHotel;  // Return the newly added hotel
  } catch (error) {
    throw new Error('Error adding hotel data');
  }
};

//

export const getHotels = async (): Promise<any[]> => {
  if (await fs.pathExists(filePath)) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  return [];
};

export const saveHotels = async (hotels: any[]): Promise<void> => {
  await fs.ensureDir(dataPath);
  await fs.writeFile(filePath, JSON.stringify(hotels, null, 2));
};

// image adding 

// const dataPath = path.join(__dirname, '../data');
// const filePath = path.join(dataPath, 'hotels.json');
const uploadDirectory = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
fs.ensureDirSync(uploadDirectory);

// export const getHotels = async (): Promise<any[]> => {
//   if (await fs.pathExists(filePath)) {
//     const fileContent = await fs.readFile(filePath, 'utf-8');
//     return JSON.parse(fileContent);
//   }
//   return [];
// };

// export const saveHotels = async (hotels: any[]): Promise<void> => {
//   await fs.writeFile(filePath, JSON.stringify(hotels, null, 2));
// };

export const getHotelById = async (hotelId: string) => {
  const hotels = await getHotels();
  return hotels.find((hotel) => hotel.hotelId === hotelId);
};

export const updateHotelImages = async (hotelId: string, imageUrls: string[]) => {
  const hotels = await getHotels();
  const hotel = hotels.find((h) => h.hotelId === hotelId);
  if (hotel) {
    hotel.images = hotel.images ? hotel.images.concat(imageUrls) : imageUrls;
    await saveHotels(hotels);
  }
};

// room image
export interface Room {
  roomSlug: string;
  roomImages?: string[];
}

export interface Hotel {
  hotelId: string;
  rooms?: Room[];
}


// get info

// export const getHotelById = async (hotelId: string) => {
//   try {
//     const hotelsData = await fs.readJson(filePath);  // Read hotels data from JSON file
//     return hotelsData.find((h: any) => h.hotelId === hotelId || h.slug === hotelId);  // Find hotel by ID or slug
//   } catch (error) {
//     throw new Error('Error reading hotel data');
//   }
// };

// put info

// const filePath = path.join(__dirname, 'data', 'hotels.json');  // Path to your hotels data file

// Function to get hotel by ID
// export const getHotelById = async (hotelId: string) => {
//   const hotelsData = await fs.readJson(filePath);  // Read hotels data from JSON file
//   return hotelsData.find((h: any) => h.hotelId === hotelId || h.slug === hotelId);  // Find hotel by ID or slug
// };

// Function to update hotel data by ID
export const updateHotelById = async (hotelId: string, updatedHotelData: any) => {
  try {
    const hotelsData = await fs.readJson(filePath);  // Read hotels data from JSON file

    // Find the index of the hotel to be updated
    const hotelIndex = hotelsData.findIndex((h: any) => h.hotelId === hotelId);

    if (hotelIndex === -1) {
      throw new Error('Hotel not found');
    }

    // Update the hotel data with the new information
    const hotel = hotelsData[hotelIndex];
    hotelsData[hotelIndex] = {
      ...hotel,  // Copy existing hotel data
      ...updatedHotelData,  // Override with updated fields from the request
    };

    // Save the updated hotel data back to the hotels JSON file
    await fs.writeJson(filePath, hotelsData, { spaces: 2 });

    return hotelsData[hotelIndex];  // Return the updated hotel
  } catch (error) {
    throw new Error('Error updating hotel data');
  }
};