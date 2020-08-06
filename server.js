const express = require("express");
const app = express(); //Initialize express
const server = require("http").Server(app);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

server.listen(3030);
