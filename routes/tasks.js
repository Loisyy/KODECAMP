const express = require("express");
const route = express.Router();
const { taskCollection } = require("../schema/taskSchema");
const jwt = require("jsonwebtoken");
const router = require("./auth");
const { config } = require("dotenv");
require("dotenv").config();

//to login in before doing a task
function isUserLoggedIn(req, res, next){
 const authorizationHeader =  req.headers.authorization;

 if(!authorizationHeader){
  res.status(401).send("no-authorization-header");
  return;
 }

 const val = authorizationHeader.split(" ");

 const tokentype = val[0];

 const tokenValue = val[1];

  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token){
    return res.status(403).send("A token is required for authentication");
  }
  try{
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  }catch (err){
    return
    res.status(401).send("Invalid token");
  }
  return
  next();
 };

//  if (tokentype == "Bearer"){
//   const decoded = jwt.verify(tokenValue, process.env.jwt_secret);
//   req.decoded = decoded;
//   next();
//   return;
//  }
//  res.status(401).send("Not-Authorized");
// }

route.get("/", async (req, res) => {
  console.log(req);
  const tasks = await taskCollection.find({user: req.decoded.userId});
  res.json(tasks);
});

route.post("/", async (req, res) => {
  const newTask = await taskCollection.create({
    taskTitle: req.body.taskTitle,
    taskBody: req.body.taskBody,
    user: req.decoded.userId
  });
  res.json({
    isRequestSuccessful: true,
    newTask,
  });
});

// to find by id 👇

route.get("/by-id/:id", async (req, res) => {
  const task = await taskCollection.findById(req.params.id);
  res.send(task);
});

// to find by title 👇
route.get("/by-task-title/:task", async (req, res) => {
  const task = await taskCollection.findOne({ taskTitle: req.params.task });

  // but if not found then recieve an error messgae👇
  if (!task) {
    return res.status(404).send("not-found");
  }
  res.send(task);
});

// to edit 👇
route.patch("id", async (req, res) => {
  await taskCollection.findByIdAndUpdate(
    req.params.id,
    {
      taskBody: res.body.taskBody,
    },
    { new: true }
  );
  res.json({
    message: "task updated successfully!",
    updatedTask,
  });
  //res.send("task updated successfully!");
});

// to delete 👇
route.delete("id", async (req, res) => {
  await taskCollection.findByIdAndDelete(req.params.id);
  res.send("task deleted successfully!");
});

module.exports = route;