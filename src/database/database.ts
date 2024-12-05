import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string, {
    });
    console.log('MongoDB Connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
    } else {
      console.error('MongoDB connection error:', String(error));
    }
    process.exit(1); // Exit the app if the connection fails
  }
}; 

export default connectDB;