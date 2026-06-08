const { validationResult } = require('express-validator');
const { Rating, Store, User } = require('../models');

/**
 * POST /api/ratings
 * Normal User: Submit a rating for a store
 */
const submitRating = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Verify store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { user_id, store_id },
    });

    if (existingRating) {
      return res.status(409).json({
        message: 'You have already rated this store. Use PUT to modify.',
        existingRating,
      });
    }

    const newRating = await Rating.create({ user_id, store_id, rating });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/ratings/:id
 * Normal User: Modify their submitted rating
 */
const updateRating = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { rating } = req.body;
    const ratingId = req.params.id;

    // Find the rating
    const existingRating = await Rating.findByPk(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Ensure user owns this rating
    if (existingRating.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only modify your own ratings' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.json({
      message: 'Rating updated successfully',
      rating: existingRating,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stores/:storeId/ratings
 * Get all ratings for a specific store
 */
const getStoreRatings = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ ratings });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRating, updateRating, getStoreRatings };
