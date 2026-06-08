const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register - Normal user signup
router.post('/register', registerValidator, register);

// POST /api/auth/login - Login (all roles)
router.post('/login', loginValidator, login);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, getMe);

module.exports = router;
