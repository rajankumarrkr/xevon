import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a plan name'],
        unique: true
    },
    minAmount: {
        type: Number,
        required: [true, 'Please add min amount']
    },
    maxAmount: {
        type: Number,
        default: 1000000
    },
    dailyPercent: {
        type: Number,
        required: [true, 'Please add daily percentage']
    },
    dailyEarning: {
        type: Number,
        default: 0
    },
    durationDays: {
        type: Number,
        default: 120
    },
    tier: {
        type: String,
        default: 'Standard'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
