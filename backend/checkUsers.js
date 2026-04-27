import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find().select('name mobile role createdAt');
        console.log('All Users:');
        console.table(users.map(u => ({ id: u._id.toString(), name: u.name, mobile: u.mobile, role: u.role })));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
