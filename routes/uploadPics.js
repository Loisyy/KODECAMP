const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/" });
const {taskCollection} = require("../schema/taskSchema");
const { isUserLoggedIn} = require("./middlewares");
//const { route } = require("./auth");

router.use(isUserLoggedIn);

router.post("/pic", upload.single("file"), async (req, res) => {

 try{
   const {taskTitle, taskBody } = req.body;
  const {filename} = req.file[0];

  console.log (req.file);
  console.log(req.originalname);

const newTask = await taskCollection.create({
      taskTitle, 
      taskBody, 
      pictureName: originalname
});

res.send({
    successful: true,
    newTask
});
 } catch(error){
res.status(500).json({message: "internal server error"});
 }
});

module.exports = router;
