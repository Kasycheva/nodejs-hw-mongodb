import express from "express";
import multer from "multer";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createContactSchema, updateContactSchema } from "../validation/contactValidation.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.get("/", authenticate, getAllContacts);
router.get("/:contactId", authenticate, isValidId, getContactById);
router.post("/", authenticate, upload.single("photo"), validateBody(createContactSchema), createContact);
router.patch("/:contactId", authenticate, upload.single("photo"), isValidId, validateBody(updateContactSchema), updateContact);
router.delete("/:contactId", authenticate, isValidId, deleteContact);

export default router;
