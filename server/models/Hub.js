import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    zone: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const Hub = mongoose.model('Hub', hubSchema);
