const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Chef = require("../models/chef.model");


const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );


const register = async (data = {}) => {
  const { name, email, password } = data;

  if (!email || !password || !name) {
    throw new Error("Name, email and password are required");
  }

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = signToken(user);

  return { user, token };
};

// =======================
// 👨‍🍳 REGISTER CHEF
// =======================
const registerChef = async (data = {}) => {
  const {
    name,
    email,
    password,
    bio = "",
    speciality = [],
    cuisineType = [],
    socialLinks = {},
  } = data;

  if (!email || !password || !name) {
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create user with chef role
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "chef",
  });

  // create chef profile
  const chef = await Chef.create({
    userId: user._id,
    name,
    bio,
    speciality: Array.isArray(speciality) ? speciality : [],
    cuisineType: Array.isArray(cuisineType) ? cuisineType : [],
    socialLinks:
      socialLinks && typeof socialLinks === "object" ? socialLinks : {},
  });

  const token = signToken(user);

  return { user, chef, token };
};

const registerAdmin = async (data = {}) => {
  const { name, email, password } = data;

  if (!email || !password || !name) {
    throw new Error("Name, email and password are required");
  }

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user with admin role
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  const token = signToken(user);

  return { user, token };
};


// =======================
// 🔑 LOGIN USER
// =======================
const login = async (data = {}) => {
  const { email, password } = data;

  // validation (prevents crash)
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // check user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = signToken(user);

  return { user, token };
};

module.exports = {
  register,
  registerChef,
  registerAdmin,
  login,
};
