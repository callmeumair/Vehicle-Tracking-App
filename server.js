const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./data/vehicleRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Track current position for each route
const currentPositions = {
  route1: 0,
  route2: 0
};

// API endpoint to get vehicle location
app.get('/api/vehicle-location/:routeId', (req, res) => {
  const { routeId } = req.params;
  const route = routes[routeId];
  
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  // Get current position and increment for next time
  const currentIndex = currentPositions[routeId];
  const location = route[currentIndex];
  
  // Move to next position, reset if at end
  currentPositions[routeId] = (currentIndex + 1) % route.length;
  
  res.json(location);
});

// API endpoint to get vehicle route
app.get('/api/vehicle-route/:routeId', (req, res) => {
  const { routeId } = req.params;
  const route = routes[routeId];
  
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  
  res.json(route);
});

// API endpoint to get all available routes
app.get('/api/routes', (req, res) => {
  res.json(Object.keys(routes));
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 