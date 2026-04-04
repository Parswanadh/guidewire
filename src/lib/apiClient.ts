export type UserRole = 'rider' | 'insurer';

export interface RiderUser {
  id: string;
  role: 'rider';
  name: string;
  mobile: string;
  plan: 'basic' | 'standard' | 'premium';
  dailyPremium: number;
  weeklyPremium: number;
  coverageAmount: number;
  darkStore: string;
  zone: string;
  partnerId: string;
  location?: { lat: number | null; lng: number | null };
  shieldStatus: { active: boolean; remainingDays: number };
}

export interface InsurerUser {
  id: string;
  role: 'insurer';
  name: string;
  email: string;
}

export type AuthUser = RiderUser | InsurerUser;

export interface TriggerItem {
  id: string;
  type: string;
  status: 'active' | 'pending' | 'resolved' | 'warning';
  intensity: string;
  payout: number;
  timestamp: string;
  description: string;
}

export interface ClaimItem {
  id: string;
  triggerType: string;
  amount: number;
  status: 'credited' | 'processing' | 'rejected';
  date: string;
  description: string;
}

export interface NearbyHub {
  _id: string;
  code: string;
  name: string;
  city: string;
  zone: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface DynamicQuote {
  plan: 'basic' | 'standard' | 'premium';
  riskScore: number;
  dailyPremium: number;
  weeklyPremium: number;
  dailyCoverage: number;
  weather: {
    rainProbability: number;
    maxTempC: number;
    maxWindKmh: number;
    maxUv: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const apiClient = {
  async riderSignup(payload: {
    name: string;
    mobile: string;
    password: string;
    plan: 'basic' | 'standard' | 'premium';
    hubId?: string;
    partnerId?: string;
    location?: { lat: number; lng: number };
  }) {
    return request<{ token: string; user: RiderUser }>('/auth/rider/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async riderLogin(mobile: string, password: string) {
    return request<{ token: string; user: RiderUser }>('/auth/rider/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
  },

  async insurerLogin(email: string, password: string) {
    return request<{ token: string; user: InsurerUser }>('/auth/insurer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(token: string) {
    return request<{ user: AuthUser }>('/auth/me', { method: 'GET' }, token);
  },

  async getNearbyHubs(lat: number, lng: number) {
    return request<{ hubs: NearbyHub[] }>(`/hubs/nearby?lat=${lat}&lng=${lng}`, { method: 'GET' });
  },

  async selectRiderHub(token: string, payload: { hubId: string; lat?: number; lng?: number }) {
    return request<{ user: RiderUser }>(
      '/rider/hub',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  async getPricingQuote(payload: { plan: 'basic' | 'standard' | 'premium'; lat: number; lng: number; hoursPerDay?: number }) {
    return request<{ quote: DynamicQuote }>('/pricing/quote', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getRiderDashboard(token: string) {
    return request<{
      user: RiderUser;
      weather: DynamicQuote['weather'];
      triggers: TriggerItem[];
      claims: ClaimItem[];
    }>('/dashboard/rider', { method: 'GET' }, token);
  },

  async getInsurerDashboard(token: string) {
    return request<{
      metrics: {
        totalPolicies: number;
        activePolicies: number;
        totalClaims: number;
        pendingClaims: number;
        lossRatio: number;
        reserveAmount: number;
        projectedReserve: number;
        fraudScoreAvg: number;
        claimsByType: Array<{ type: string; count: number; amount: number }>;
      };
      riders: Array<{
        id: string;
        name: string;
        mobile: string;
        plan: string;
        weeklyPremium: number;
        darkStore: string;
        zone: string;
        createdAt: string;
        riskScore: number;
      }>;
      fraudAlerts: Array<{
        id: string;
        userName: string;
        riskLevel: 'low' | 'medium' | 'high';
        score: number;
        timestamp: string;
        reasons: string[];
        claimId: string;
      }>;
    }>('/dashboard/insurer', { method: 'GET' }, token);
  },
};
