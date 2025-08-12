const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, petController.createPet);
router.get("/", protect, petController.getAllPets);
router.get("/:id", protect, petController.getPetById);
router.put("/:id", protect, petController.updatePet);
router.delete("/:id", protect, petController.deletePet);

module.exports = router;
