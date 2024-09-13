import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Transaction schema
const transactionSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model to reference
      required: true,
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Assuming you have a Group model to reference
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    share: {
      type: Map,
      of: Number, // user_id (as key) will map to the amount they need to pay
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
