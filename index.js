const express = require("express");
const port = process.env.PORT || 4000;
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const tasksRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const path = require("path");
const taskwithPicture = require("./routes/uploadPics");

const connect = mongoose.connect(process.env.mongoDBURL);
//mongoDBURL=mongodb+srv://Loisy:zBiX0FJTSZnUvKnR@cluster0.eqpu6g6.mongodb.net/Kodecamp_crude.Backendtask

connect
  .then(() => {
    console.log("connected succesfully to datebase");
  })
  .catch((error) => {
    console.log("could not connect to the database reason = ", error);
  });

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/tasks", tasksRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/upload-pic", taskwithPicture)



app.listen(port, function () {
  console.log("listening to port", port);
});
