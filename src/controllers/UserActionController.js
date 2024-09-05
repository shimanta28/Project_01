import User from "../models/User.js";

// const getAllUsers = async (req, res) => {
//   const search = req.body; // Get the search string from query parameters

//   try {
//     // Build query to search users by name or username
//     const query = search
//       ? {
//           $or: [
//             { username: new RegExp(search, "i") },
//             { name: new RegExp(search, "i") },
//           ],
//         }
//       : {}; // If no search string, return all users

//     // Fetch users from the database, including only username and name fields
//     const users = await User.find(query, "username name").exec();

//     // If no users found, send an empty array
//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No users found",
//       });
//     }

//     // Respond with the users data
//     return res.status(200).json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error retrieving users",
//     });
//   }
// };

const getAllUsers = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const regex = new RegExp(query, "i");

    const users = await User.find(
      {
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
      },
      "username name"
    );

    res.json(users);
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ error: "An error occurred during the search" });
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
