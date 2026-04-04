import { useState } from 'react';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useI18n } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient, type NearbyHub, type RiderUser } from '../lib/apiClient';

export default function LocationScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { token, user, setUser } = useAuth();

  const [isDetecting, setIsDetecting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hubs, setHubs] = useState<NearbyHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<NearbyHub | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const detectLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          const result = await apiClient.getNearbyHubs(coords.lat, coords.lng);
          setHubs(result.hubs);
          setSelectedHub(result.hubs[0] || null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to fetch nearby hubs');
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        setError(geoError.message || 'Unable to detect location');
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const handleContinue = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedHub) {
      setError('Please select a local hub to continue');
      return;
    }

    try {
      setIsSaving(true);
      const result = await apiClient.selectRiderHub(token, {
        hubId: selectedHub._id,
        lat: location?.lat,
        lng: location?.lng,
      });
      setUser(result.user as RiderUser);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save hub selection');
    } finally {
      setIsSaving(false);
    }
  };

  const isRider = user?.role === 'rider';

  return (
    <div className="min-h-screen sr-screen-auth flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.detectLocation}</h1>
          <p className="text-gray-400">{t.locationDesc}</p>
        </div>

        <Card variant="glass" className="p-6 mb-8 space-y-4">
          <Button
            onClick={detectLocation}
            isLoading={isDetecting}
            fullWidth
            variant="secondary"
            size="lg"
          >
            <span className="inline-flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              {t.allowLocation}
            </span>
          </Button>

          {location && (
            <div className="rounded-xl border border-green-500/25 bg-green-500/10 p-3 text-green-300 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>{t.locationDetected}</span>
              </div>
              <p className="text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
            </div>
          )}

          <div className="space-y-2 max-h-56 overflow-auto">
            {hubs.map((hub) => (
              <button
                key={hub._id}
                onClick={() => setSelectedHub(hub)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  selectedHub?._id === hub._id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-900/40 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{hub.name}</p>
                    <p className="text-xs text-gray-400">{hub.code} | {hub.zone}</p>
                  </div>
                  <div className="text-xs text-blue-300">{hub.distanceKm} km</div>
                </div>
              </button>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            onClick={handleContinue}
            fullWidth
            variant="primary"
            size="lg"
            isLoading={isSaving}
            disabled={!isRider || !selectedHub}
          >
            {t.continue}
          </Button>
        </Card>
      </div>
    </div>
  );
}
