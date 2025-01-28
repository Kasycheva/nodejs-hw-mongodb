import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRoutes.js';

dotenv.config();

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json()); 


  app.get('/', (req, res) => {
    res.send('Welcome to the Contacts API!');
  });


  app.use('/contacts', contactsRouter);


  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
