const { body } = require('express-validator');

const createStoreValidator = [
  // Store fields
  body('name')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name is required and must not exceed 60 characters'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid store email address'),

  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Store address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Store address is required'),

  // Owner fields
  body('ownerName')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Owner name must be between 20 and 60 characters'),

  body('ownerEmail')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid owner email address'),

  body('ownerPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Owner password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Owner password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Owner password must contain at least one special character'),

  body('ownerAddress')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Owner address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Owner address is required'),
];

module.exports = { createStoreValidator };
