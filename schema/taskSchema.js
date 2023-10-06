const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },

    taskBody: {
      type: String,
      required: true,
    },
    pictureName: {
      type: String,
      default: ""
    },
    user:{
      type: mongoose.Schema.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true });

const taskCollection = mongoose.model("task", taskSchema);

module.exports = {
  taskCollection,
};
