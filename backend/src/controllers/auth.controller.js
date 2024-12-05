import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({
          _id: newUser._id,
          email: newUser.email,
          profilePic: newUser.profilePic,
          message: "User registered successfully",
        });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Signup Controller");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "User logged in successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Login Controller");
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Logout Controller");
  }
};


export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Please provide a profile picture"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true});
        res.status(200).json(updatedUser);
    }catch (e) {
        console.error(e);
        res.status(500).send("Error in Update Profile Controller");
    }
}

export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch (e) {
        console.error(e);
        res.status(500).send("Error in Check Auth Controller");
    }
}