const express = require("express");
const app = express();



const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { connectToMongoDb } = require("./config/connection.js");
connectToMongoDb();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));