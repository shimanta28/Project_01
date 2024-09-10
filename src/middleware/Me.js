import jwt from "jsonwebtoken";
import User from "../models/User.js";

const me = async (req, res) => {
  try {
    // Get the token from the cookies
    const token = req.cookies.tlog;

    // If no token is provided, return a 401 status
    if (!token) return res.status(401).json({ loggedin: false });

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        // If there is an error during verification, return a 401 status
        return res
          .status(401)
          .json({ loggedin: false, message: "Invalid token" });
      }

      // If the token is valid, find the user based on the decoded information
      const user = await User.findOne(
        { username: decoded.username },
        "-__v -password" // Exclude the password and other fields from the response
      ).exec();

      // If the user is found, return the user information
      if (user) {
        await user.populate({ path: "groups.group_id" });
        return res.status(200).json({
          loggedin: true,
          user: user,
        });
      } else {
        // If no user is found, return a 404 status
        return res
          .status(404)
          .json({ loggedin: false, message: "User not found" });
      }
    });
  } catch (e) {
    // Log the error and return a 500 status
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
};

export default me;
