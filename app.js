require("dotenv").config();

const express = require("express");
const app = express();
const { sequelize } = require("./config/db");
const passport = require("./utills/passport-config");
const  {user,poll} = require('./models/associations');

const http = require("http");
const socketIo = require("socket.io");
const helmet = require("helmet");
const { userRouter } = require("./routers/userRouter");
const { pollRouter } = require("./routers/pollRouter");
const { voteRouter } = require("./routers/voteRouter");
const { checkAuthenticated } = require("./middlewares/auth");


const {vote} = require('./models/voteModel');
const PORT = process.env.PORT || 3000;

/* Middewares */
app.use(express.json());
app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());


/* Routes For User and voting */

app.use("/users/", userRouter);
app.use("/vote/", checkAuthenticated, voteRouter);
app.use("/poll/", checkAuthenticated, pollRouter);
app.use("/result/", voteRouter);

const server = http.createServer(app);
const io = socketIo(server);

/* Socket Io connection For vote Counting */
io.on("connection", (socket) => {
    console.log("New client connected");
  
    socket.on("livevote", async (data) => {
      const result = await vote.findAll({
        where:{
          pollId: data
        }
      });
  
      const listVotes = result.map((data) => ({
        choice: data.choice,
        count: data.count,
      }));
      io.emit("countvotes", listVotes);
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

/* Databse Synchronization and Connection */

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been authenticated successfully.");
    await sequelize.sync({ alter: true, force: false });
    console.log("Database schema has been synchronized.");
    server.listen(PORT, () => {
      console.log(`Server Started AT ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Error connecting to database or synchronizing schema:",
      error
    );
  }
}

startServer();
