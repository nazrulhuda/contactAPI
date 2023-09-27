const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(StatusCodes.OK).json( contacts )
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone, image } = req.body;
  if (!name || !email || !phone) {
    throw new BadRequestError('All data should be provided')
  }
  
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
    image: image ?? null,
  });

  res.status(StatusCodes.CREATED).json({ contact })
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new NotFoundError(`No contact with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json(contact)
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new NotFoundError(`No contact with ${req.params.id}`)
  }

  if (contact.user_id.toString() !== req.user.id) {
    throw new UnauthenticatedError('Authetication invalid')
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  res.status(StatusCodes.OK).json({"success": true, "updated conctact for": updatedContact})
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new NotFoundError(`No contact with ${req.params.id}`)
  }
  if (contact.user_id.toString() !== req.user.id) {
    throw new UnauthenticatedError('Authetication invalid')
  }
  await Contact.deleteOne({ _id: req.params.id });

  res.status(StatusCodes.OK).json({"success": true, contact})
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
