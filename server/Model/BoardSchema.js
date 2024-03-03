const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Please provide a board name",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique:true,
    },
    members: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Board = new mongoose.model("Board", BoardSchema);

module.exports = Board;
