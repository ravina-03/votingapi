const { check, validationResult } = require("express-validator");

/** Validating User Data */

const createUserValidator = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password should not be empty.")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  createUserValidator,
};
