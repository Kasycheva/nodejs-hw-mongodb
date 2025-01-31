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

const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

const createContactHandler = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, "Missing required fields: name, phoneNumber, or contactType");
  }

  const newContact = await Contact.create({
    name,
    phoneNumber,
    email: email || null,
    isFavourite: isFavourite || false,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!updatedContact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully updated the contact!",
    data: updatedContact,
  });
};

const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send(); // Статус 204 без тела ответа
};

export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);