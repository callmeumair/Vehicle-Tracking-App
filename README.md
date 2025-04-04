# Vehicle Tracking Application

A real-time vehicle tracking application that displays a vehicle's movement on a map using Google Maps.

## Features

- Real-time vehicle location updates
- Vehicle route visualization
- Interactive map interface
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Maps API key

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the client directory and add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `GET /api/vehicle-location`: Returns the current vehicle location
- `GET /api/vehicle-route`: Returns the complete vehicle route

## Technologies Used

- Frontend:
  - React
  - Google Maps JavaScript API
  - Axios
  - Vite

- Backend:
  - Node.js
  - Express
  - CORS 