const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Store, User, Rating, sequelize } = require('../models');

/**
 * GET /api/stores
 * Authenticated: List all stores with search, sort, and ratings
 */
const getStores = async (req, res, next) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

    // Build where clause
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    // Validate sort field
    const allowedSortFields = ['name', 'email', 'address', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'rating', 'user_id'],
        },
      ],
    });

    // Calculate average rating and user's rating for each store
    const storesWithRatings = stores.map((store) => {
      const storeData = store.toJSON();
      const ratings = storeData.ratings || [];

      // Calculate average
      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : null;

      // Find current user's rating
      const userRating = ratings.find((r) => r.user_id === req.user.id);

      return {
        ...storeData,
        averageRating: avgRating,
        totalRatings: ratings.length,
        userRating: userRating ? { id: userRating.id, rating: userRating.rating } : null,
        ratings: undefined, // Remove raw ratings from response
      };
    });

    res.json({ stores: storesWithRatings });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stores/:id
 * Authenticated: Get store details with ratings
 */
const getStoreById = async (req, res, next) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];

    storeData.averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : null;
    storeData.totalRatings = ratings.length;

    res.json({ store: storeData });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stores
 * Admin: Create a new store + its owner in one go
 */
const createStore = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      name, email, address,
      ownerName, ownerEmail, ownerPassword, ownerAddress,
    } = req.body;

    // Check if owner email already exists
    const existingUser = await User.findOne({ where: { email: ownerEmail } });
    if (existingUser) {
      await t.rollback();
      return res.status(409).json({ message: 'Owner email already registered' });
    }

    // 1. Create the store owner user
    const owner = await User.create({
      name: ownerName,
      email: ownerEmail,
      password: ownerPassword,
      address: ownerAddress,
      role: 'store_owner',
    }, { transaction: t });

    // 2. Create the store linked to that owner
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner.id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Store and owner created successfully',
      store,
      owner: owner.toJSON(),
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * GET /api/stores/owner/dashboard
 * Store Owner: Get own store's ratings and raters
 */
const getOwnerDashboard = async (req, res, next) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : null;

    res.json({
      store: {
        id: storeData.id,
        name: storeData.name,
        email: storeData.email,
        address: storeData.address,
        averageRating,
        totalRatings: ratings.length,
        raters: ratings.map((r) => ({
          id: r.user.id,
          name: r.user.name,
          email: r.user.email,
          rating: r.rating,
          ratedAt: r.created_at,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStores, getStoreById, createStore, getOwnerDashboard };
