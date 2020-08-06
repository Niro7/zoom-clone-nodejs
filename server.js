const express = require("express");
const app = express(); //Initialize express
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid"); //Import the uuid library
app.set("view engine", "ejs"); //set ejs as view engine
app.use(express.static("public"));

app.get("/", (req, res) => {
  //   res.status(200).send("Hello World!");
  //   res.render("room");
  res.redirect(`/${uuidv4()}`); // Redirect root URLgenerate unique uuid
});

//new Url to represent room ID
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
server.listen(3030);
