import request from 'supertest';
import app from '../index'; // Adjust based on your import path

describe('Hotel API', () => {
  it('should create a hotel', async () => {
    const response = await request(app).post('/api/hotel').send({
      title: 'Test Hotel',
      description: 'Description',
      guestCount: 4,
      bedroomCount: 2,
      bathroomCount: 1,
      amenities: ['WiFi'],
      hostInfo: 'Host Name',
      address: '123 Main St',
      latitude: 40.7128,
      longitude: -74.0060,
      rooms: []
    });
    expect(response.status).toBe(201);
  });
});
