import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Group sub-schema
const groupSchema = new Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group", // Reference to the Group collection
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    required: true,
  },
});
const friendSchema = new Schema(
  {
    friend_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  groups: [
    {
      group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },
      role: { type: String, enum: ["admin", "member"], required: true },
    },
  ], // Array of groups with roles
  friends: [friendSchema],
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
userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
