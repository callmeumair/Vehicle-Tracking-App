import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 17.385044,
  lng: 78.486671,
};

// Vehicle icon configuration
const vehicleIcon = {
  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 20 }
};

function App() {
  const [vehicleLocations, setVehicleLocations] = useState({});
  const [vehicleRoutes, setVehicleRoutes] = useState({});
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchAvailableRoutes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes');
      setAvailableRoutes(response.data);
    } catch (err) {
      setError('Failed to fetch available routes');
      console.error(err);
    }
  }, []);

  const fetchVehicleLocation = useCallback(async (routeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicle-location/${routeId}`);
      setVehicleLocations(prev => ({
        ...prev,
        [routeId]: response.data
      }));
    } catch (err) {
      setError(`Failed to fetch location for route ${routeId}`);
      console.error(err);
    }
  }, []);

  const fetchVehicleRoute = useCallback(async (routeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicle-route/${routeId}`);
      setVehicleRoutes(prev => ({
        ...prev,
        [routeId]: response.data
      }));
    } catch (err) {
      setError(`Failed to fetch route for ${routeId}`);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchAvailableRoutes();
  }, [fetchAvailableRoutes]);

  useEffect(() => {
    if (availableRoutes.length > 0) {
      // Fetch initial data for all routes
      availableRoutes.forEach(routeId => {
        fetchVehicleLocation(routeId);
        fetchVehicleRoute(routeId);
      });

      // Set up interval for location updates
      const interval = setInterval(() => {
        availableRoutes.forEach(routeId => {
          fetchVehicleLocation(routeId);
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [availableRoutes, fetchVehicleLocation, fetchVehicleRoute]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="App">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {Object.entries(vehicleLocations).map(([routeId, location]) => (
          <Marker
            key={routeId}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={vehicleIcon}
            title={`Vehicle on ${routeId}`}
          />
        ))}
        {Object.entries(vehicleRoutes).map(([routeId, route]) => (
          <Polyline
            key={routeId}
            path={route.map(point => ({
              lat: point.latitude,
              lng: point.longitude,
            }))}
            options={{
              strokeColor: routeId === 'route1' ? '#FF0000' : '#0000FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
      {error && (
        <div className="error" style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default App; 