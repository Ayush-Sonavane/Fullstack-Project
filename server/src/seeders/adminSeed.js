/**
 * Seed script to create the default admin user.
 * Run with: npm run seed
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { sequelize, User } = require('../models');

const seedAdmin = async () => {
  try {
    // Connect and sync
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    await sequelize.sync();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@storerating.com' },
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: 'Admin@1234',
      address: 'Platform Headquarters, Main Street',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@1234`);
    console.log(`   Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
