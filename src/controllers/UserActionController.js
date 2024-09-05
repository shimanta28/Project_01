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

const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res
      .status(400)
      .json({ message: "User ID and Friend ID are required" });
  }

  try {
    // Find the user and check if the friend is already in the friends array
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the friend already exists in the user's friends array
    const friendExists = user.friends.some(
      (friend) => friend.friend_id.toString() === friendId
    );

    if (friendExists) {
      return res
        .status(400)
        .json({ message: "Friend already exists in the friends list" });
    }

    // Add the friend to the user's friends array
    user.friends.push({
      friend_id: friendId, // If you use only the ID approach
      name: "Friend Name", // Optionally add other details if you have them
      username: "Friend Username",
      email: "Friend Email",
    });

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Friend added successfully", friends: user.friends });
  } catch (err) {
    console.error("Error adding friend:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the friend" });
  }
};

// Export multiple functions using named exports
export { getAllUsers, getUserById, addFriend };
