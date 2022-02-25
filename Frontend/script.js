const socketIo = io("https://video-calling-application12345.herokuapp.com");
socketIo.on("connection", (socket) => {
  console.log("connect through websockets");
})
const addVideoStream = (video, stream) => {
  const videoGrid = document.getElementById("video-grid");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};
let usersInCall = {};
let videoStream;
document.getElementById("btn").addEventListener("click",function(){
    let videoGridParent = document.getElementById("video-grid-parent");
    videoGridParent.innerHTML = `
      <div id="video-grid"></div>
    `;
    let roomId = this.value; 
    let peer = new Peer(undefined,{
        path: "/peerjs",
        host: "peerserver-video-app.herokuapp.com",
        secure : true
      });
    peer.on("open",(id) => {
      socketIo.emit("join-room",roomId,id);
    });
    navigator.mediaDevices.getUserMedia({
      video : true,
      audio : false
    }).then((stream) => {
      const video = document.createElement("video");
      videoStream = stream;
      addVideoStream(video,stream);
      peer.on("call",(call) => {
        console.log("called up");
        call.answer(stream);
        call.on("stream",(otherUserStream) => {
          const video = document.createElement("video");
          addVideoStream(video,otherUserStream);
        })
      });
      socketIo.on("user-connected",(userId,socketId) => {
        console.log("emitted");
        const call = peer.call(userId,videoStream);
        call.on("stream",(otherUserStream) => {
          const video = document.createElement("video");
          addVideoStream(video,otherUserStream);
        })
      })
    })
})