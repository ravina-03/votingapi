const { poll } = require("./pollModel");
const { user } = require("./userModel");

/**
 * Establishes a many-to-one association between the user and poll models.
 *
 * @param {object} user - The user model.
 * @param {object} poll - The poll model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
poll.belongsTo(user, { foreignKey: "createdBy" });

/**
 * one-to-many association between the user and poll models.
 *
 * @param {object} user - The user model.
 * @param {object} poll - The poll model.
 * @param {string} options.foreignKey - The foreign key to use for the association.
 */
user.hasMany(poll, { foreignKey: "createdBy" });
