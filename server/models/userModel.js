const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient", "Admin"],
    },
    status: {
      type: String,
      default: "pending",
    },
    mobile: String,
    address: String,
    gender: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
