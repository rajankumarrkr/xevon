import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dailyPercent: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true }
});

const Plan = mongoose.model('Plan', PlanSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Atlas');

        await Plan.deleteMany({});
        
        const plans = [
            { name: 'Stable Yield Alpha', dailyPercent: 2.5, durationDays: 30, minAmount: 500, maxAmount: 10000 },
            { name: 'Growth Pool Beta', dailyPercent: 4.0, durationDays: 15, minAmount: 2000, maxAmount: 50000 },
            { name: 'High-Velocity Gamma', dailyPercent: 8.0, durationDays: 7, minAmount: 5000, maxAmount: 100000 }
        ];

        await Plan.insertMany(plans);
        console.log('Successfully seeded 3 plans to xevon database');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
