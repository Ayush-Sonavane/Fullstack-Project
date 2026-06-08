const router = require('express').Router();
const {
  getStores,
  getStoreById,
  createStore,
  getOwnerDashboard,
} = require('../controllers/storeController');
const { createStoreValidator } = require('../validators/storeValidator');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

// All routes below require authentication
router.use(authenticate);

// GET /api/stores/owner/dashboard - Store owner dashboard
router.get('/owner/dashboard', authorize('store_owner'), getOwnerDashboard);

// GET /api/stores - List all stores (any authenticated user)
router.get('/', getStores);

// GET /api/stores/:id - Get store detail
router.get('/:id', getStoreById);

// POST /api/stores - Create store (admin only)
router.post('/', authorize('admin'), createStoreValidator, createStore);

module.exports = router;
