import mongoose from 'mongoose';

export const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/carebridge';
  await mongoose.connect(mongoUri, { autoIndex: true });
};
