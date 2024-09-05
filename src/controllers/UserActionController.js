import User from "../models/User.js";

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, including only username and name fields
    const users = await User.find({}, "username name").exec();

    // If no users found, send an empty array
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Respond with the users data
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving users",
    });
  }
};

// Controller to get a single user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch user by ID, including only username and name fields
    const user = await User.findById(userId, "username name").exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving user",
    });
  }
};

// Export multiple functions using named exports
export { getAllUsers, getUserById };
