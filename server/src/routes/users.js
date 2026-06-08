const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updatePassword,
  getDashboardStats,
} = require('../controllers/userController');
const { createUserValidator, updatePasswordValidator } = require('../validators/userValidator');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

// All routes below require authentication
router.use(authenticate);

// GET /api/users/dashboard/stats - Admin dashboard stats
router.get('/dashboard/stats', authorize('admin'), getDashboardStats);

// PUT /api/users/password - Update own password (any authenticated user)
router.put('/password', updatePasswordValidator, updatePassword);

// GET /api/users - List users (admin only)
router.get('/', authorize('admin'), getUsers);

// GET /api/users/:id - Get user detail (admin only)
router.get('/:id', authorize('admin'), getUserById);

// POST /api/users - Create user (admin only)
router.post('/', authorize('admin'), createUserValidator, createUser);

module.exports = router;
