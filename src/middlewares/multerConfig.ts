import multer from 'multer';

// Configure storage engine
const storage = multer.memoryStorage(); // Store file in memory

// Initialize upload
const upload = multer({ storage });

export default upload;
