import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log(`MongoDB Connected`);
  } catch (error) {
    const typedError = error as Error;
    console.error(`Error: ${typedError.message}`);
    process.exit(1);
  }
};

export default connectDB;