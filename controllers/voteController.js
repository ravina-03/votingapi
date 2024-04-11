const { poll } = require("../models/pollModel");
const { vote } = require("../models/voteModel");

/**
 * votechoices..
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollId - The ID of the poll to vote in.
 * @param {string} req.body.choice - The choice the user wants to vote for.
 * @param {Object} req.user - The authenticated user object (assumed to have an ID property).
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the vote request.
 */
const voteChoices = async (req, res) => {
  const { pollId, choice } = req.body;

try {
    const pollExists = await poll.findByPk(pollId);
    
    if (!pollExists) {
      return res.status(404).json({ error: "Poll not found" });
    }


    if (!pollExists.choicesInitialized) {
      const initializeChoices = pollExists.pollChoices;
      for (let i = 0; i < initializeChoices.length; i++) {
        const existingChoice = await vote.findOne({
          where: { pollId: pollId, choice: initializeChoices[i] },
        });
        if (!existingChoice) {
          await vote.create({ pollId: pollId, choice: initializeChoices[i], count: 0,});
        }
      }
      pollExists.choicesInitialized = true;
      await pollExists.save();
    }

    if (!pollExists.pollChoices.includes(choice)) {
      return res.status(400).json({ error: "Invalid choice" });
    }


    const isExistVote = await vote.findOne({ where: { pollId, choice } });

    if (isExistVote) {
      let votedByArray = isExistVote.votedBy ? JSON.parse(isExistVote.votedBy) : [];

      if (!votedByArray.includes(req.user.id)) {
        votedByArray.push(req.user.id);
        isExistVote.count += 1;
        isExistVote.votedBy = JSON.stringify(votedByArray);
        await isExistVote.save();
      } else {
        return res.json({ msg: "User already voted for this choice." });
      }
    } else {
      await vote.create({
        pollId,
        choice,
        count: 1,
        votedBy: JSON.stringify([req.user.id]),
      });
    }
    return res.json({ msg: "Voted" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * get votes result..
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters object.
 * @param {string} req.params.id - The ID of the poll to retrieve votes for.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while retrieving or formatting the vote data.
 */
const getVotes = async (req, res) => {
  const pollId = req.params.id;
  const result = await vote.findAll({
    where: {
      pollId: pollId,
    },
  });

  const listVotes = result.map((data) => ({
    choice: data.choice,
    count: data.count,
  }));
  return res.json(listVotes);
};

module.exports = {
  voteChoices,
  getVotes,
};
