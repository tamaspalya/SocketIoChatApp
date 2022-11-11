const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    //Joining a room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    //Leaving a room
    socket.on("leave_room", (data) => {
        socket.leave(data);
        console.log(`User with ID: ${socket.id} left the room: ${data}`);
    });

    //Sending a message
    socket.on("send_message", (data) => {
        //console.log(data);
        socket.to(data.room).emit("receive_message", data); //sending the message to the client that is listening in the specified room
    });

    //Disconnecting
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING, listening on port: 3001");
});