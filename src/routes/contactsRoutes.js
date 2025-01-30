import { Router } from "express";
import {
  getAllContacts,
  getContactById,
} from "../controllers/contactsController.js";

const router = Router();

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);


export default router;
