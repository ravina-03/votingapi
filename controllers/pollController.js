const { poll } = require("../models/pollModel");

/**
 * Getpolls details.
 *
 * @param {Object} req -  The Request Object
 * @param {Object} res - A JSON response indicating success or failure based on validation.
 * @return {Object}  - Get poll details created by user.
 */
const getPoll = async (req, res) => {
  try {
    const results = await poll.findAll({
      where: {
        createdBy: req.createdBy,
      },
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "No polls found." });
    }

    const listPoll = results.map((poll) => ({
      id: poll.id,
      pollName: poll.pollName,
      pollChoices: poll.pollChoices,
    }));

    return res.status(200).json({
      Total: listPoll.length,
      data: listPoll,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * createpoll.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollName - The pollName of the poll to create.
 * @param {string} req.body.pollChoices - The choice the poll user wants to create.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const createPoll = async (req, res) => {
  const { pollName, pollChoices } = req.body;

  try {
    const pollExist = await poll.findOne({
      where: {
        pollName: pollName,
      },
    });
    if (pollExist) {
      return res.json({ msg: "Poll is Already Created" });
    }

    await poll.create({
      pollName: pollName.trim(),
      pollChoices: pollChoices,
      createdBy: req.user.id,
    });

    const pollData = {
      pollName: pollName.trim(),
      pollChoices: pollChoices,
    };

    return res.status(200).json({
      msg: "Poll Is Created",
      pollData,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Something Went Wrong While Creating A Poll",
      error: error.message,
    });
  }
};


/**
 * updatepoll.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollName - The pollName of the poll to create.
 * @param {string} req.body.pollChoices - The choice the poll user wants to create.
 * @param {string} req.body.pollNameToUpdate - The name of the poll which want to update.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const updatePoll = async (req, res) => {
  const { pollName, pollChoices } = req.body;
  const pollNameToUpdate = req.query.name;

  try {
    const updatePoll = await poll.findOne({
      where: {
        pollName: pollNameToUpdate,
        createdBy: req.createdBy,
      },
    });

    if (!updatePoll) {
      return res.status(403).json({
        message: "Unauthorized Or Poll does not exist..",
      });
    }
    if (pollName) {
      updatePoll.pollName = pollName.trim();
    }

    if (pollChoices) {
      updatePoll.pollChoices = pollChoices;
    }

    await updatePoll.save();

    const resPoll = {
      id: updatePoll.id,
      pollName: updatePoll.pollName,
      pollChoices: updatePoll.pollChoices,
    };

    return res.status(200).json({
      message: "Poll Updated",
      updatedPoll: resPoll,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Went Wrong While Updating A Todo",
      error: error.message,
    });
  }
};

/**
 * deletepoll.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollNameToDelete - The name of the poll which want to delete.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const deletePoll = async(req,res) => {  
  const pollNameToDelete = req.query.name;
  try {
    
    const pollDelete = await poll.findOne({
      where: {
        pollName: pollNameToDelete,
        createdBy: req.createdBy,
      },
    });

    if(!pollDelete){
      return res.json({msg:'Poll is deleted or not exist'});
    }
    
    await pollDelete.destroy();

    const deletedTodo = {
      id: pollDelete.id,
      pollName: pollDelete.pollName,
      pollChoices: pollDelete.pollChoices,
    };
    return res.status(200).json({
      message: "Poll deleted successfully",
      DeletedTodo: deletedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting the poll",
      error: error.message,
    });
  }
}

module.exports = {
  createPoll,
  getPoll,
  updatePoll,
  deletePoll
};



