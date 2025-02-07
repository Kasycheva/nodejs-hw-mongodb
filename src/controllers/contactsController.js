import { Contact } from "../db/models/contact.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const getAllContactsHandler = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", isFavourite } = req.query;
  const userId = req.user._id; 

  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === "desc" ? -1 : 1;

  const filter = { userId }; 
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(parseInt(perPage));

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

const getContactByIdHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; 

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const contact = await Contact.findOne({ _id: contactId, userId }); 
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
  const userId = req.user._id;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, "Missing required fields: name, phoneNumber, or contactType");
  }

  const newContact = await Contact.create({
    name,
    phoneNumber,
    email: email || null,
    isFavourite: isFavourite || false,
    contactType,
    userId, 
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

const updateContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, userId }, req.body, { new: true }); // ✅ Используем findOneAndUpdate
  if (!updatedContact) {
    throw createHttpError(404, "Contact not found or access denied");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully updated the contact!",
    data: updatedContact,
  });
};

const deleteContactHandler = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, "Invalid contact ID format");
  }

  const contact = await Contact.findOneAndDelete({ _id: contactId, userId }); // ✅ Используем findOneAndDelete
  if (!contact) {
    throw createHttpError(404, "Contact not found or access denied");
  }

  res.status(204).send();
};

export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
