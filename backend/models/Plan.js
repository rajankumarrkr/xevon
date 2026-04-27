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
        required: [true, 'Please add max amount']
    },
    dailyPercent: {
        type: Number,
        required: [true, 'Please add daily percentage']
    },
    durationDays: {
        type: Number,
        default: 365
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
