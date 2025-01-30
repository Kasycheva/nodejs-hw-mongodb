import { Contact } from "../db/models/contact.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import createHttpError from "http-errors"; 
import mongoose from "mongoose";

const getAllContactsHandler = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

const getContactByIdHandler = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(404, "Contact not found"));
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
