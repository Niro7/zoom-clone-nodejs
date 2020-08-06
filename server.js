const express = require("express");
const app = express(); //Initialize express
const server = require("http").Server(app);

//set ejs as view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //   res.status(200).send("Hello World!");
  res.render("room");
});

server.listen(3030);
