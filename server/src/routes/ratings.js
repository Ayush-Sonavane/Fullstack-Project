const router = require('express').Router();
const { submitRating, updateRating, getStoreRatings } = require('../controllers/ratingController');
const { submitRatingValidator, updateRatingValidator } = require('../validators/ratingValidator');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

// All routes below require authentication
router.use(authenticate);

// POST /api/ratings - Submit a rating (normal user only)
router.post('/', authorize('user'), submitRatingValidator, submitRating);

// PUT /api/ratings/:id - Update a rating (normal user only)
router.put('/:id', authorize('user'), updateRatingValidator, updateRating);

// GET /api/ratings/store/:storeId - Get ratings for a store
router.get('/store/:storeId', getStoreRatings);

module.exports = router;
