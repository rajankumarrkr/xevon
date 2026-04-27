import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.js';
import User from './models/User.js';

dotenv.config();

const plans = [
    {
        name: 'STAR PLAN',
        minAmount: 500,
        maxAmount: 5000,
        dailyPercent: 2,
        durationDays: 365
    },
    {
        name: 'GOLD PLAN',
        minAmount: 5001,
        maxAmount: 20000,
        dailyPercent: 2.5,
        durationDays: 365
    },
    {
        name: 'VIP PLAN',
        minAmount: 20001,
        maxAmount: 100000,
        dailyPercent: 3.5,
        durationDays: 365
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear existing plans and users
        await Plan.deleteMany();
        await User.deleteMany();
        console.log('Database cleared');

        // Add plans
        await Plan.insertMany(plans);
        console.log('Plans seeded successfully!');

        // Check if admin exists
        const adminMobile = '9999999999';
        const adminExists = await User.findOne({ mobile: adminMobile });
        if (!adminExists) {
            await User.create({
                name: 'XEVON ADMIN',
                mobile: adminMobile,
                password: 'adminpassword123',
                role: 'admin',
                referralCode: 'ADMIN77'
            });
            console.log('Admin user created (Mobile: 9999999999, Password: adminpassword123)');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDB();
