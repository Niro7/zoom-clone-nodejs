const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    //Request to access video and audio
    video: true,
    audio: true,
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
      $(".messages").append(
        `<li class="message" ><b>user</b></br>${message}</li>`
      ); //Append the message as list in ul tag
      scrollToBottom();
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

//Enable scrolling when messages overflow, the messages keep scrolling to bottom
const scrollToBottom = () => {
  let d = $(".main__chat__window");
  d.scrollTop(d.prop("scrollHeight"));
};

// Stop Audio and play audio
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled; //Get the Audio stream
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
              <span>Mute</span>
  `;
  document.querySelector(".main__mute__button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
              <span>Unmute</span>
  `;
  document.querySelector(".main__mute__button").innerHTML = html;
};
// Stop Video and play Video
const stopPlay = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideoButton();
  } else {
    setStopVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideoButton = () => {
  const html = `
  <i class="fas fa-video"></i>
            <span>Stop Video</span>
  `;
  document.querySelector(".main__video__button").innerHTML = html;
};

const setPlayVideoButton = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
            <span>Play Video</span>
  `;
  document.querySelector(".main__video__button").innerHTML = html;
};
