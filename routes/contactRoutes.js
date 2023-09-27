const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const {
  uploadProductImageLocal
} = require("../controllers/uploadsController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/uploads").post(uploadProductImageLocal);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
