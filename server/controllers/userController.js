import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { uploadImage } from "../lib/cloudinary.js";

const clean = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password)
      return res.json({ success: false, message: "Missing details" });
    if (password.length < 6)
      return res.json({ success: false, message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.json({ success: false, message: "Account already exists" });

    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await User.create({ fullName, email, password: hashed, bio: bio || "" });

    res.json({
      success: true,
      userData: clean(user),
      token: generateToken(user._id),
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.password);
    if (!ok) return res.json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      userData: clean(user),
      token: generateToken(user._id),
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const update = { bio, fullName };
    if (profilePic) update.profilePic = await uploadImage(profilePic);

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select(
      "-password"
    );
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
