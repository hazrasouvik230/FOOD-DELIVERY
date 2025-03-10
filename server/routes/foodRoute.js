const express = require("express");
const { addFood, listFood, removeFood } = require("../controllers/foodController");
const multer = require("multer");
const path = require("path");

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

module.exports = foodRouter;
