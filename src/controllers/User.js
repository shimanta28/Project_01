import User from "../models/User.js";
import bcrypt from "bcrypt";

// Function to create a new user
export const createUser = async (req, res) => {
  try {
    // Extract the necessary fields from the request body
    const { name, email, password, groups } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      groups,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the created user (excluding the password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
