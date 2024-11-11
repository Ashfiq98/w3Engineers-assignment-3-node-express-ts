import { v4 as uuidv4 } from 'uuid';

export interface Room {
  hotelSlug: string;
  roomSlug: string;
  roomImage: string;
  roomTitle: string;
  bedroomCount: number;
}

export interface Hotel {
  id: string;
  slug: string;
  title: string;
  description: string;
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  hostInfo: string;
  address: string;
  latitude: number;
  longitude: number;
  rooms: Room[];
}

export const generateHotelId = (): string => uuidv4(); // Unique ID generator
