import mongoose from "mongoose";

const { Schema } = mongoose;

// Group member schema (sub-schema for group members)
// const groupMemberSchema = new Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Reference to the User collection for population
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "member"],
//     required: true,
//   },
// });

// Group schema
const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // unique: true, // Removed uniqueness to allow duplicate group names
  },
  description: {
    type: String,
    default: "",
  },
  members: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: { type: String, enum: ["admin", "member"], required: true },
    },
  ], // Array of group members with roles
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` before saving
groupSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
