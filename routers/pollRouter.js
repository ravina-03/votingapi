const express = require("express");
const pollRouter = express.Router();
const { createPoll,getPoll, updatePoll, deletePoll } = require("../controllers/pollController");

/**
 * Routes For Poll..
 * @name get /getpoll -  get polls created by user.
 * @name POST /createpoll - create a new poll.
 * @name put /updatepoll - update a poll
 * @name delete /deletePoll - delete a  poll
 */
pollRouter.get("/getpoll", getPoll);
pollRouter.post("/createpoll",createPoll);
pollRouter.put('/updatepoll',updatePoll);
pollRouter.delete('/deletePoll',deletePoll);

module.exports = {
  pollRouter,
};
