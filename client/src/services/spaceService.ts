/*eslint-disable*/
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
export async function getUserCollision() {
  const res = await apiClient.get(`${BASE}/get/collision-alert`);
  return res.data;
}
export async function createCollisionAlert(data: any) {
  const {
    CDM_ID,
    CREATED,
    EMERGENCY_REPORTABLE,
    MIN_RNG,
    PC,
    SAT1_OBJECT_TYPE,
    SAT1_RCS,
    SAT2_OBJECT_TYPE,
    SAT2_RCS,
    SAT_1_EXCL_VOL,
    SAT_1_ID,
    SAT_1_NAME,
    SAT_2_EXCL_VOL,
    SAT_2_ID,
    SAT_2_NAME,
    TCA,
  } = data;

  const res = await apiClient.post(`${BASE}/create/collision-alert`, {
    cdmId: CDM_ID,
    createdAt: CREATED,
    emergencyReportable: EMERGENCY_REPORTABLE === "Y",
    minRangeKm: MIN_RNG,
    probability: PC,
    sat1Type: SAT1_OBJECT_TYPE,
    sat1Rcs: SAT1_RCS,
    sat1ExclVol: parseFloat(SAT_1_EXCL_VOL),
    sat1Id: SAT_1_ID,
    sat1Name: SAT_1_NAME,
    sat2Type: SAT2_OBJECT_TYPE,
    sat2Rcs: SAT2_RCS,
    sat2ExclVol: parseFloat(SAT_2_EXCL_VOL),
    sat2Id: SAT_2_ID,
    sat2Name: SAT_2_NAME,
    tca: TCA,
  });

  return res.data;
}

export async function createNeoAlert(data: any) {
  const {
    id,
    name,
    close_approach_date,
    is_potentially_hazardous,
    magnitude,
    miss_distance,
    relative_velocity,
    nasa_jpl_url,
    orbiting_body,
  } = data;
  const res = await apiClient.post(`${BASE}/create/neo-alert`, {
    id,
    name,
    close_approach_date,
    is_potentially_hazardous,
    magnitude,
    miss_distance,
    relative_velocity,
    nasa_jpl_url,
    orbiting_body,
  });
  return res.data;
}
export async function getUserNeoObject() {
  const res = await apiClient.get(`${BASE}/get/neo-alert`);
  return res.data?.userneo;
}

export async function fetchArticles({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const res = await apiClient.get(`${BASE}/get/articles`, {
    params: { page, limit },
  });
  return res.data;
}

export async function fetchArticleById(id: string) {
  const res = await apiClient.get(`${BASE}/get/articles/${id}`);
  return res.data;
}
