const express = require("express");
const app = express(); //Initialize express
const server = require("http").Server(app);
const io = require("socket.io")(server); //Import socket.io
const { v4: uuidv4 } = require("uuid"); //Import the uuid library
const { ExpressPeerServer } = require("peer"); // import peer
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs"); //set ejs as view engine
app.use(express.static("public"));

app.use("/peerjs", peerServer);
app.get("/", (req, res) => {
  //   res.status(200).send("Hello World!");
  //   res.render("room");
  res.redirect(`/${uuidv4()}`); // Redirect root URLgenerate unique uuid
});

//new Url to represent room ID
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // console.log("WE have joined Room!");
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId); //user Id of the user connected
    // When user connected message can be sent
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message); //Send message to the room with that particular ID
    });
  });
});
server.listen(process.env.PORT || 3030); //Declare port of server to work on heroku
