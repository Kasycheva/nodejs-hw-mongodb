import { Contact } from "../db/models/contact.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import createHttpError from "http-errors";

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

const createContactHandler = async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    return next(createHttpError(400, "Missing required fields: name, phoneNumber, or contactType"));
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

const updateContactHandler = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!updatedContact) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully updated the contact!",
    data: updatedContact,
  });
};

const deleteContactHandler = async (req, res, next) => {
  const { contactId } = req.params;
  const trimmedId = contactId.trim(); 

  const contact = await Contact.findByIdAndDelete(trimmedId);

  if (!contact) {
      return next(createHttpError(404, "Contact not found"));
  }

  res.status(200).json({
      status: 200,
      message: "Successfully deleted the contact!",
      data: contact,
  });
};


export const getAllContacts = ctrlWrapper(getAllContactsHandler);
export const getContactById = ctrlWrapper(getContactByIdHandler);
export const createContact = ctrlWrapper(createContactHandler);
export const updateContact = ctrlWrapper(updateContactHandler);
export const deleteContact = ctrlWrapper(deleteContactHandler);
