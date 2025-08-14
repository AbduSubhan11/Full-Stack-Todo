import { User } from "../models/user.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ messgae: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ messgae: "User not found" });
  }

  res.status(200).json(user);
};

export const editProfile = async (req, res) => {
  const userId = req.user?._id;
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!userId) {
    return res.status(400).json({ message: "User Id Is Required" });
  }

  try {
    const updatedData = { name, email };
    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.path);
      if (!imageUrl) {
        res.status(500).json({ message: "Failed to upload image" });
        return;
      }
      updatedData.profilePicture = imageUrl;
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
