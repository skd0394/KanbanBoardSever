const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
    default: "default-avatar.png",
  },
  recentlyVisitedBoards: {
    type: [mongoose.Types.ObjectId],
    ref: "Board",
  },
},{timestamps:true});

const User = new mongoose.model("User", UserSchema);
module.exports = User;
