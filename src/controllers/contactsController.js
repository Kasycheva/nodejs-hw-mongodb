import { Contact } from "../db/models/contact.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", isFavourite } = req.query;
    const userId = req.user._id;

    const { sortBy: parsedSortBy, sortOrder: parsedSortOrder } = parseSortParams({ sortBy, sortOrder });

    const filter = { userId };
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === "true";
    }

    const totalItems = await Contact.countDocuments(filter);
    const paginationData = calculatePaginationData(totalItems, perPage, page);

    const contacts = await Contact.find(filter)
      .sort({ [parsedSortBy]: parsedSortOrder })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.status(200).json({
      status: 200,
      message: "Contacts retrieved successfully!",
      data: {
        contacts,
        ...paginationData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
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
      message: "Contact found!",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;
    let photoUrl = "";

    if (req.file) {
      photoUrl = await saveFileToCloudinary(req.file.path);
    }

    const newContact = await Contact.create({
      name,
      phoneNumber,
      email: email || null,
      isFavourite: isFavourite || false,
      contactType,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: "Contact created successfully!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, "Invalid contact ID format");
    }

    let updateData = req.body;

    if (req.file) {
      updateData.photo = await saveFileToCloudinary(req.file.path);
    }

    const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found or access denied");
    }

    res.status(200).json({
      status: 200,
      message: "Contact updated successfully!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, "Invalid contact ID format");
    }

    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!contact) {
      throw createHttpError(404, "Contact not found or access denied");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
