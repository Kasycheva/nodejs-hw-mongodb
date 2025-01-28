import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Contacts retrieved successfully!' });
});

router.get('/:contactId', (req, res) => {
  const { contactId } = req.params;
  res.status(200).json({ message: `Contact with ID ${contactId} retrieved successfully!` });
});

export default router;
