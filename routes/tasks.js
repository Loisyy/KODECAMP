const express = require("express");
const route = express.Router();
const { taskCollection } = require("../schema/taskSchema");
const jwt = require("jsonwebtoken");
const router = require("./auth");
const { config } = require("dotenv");
const { Collection } = require("mongoose");
const {isUserLoggedIn, adminsOnly} = require("./middlewares");
require("dotenv").config();


// Use middleware for routes that require authentication
route.use(isUserLoggedIn);

route.get("/", async (req, res) => {
  console.log(req.headers);
  const tasks = await taskCollection.find({user: req.user.userId}); // Changed req.decoded to req.user
  res.json(tasks);
});

route.post("/", async (req, res) => {
  const{taskTitle, taskBody} = req.body;
  const {userId} = req.decoded;
  const newTask = await taskCollection.create({
    taskTitle,
    taskBody,
    user: userId // Changed req.decoded to req.user
  });
  res.json({
    isRequestSuccessful: true,
    newTask,
  });
});

route.get("/by-id/:id", async (req, res) => {
  const task = await taskCollection.findById(req.params.id);
  res.send(task);
});

route.get("/by-task-title/:task", async (req, res) => {
  const task = await taskCollection.findOne({ taskTitle: req.params.task });

  if (!task) {
    return res.status(404).send("not-found");
  }
  res.send(task);
});

route.patch("/:id", async (req, res) => {
  const {id} = req.params;
  const updatedTask = await taskCollection.findByIdAndUpdate(id,
    {
      taskBody: req.body.taskBody,
    },
    { new: true }
  );
  res.json({
    message: "task updated successfully!",
    updatedTask,
  });
});

route.delete("/:id", async (req, res) => {
   const { id } = req.params;
  const note = await taskCollection.findById(id);
  if(!req.decoded.userId != note.user){
    res.status(404)("you are not allowed to delete this task!");
    return;
  }
  await taskCollection.findByIdAndDelete(req.params.id);
  res.send("task deleted successfully!");
});



route.get("/admin/all-tasks", adminsOnly, async (req, res) =>{
  const tasks = await taskCollection.find();
  res.send(tasks);
});

module.exports = route;
