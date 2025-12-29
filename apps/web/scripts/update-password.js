import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sequelize from '../app/lib/sequelize.js';

async function updatePassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const newPassword = await bcrypt.hash('Admin123!', 10);
    console.log('New hashed password generated');

    const [affectedRows] = await User.update(
      { password: newPassword },
      { where: { email: 'admin@anapi.cd' } }
    );

    if (affectedRows > 0) {
      console.log('Password updated for admin@anapi.cd');
    } else {
      console.log('User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePassword();
