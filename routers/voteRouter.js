const express = require("express");
const voteRouter = express.Router();
const { voteChoices,getVotes } = require("../controllers/voteController");

/**
 * Routes For Voting..
 * @name get /:id getVotes Result
 * @name post /:id  Vote to the choices
 */
voteRouter.get('/:id',getVotes);
voteRouter.post("/:id", voteChoices);


module.exports = {
  voteRouter,
};
