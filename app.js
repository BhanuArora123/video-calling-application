const express = require("express");
const app = express();
const socket = require("socket.io");
let server = app.listen(process.env.PORT||3000);
const cors = require("cors");
// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
// });

// app.use("/peerjs", peerServer);
app.use(cors({
    origin : "*"
}))
const io = socket(server,{
    cors:{
        origin : "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type","Access-Control-Allow-Origin"]
    }
});
io.on("connection",(socket) => {
    console.log("client connected");
    socket.on("join-room",(roomId,userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected",userId);
    });
})