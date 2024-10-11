import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, isAdmin } = req.body;
  if (!username || !email || !password) {
    throw new Error("please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User already exists"); // Added return
  }
  //hash user password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin: isAdmin || false,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    const validatePassword = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (validatePassword) {
      createToken(res, existedUser._id);

      res.status(201).json({
        _id: existedUser._id,
        username: existedUser.username,
        email: existedUser.email,
        isAdmin: existedUser.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    res.status(401).json({ message: "User not Found" });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out Successfully!" });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ users }); // Corrected the status and response method
});

const getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("User not found!");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Email is already in use" });
    }
  }

  const updates = {
    username: username || req.user.username,
    email: email || req.user.email,
  };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
