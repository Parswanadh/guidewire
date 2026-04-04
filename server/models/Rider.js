import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['rider'], default: 'rider' },
    plan: { type: String, enum: ['basic', 'standard', 'premium'], default: 'standard' },
    dailyPremium: { type: Number, default: 9 },
    weeklyPremium: { type: Number, default: 63 },
    dailyCoverage: { type: Number, default: 250 },
    partnerId: { type: String, default: '' },
    zone: { type: String, default: '' },
    darkStore: { type: String, default: '' },
    hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', default: null },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    shieldStatus: {
      active: { type: Boolean, default: true },
      remainingDays: { type: Number, default: 7 },
    },
  },
  {
    timestamps: true,
  },
);

export const Rider = mongoose.model('Rider', riderSchema);
