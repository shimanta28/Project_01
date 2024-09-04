import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key"; // Use a secure secret and store it safely (e.g., in environment variables)

// Function to sign in a user
export const signIn = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload data to include in the token
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );
    res.cookie("tlog", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    // Send the token along with the user data (excluding the password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Sign in successful",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
};
