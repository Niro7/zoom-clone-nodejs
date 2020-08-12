const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    //Request to access video and audio
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      //video of the new user displayed
      //Answer the call from another user, the call made "connecToNewUser" function
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream); //Add that received video stream
      });
    });

    socket.on("user-connected", (userId) => {
      // listen to my stream and then send it to others
      connecToNewUser(userId, stream);
    });
    // Get message using jQuery
    let text = $("input");

    //Send msg on pressing Enter key
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        // console.log(text.val());
        socket.emit("message", text.val()); //sending the message from frontend
        text.val("");
      }
    });
    // Receive the message (through Server)
    socket.on("createMessage", (message) => {
      console.log(message);
      $("ul").append(`<li class="message" ><b>user</b></br>${message}</li>`); //Append the message as list in ul tag
    });
  });

peer.on("open", (id) => {
  // console.log(id);
  socket.emit("join-room", ROOM_ID, id); //id is automatically generated: id is the ID of the new user who's joining
});

const connecToNewUser = (userId, stream) => {
  // console.log("new user");
  // console.log(userId);
  //User makes call
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    //Receive another person's video stream
    addVideoStream(video, userVideoStream); //Sending our own stream
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
