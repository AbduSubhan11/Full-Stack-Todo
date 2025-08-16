import { User } from "../models/user.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<h1>Verify Email</h1><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });

    return res.status(201).json({
      message:
        "User registered successfully, please check your email to verify",
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

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

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

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({ message: "User not found or expired" });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ messgae: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
