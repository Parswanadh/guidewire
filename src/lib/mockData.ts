// ShieldRide Mock Data - Based on Strategic Doc
export interface MockUser {
  id: string;
  name: string;
  mobile: string;
  partnerId: string;
  darkStore: string;
  zone: string;
  activeSince: string;
  expiresOn: string;
  todayEarnings: number;
  coverageAmount: number;
  shieldStatus: {
    active: boolean;
    remainingDays: number;
  };
  plan: CoverageTier;
}

export type CoverageTier = 'basic' | 'standard' | 'premium';

export interface PlanConfig {
  dailyRate: number;
  dailyCoverage: number;
  triggers: string[];
}

export const COVERAGE_TIERS: Record<CoverageTier, PlanConfig> = {
  basic: {
    dailyRate: 6, // Approx per day
    dailyCoverage: 150,
    triggers: ['Rainfall', 'Heat', 'AQI', 'Platform', 'Internet', 'Fuel', 'Incentive'],
  },
  standard: {
    dailyRate: 9, // ₹63/week / 7
    dailyCoverage: 250,
    triggers: ['Rainfall', 'Heat', 'AQI', 'Platform', 'Internet', 'Fuel', 'Incentive'],
  },
  premium: {
    dailyRate: 12, // ₹84/week / 7
    dailyCoverage: 400,
    triggers: ['Rainfall', 'Heat', 'AQI', 'Platform', 'Internet', 'Fuel', 'Incentive'],
  },
};

export const MOCK_USER: MockUser = {
  id: 'USER_001',
  name: 'Ravi Kumar',
  mobile: '9876543210',
  partnerId: 'BLK-BLR-047',
  darkStore: 'BLK-BLR-047, Koramangala',
  zone: 'Koramangala 4th Block',
  activeSince: 'Jan 15, 2025',
  expiresOn: 'Mar 27, 2026',
  todayEarnings: 140,
  coverageAmount: 250,
  shieldStatus: {
    active: true,
    remainingDays: 7,
  },
  plan: 'standard',
};

export interface Trigger {
  id: string;
  type: 'Rainfall' | 'Heat' | 'AQI' | 'Platform' | 'Internet' | 'Fuel' | 'Incentive';
  status: 'active' | 'pending' | 'resolved' | 'warning';
  intensity: string;
  payout: number;
  timestamp: string;
  description: string;
}

export const MOCK_TRIGGERS: Trigger[] = [
  {
    id: 'TRG_001',
    type: 'Rainfall',
    status: 'active',
    intensity: '28mm/hr',
    payout: 180,
    timestamp: '08:47 AM',
    description: 'Heavy rainfall detected in Koramangala. Auto-payout triggered.',
  },
  {
    id: 'TRG_002',
    type: 'Platform',
    status: 'resolved',
    intensity: '60 min downtime',
    payout: 250,
    timestamp: 'Yesterday',
    description: 'Blinkit platform downtime detected at BLK-BLR-047.',
  },
];

export interface Claim {
  id: string;
  triggerType: string;
  amount: number;
  status: 'credited' | 'processing' | 'rejected';
  date: string;
  description: string;
}

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'SHR-2026-04471',
    triggerType: 'Heavy Rain',
    amount: 180,
    status: 'credited',
    date: 'Today, 08:49 AM',
    description: 'Parametric payout for 28mm/hr rainfall.',
  },
  {
    id: 'SHR-2026-04468',
    triggerType: 'Platform Outage',
    amount: 250,
    status: 'credited',
    date: 'Yesterday',
    description: '100% daily coverage for hub downtime.',
  },
];

export const INSURER_METRICS = {
  totalPolicies: 2847,
  activePolicies: 2705,
  totalClaims: 15420,
  pendingClaims: 8,
  lossRatio: 66.8,
  reserveAmount: 112000,
  projectedReserve: 154000,
  fraudScoreAvg: 14,
};

export interface FraudAlert {
  id: string;
  userName: string;
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
  timestamp: string;
  reasons: string[];
  claimId: string;
}

export const FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'F_001',
    userName: 'Ravi Kumar',
    riskLevel: 'low',
    score: 14,
    timestamp: '2026-03-20T08:48:00',
    claimId: 'SHR-2026-04471',
    reasons: ['GPS within 180m of store', 'Network degradation detected (Proof of outdoor)'],
  },
  {
    id: 'F_002',
    userName: 'Unknown Partner',
    riskLevel: 'high',
    score: 81,
    timestamp: '2026-03-20T09:14:00',
    claimId: 'SHR-2026-09921',
    reasons: ['Static coordinates for 2 hours', 'Ring Detection: Triggered (8 simultaneous)'],
  },
];

export const FAQ_RESPONSES: Record<string, any> = {
  'en-IN': {
    coverage: 'Your Shield covers 7 triggers: Rainfall, Heat, AQI, Platform downtime, Internet shutdowns, Fuel surges, and Incentive collapses.',
    claim: 'You do not need to file claims. ShieldRide detects triggers automatically and credits your UPI within 2 minutes.',
    payment: 'Premiums are deducted from your weekly Blinkit settlement. Payouts go directly to your linked UPI account.',
    accident: 'While we protect your income, Blinkit/Zomato provide separate accident insurance. Stay safe!',
  },
  'hi-IN': {
    coverage: 'आपका शील्ड 7 ट्रिगर्स को कवर करता है: बारिश, गर्मी, AQI, प्लेटफार्म डाउनटाइम, इंटरनेट शटडाउन, ईंधन की वृद्धि और प्रोत्साहन में गिरावट।',
    claim: 'आपको क्लेम करने की ज़रूरत नहीं है। शील्डराइड स्वचालित रूप से ट्रिगर्स का पता लगाता है और 2 मिनट के भीतर आपके UPI में पैसे भेज देता है।',
    payment: 'प्रीमियम आपके साप्ताहिक ब्लिंकिट भुगतान से काटा जाता है। भुगतान सीधे आपके लिंक किए गए UPI खाते में जाता है।',
    accident: 'हम आपकी आय की रक्षा करते हैं, जबकि ब्लिंकिट/ज़ोमैटो अलग से दुर्घटना बीमा प्रदान करते हैं। सुरक्षित रहें!',
  },
};
