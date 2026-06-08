const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

/**
 * GET /api/users
 * Admin: List all users with filtering and sorting
 */
const getUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    // Build where clause for filters
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    // Validate sort field
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      order: [[sortField, sortOrder]],
      attributes: { exclude: ['password'] },
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Admin: Get user details (including rating if store owner)
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'store',
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: [],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If store owner, calculate average rating
    const userData = user.toJSON();
    if (userData.role === 'store_owner' && userData.store) {
      const avgResult = await Rating.findOne({
        where: { store_id: userData.store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
        ],
        raw: true,
      });
      userData.store.averageRating = avgResult?.averageRating
        ? parseFloat(avgResult.averageRating).toFixed(1)
        : null;
      userData.store.totalRatings = parseInt(avgResult?.totalRatings) || 0;
    }

    res.json({ user: userData });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Admin: Create a new user (admin, normal user, or store owner)
 */
const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, address, role });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/password
 * Authenticated: Update own password
 */
const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/dashboard/stats
 * Admin: Dashboard stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, updatePassword, getDashboardStats };
