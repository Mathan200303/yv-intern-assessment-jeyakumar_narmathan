import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';
import MembershipType from './src/models/MembershipType.js';

const seedDB = async () => {
  try {
    await connectDB();

    const chairmanEmail = 'chairman@gmail.com';
    let chairman = await User.findOne({ email: chairmanEmail });
    if (!chairman) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('chairman123', salt);

      chairman = new User({
        fullName: 'System Chairman',
        email: chairmanEmail,
        passwordHash,
        userType: 'CHAIRMAN'
      });
      await chairman.save();
      console.log('Chairman created: chairman@gmail.com / chairman123');
    } else {
      console.log('Chairman already exists');
    }

    const types = [
      { name: 'Individual Standard', applicableTo: 'INDIVIDUAL', annualFee: 5000 },
      { name: 'Individual Premium', applicableTo: 'INDIVIDUAL', annualFee: 15000 },
      { name: 'Corporate Standard', applicableTo: 'COMPANY', annualFee: 50000 }
    ];

    for (let type of types) {
      const existing = await MembershipType.findOne({ name: type.name });
      if (!existing) {
        await MembershipType.create(type);
        console.log(`Membership Type created: ${type.name}`);
      }
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
