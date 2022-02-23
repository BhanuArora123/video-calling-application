const socketIo = io("http://localhost:3000/");
const addVideoStream = (video, stream) => {
  const videoGrid = document.getElementById("video-grid");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};
let videoStream;
document.getElementById("btn").addEventListener("click",function(){
    let videoGridParent = document.getElementById("video-grid-parent");
    videoGridParent.innerHTML = `
      <div id="video-grid"></div>
    `;
    let roomId = this.value; 
    let peer = new Peer(undefined,{
        path: "/peerjs",
        host: "localhost",
        port: "443",
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
        call.answer(stream);
        call.on("stream",(otherUserStream) => {
          const video = document.createElement("video");
          addVideoStream(video,otherUserStream);
        })
      });
      socketIo.on("user-connected",(userId) => {
        const call = peer.call(userId,videoStream);
        call.on("stream",(otherUserStream) => {
          const video = document.createElement("video");
          addVideoStream(video,otherUserStream);
        })
      })
    })
})