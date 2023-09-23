const express = require("express");

const app = express();

app.get("/", (req, res) => {
res.send ("Hello");
});

app.get("/ping", (req, res) => {
res.send ("pong");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});