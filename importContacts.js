import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Contact } from './src/db/models/contact.js';
import fs from 'fs/promises';

dotenv.config();

const importContacts = async () => {
  try {
  
    const connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

  
    const data = await fs.readFile('./src/data/contacts.json', 'utf-8');
    const contacts = JSON.parse(data);

  
    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error importing contacts:', error.message);
    process.exit(1);
  }
};

importContacts();
