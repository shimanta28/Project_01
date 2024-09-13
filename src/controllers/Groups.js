import Group from "../models/Group.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

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
        select: "-password -friends -groups -__v", // Exclude password and version field
      })
      .exec();

    // Populate the group information in the user's groups array
    const updatedUsers = await User.find({
      _id: { $in: groupMembers.map((m) => m.user_id) },
    })
      .populate({
        path: "groups.group_id", // Populate the group details in user's groups array
        select: "-__v -members ", // Exclude unnecessary fields (like __v and members)
      })
      .exec();

    return res.status(201).json({
      success: true,
      group: populatedGroup,
      // updatedUsers, // Return updated users with populated group details
    });
  } catch (error) {
    console.error("Error creating group and updating users:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the group" });
  }
};

const getGroupById = async (req, res) => {
  const { _id } = req.params; // Get group ID from the request parameters

  try {
    // Find the group by its ID and populate the members with full user details
    const group = await Group.findById(_id)
      .populate({
        path: "members.user_id", // Populate the user_id field in members array
        select: "-password -__v", // Exclude password and version field
      })
      .exec();

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Return the populated group details
    return res.status(200).json({
      success: true,
      group, // The fully populated group details
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the group",
    });
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

const createTransaction = async (req, res) => {
  const { _id, group_id, description, amount, shares } = req.body;

  if (!_id || !group_id || !description || !amount || !shares) {
    return res.status(400).json({
      message:
        "All fields (user_id, group_id, description, amount, shares) are required",
    });
  }

  try {
    // Validate if the user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate if the group exists
    const group = await Group.findById(group_id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Validate if the members in the `shares` exist in the group
    const groupMemberIds = group.members.map((member) =>
      member.user_id.toString()
    );
    const invalidMembers = Object.keys(shares).filter(
      (userId) => !groupMemberIds.includes(userId)
    );

    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: "One or more users in shares are not part of the group",
      });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      user_id: _id,
      group_id: group_id,
      description: description,
      amount: amount,
      share: shares,
    });

    // Save the transaction to the database
    await newTransaction.save();
    const shareWithUserNames = {};
    const userIds = Object.keys(shares);

    for (const userId of userIds) {
      const user = await User.findById(userId).select("name");
      if (user) {
        shareWithUserNames[user.name] = shares[userId]; // Replace ID with name
      }
    }

    // Return response with user names instead of user IDs in the share object
    return res.status(201).json({
      success: true,
      transaction: {
        _id: newTransaction._id,
        user_id: newTransaction.user_id,
        group_id: newTransaction.group_id,
        description: newTransaction.description,
        amount: newTransaction.amount,
        share: shareWithUserNames, // Return the share object with names as keys
        createdAt: newTransaction.createdAt,
        updatedAt: newTransaction.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the transaction" });
  }
};

// Export multiple functions using named exports
export {
  createGroupAndUpdateUser,
  getAllGroups,
  getGroupById,
  createTransaction,
};
