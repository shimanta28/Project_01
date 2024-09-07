import Group from "../models/Group.js";
import User from "../models/User.js";

const createGroupAndUpdateUser = async (req, res) => {
  const { name, members, _id } = req.body; // `_id` is the ID of the user creating the group (admin)

  if (!name || !members || !_id) {
    return res
      .status(400)
      .json({ message: "Name, members, and user ID are required" });
  }

  try {
    // Prepare the members array (including creator as admin)
    const groupMembers = [
      {
        user_id: _id, // Group creator
        role: "admin",
      },
      ...members.map((memberId) => ({
        user_id: memberId,
        role: "member",
      })),
    ];

    // Create a new group
    const newGroup = new Group({
      name,
      description: req.body.description || "", // Optional description if not provided
      members: groupMembers,
    });

    // Save the new group
    await newGroup.save();

    // Update each user's groups field with the group reference
    for (let member of groupMembers) {
      const { user_id, role } = member;
      await User.findByIdAndUpdate(
        user_id,
        {
          $addToSet: {
            // Ensures the group is added only once
            groups: { group_id: newGroup._id, role: role },
          },
        },
        { new: true } // Return the updated document
      ).exec();
    }

    // Populate members with full user details (excluding password)
    const populatedGroup = await Group.findById(newGroup._id)
      .populate({
        path: "members.user_id", // Populate the user_id field in members array
        select: "-password -__v", // Exclude password and version field
      })
      .exec();

    // Populate the group information in the user's groups array
    const updatedUsers = await User.find({
      _id: { $in: groupMembers.map((m) => m.user_id) },
    })
      .populate({
        path: "groups.group_id", // Populate the group details in user's groups array
        populate: {
          path: "members.user_id", // Populate the user details in the group
          select: "-password -__v", // Exclude password and version field
        },
        select: "-__v -members", // Exclude unnecessary fields (like __v and members)
      })
      .exec();

    return res.status(201).json({
      success: true,
      group: populatedGroup,
      updatedUsers, // Return updated users with populated group details
    });
  } catch (error) {
    console.error("Error creating group and updating users:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the group" });
  }
};

// Example of another controller: Get all groups
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate({
        path: "members.user_id",
        select: "-password -__v",
      })
      .exec();

    return res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving groups" });
  }
};

// Export multiple functions using named exports
export { createGroupAndUpdateUser, getAllGroups };
