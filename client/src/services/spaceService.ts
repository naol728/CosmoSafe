import apiClient from "./apiClient";

const BASE = "/space";

// ISS Position
export async function fetchISSPosition() {
  const res = await apiClient.get(`${BASE}/iss`);
  return res.data;
}

// Orbital Tracking (requires NORAD ID)
export async function fetchOrbitalTracking(id: string) {
  const res = await apiClient.get(`${BASE}/orbit/${id}`);
  return res.data;
}

// Space Weather Now
export async function fetchSpaceWeatherNow() {
  const res = await apiClient.get(`${BASE}/space-weather/now`);
  return res.data;
}

// Space Weather Forecast
export async function fetchSpaceWeatherForecast() {
  const res = await apiClient.get(`${BASE}/space-weather/forecast`);
  return res.data;
}

// Collision Alerts
export async function fetchCollisionAlerts() {
  const res = await apiClient.get(`${BASE}/collision-alerts`);
  return res.data;
}

export async function fetchNearByObjects() {
  const res = await apiClient.get(`${BASE}/nearby`);
  return res.data;
}
