const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const secret = "dgjhmbvxddggjgkhhkkjkll";
router.post("/register", async (req, res) => {

    //salt makes it difficult to unhash a password $ the value 10 makes it gen 10 diff password hence making it more harder

const salt = bcrypt.genSaltSync(10);

const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await userCollection.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password:hashedPassword
    });
    res.status(201).send("Created Successfully");
});

//to create a login route
router.post("/login", async(req, res) =>{
//find, findById or findOne
    const userDetail = await userCollection.findOne({email: req.body.email});

if(!userDetail) res.status(404).send("user-not-found");
//accept password by comparing password entered by the user and that was stored bfr
const doesPasswordMatch = bcrypt.compareSync(req.body.password, userDetail.password);

if (!doesPasswordMatch) return res.status(400).send("invalid credentials");

//passing user specfic details 
const token = jwt.sign({
     email: userDetail.email,
    userId: userDetail._id
    
    //passing user all details 
    //const token = jwt.sign(JSON.parse(JSON.stringify(userDetail)), 
}, process.env.jwt_secret);
    

res.send({
    message: "Sign in successful",
    token
});
});


module.exports = router;