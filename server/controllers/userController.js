const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All feilds are required" });
    }

    const isUserExist = await userModel.findOne({ email });
    if (!isUserExist) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const comparePassword = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!comparePassword) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }

    const token = createToken(isUserExist._id);

    res.status(201).json({ success: true, message: "Login complete", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All feilds are required" });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ success: false, message: "User already exist" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ success: true, message: "New user created", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { loginUser, registerUser };
