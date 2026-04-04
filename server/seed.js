import bcrypt from 'bcryptjs';
import { Hub } from './models/Hub.js';
import { Insurer } from './models/Insurer.js';

const DEFAULT_HUBS = [
  { code: 'BLK-BLR-047', name: 'Koramangala 4th Block Hub', city: 'Bengaluru', zone: 'Zone 4', lat: 12.9352, lng: 77.6245 },
  { code: 'BLR-BEL-021', name: 'Bellandur Hub', city: 'Bengaluru', zone: 'Zone 7', lat: 12.9279, lng: 77.6762 },
  { code: 'BLR-HSR-019', name: 'HSR Layout Hub', city: 'Bengaluru', zone: 'Zone 5', lat: 12.9116, lng: 77.6412 },
  { code: 'BLR-INR-011', name: 'Indiranagar Hub', city: 'Bengaluru', zone: 'Zone 3', lat: 12.9719, lng: 77.6412 },
];

export async function seedDefaults() {
  await seedHubs();
  await seedInsurer();
}

async function seedHubs() {
  const count = await Hub.countDocuments();
  if (count > 0) return;
  await Hub.insertMany(DEFAULT_HUBS);
}

async function seedInsurer() {
  const email = process.env.INSURER_EMAIL || 'insurer@shieldride.ai';
  const password = process.env.INSURER_PASSWORD || 'Insurer@123';

  const existing = await Insurer.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Insurer.create({
    name: 'ShieldRide Ops Admin',
    email,
    passwordHash,
  });
}
