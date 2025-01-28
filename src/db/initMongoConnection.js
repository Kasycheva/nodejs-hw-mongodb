import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  try {
   
    const connectionString = `mongodb+srv://MARIA:lVjXs36I2g0S29mI@cluster0.4qnrz.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0`;


    
    await mongoose.connect(connectionString);
    
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};
