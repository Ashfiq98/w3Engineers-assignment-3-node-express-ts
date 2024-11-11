import express, { Request, Response } from 'express';
import multer , { FileFilterCallback } from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs-extra';  // For handling files
import path from 'path';    // For file path

const app = express();
const PORT = 3002;

app.get('/', (req: Request, res: Response) => {
res.send('Hello, World!');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// work - 1 /hotel (POST)
app.post('/hotel', async (req: Request, res: Response) => {
    try {
      const hotelData = req.body; // Extract hotel data from the request body
      
      // Ensure the 'data' folder exists
      const dataPath = path.join(__dirname, 'data');
      await fs.ensureDir(dataPath);
  
      // Use the hotel's slug as a unique identifier for the file
      const hotelId = hotelData.slug; // Assuming the slug is a unique identifier
      const filePath = path.join(dataPath, `${hotelId}.json`); // Create a file path based on the slug
  
      // Write the hotel data to a JSON file with proper indentation
      await fs.writeFile(filePath, JSON.stringify(hotelData, null, 2));
  
      // Send a success response back to the client
      res.status(201).json({
        message: 'Hotel added successfully!',
        hotelId,
        hotelData,
      });
    } catch (error) {
      // Handle any errors that occur during the file writing process
      res.status(500).json({
        message: 'Error adding hotel',
        error: error,
      });
    }
  });



// work - 2 /images
// Ensure 'images' directory exists
const imagesDirectory = path.join(__dirname, 'images');
fs.ensureDirSync(imagesDirectory);

// Multer setup for image file upload
const upload = multer({
    limits: {
      fileSize: 1000000, // Limit to 1MB file size
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        // Pass 'null' as the first argument when file is invalid, and an error message
        return cb(new Error('Please upload a valid image file'));
      }
      cb(null, true); // Accept the file
    },
  });

// POST /image endpoint to upload image with async/await
app.post('/image', upload.single('upload'), async (req: Request, res: Response): Promise<void> => {
    try {
      // Ensure that the file is provided
      if (!req.file) {
        console.log(req.file);
        res.status(400).send('No file uploaded');
        return;
      }
  
      // Define the output file path
      const outputFilePath = path.join(imagesDirectory, req.file.originalname);
  
      // Move the uploaded file to the images directory
      await fs.rename(req.file.path, outputFilePath); // Async file move operation
  
      // Return success message and the image URL
      res.status(201).send({
        message: 'Image uploaded successfully',
        imageUrl: `/images/${req.file.originalname}`,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });
  
  // Serve static files (images) from the 'images' directory
  app.use('/images', express.static(imagesDirectory));

  
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    });

export default app;