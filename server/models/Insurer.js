import mongoose from 'mongoose';

const insurerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['insurer'], default: 'insurer' },
  },
  {
    timestamps: true,
  },
);

export const Insurer = mongoose.model('Insurer', insurerSchema);
