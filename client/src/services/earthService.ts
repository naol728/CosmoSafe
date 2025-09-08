/* eslint-disable */
import apiClient from "./apiClient";
const EARTHENDPOINT = "/earth";

export const getDisaster = async ({ page, limit, search, lat, lon }: any) => {
  const res = await apiClient.get(`${EARTHENDPOINT}/disaster`, {
    params: { page, limit, search, lat, lon },
  });
  return res.data;
};
export const getWeather = async ({ page, limit, search, lat, lon }: any) => {
  const res = await apiClient.get(`${EARTHENDPOINT}/weather`, {
    params: { page, limit, search, lat, lon },
  });
  return res.data;
};
export const getFlood = async ({ page, limit, search, lat, lon }: any) => {
  const res = await apiClient.get(`${EARTHENDPOINT}/flood`, {
    params: { page, limit, search, lat, lon },
  });
  return res.data;
};
export const getCarbon = async ({ page, limit, search, lat, lon }: any) => {
  const res = await apiClient.get(`${EARTHENDPOINT}/carbon`, {
    params: { page, limit, search, lat, lon },
  });
  return res.data;
};
export const getEarthquake = async ({ page, limit, search, lat, lon }: any) => {
  const res = await apiClient.get(`${EARTHENDPOINT}/earthquake`, {
    params: { page, limit, search, lat, lon },
  });
  return res.data;
};

export const addEarthquake = async ({
  id,
  magnitude,
  place,
  time,
  depth,
  latitude,
  longitude,
  url,
}: any) => {
  const res = await apiClient.post(`${EARTHENDPOINT}/add/earthquake`, {
    id,
    magnitude,
    place,
    time,
    depth,
    latitude,
    longitude,
    url,
  });
  return res.data;
};

export const getEarthquakedb = async () => {
  const res = await apiClient.get(`${EARTHENDPOINT}/get/earthquake`);
  return res.data;
};
