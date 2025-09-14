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

export const addDisaster = async (disaster: any) => {
  console.log(disaster);

  const res = await apiClient.post("/earth/add/disaster", {
    id: disaster.id,
    title: disaster.title,
    description: disaster.description || null,
    link: disaster.link,
    categories: disaster.categories,
    sources: disaster.sources,
    geometry: disaster.geometry,
    closed: disaster.closed || false,
  });

  return res.data;
};

export const getUserDisaster = async () => {
  const res = await apiClient.get(`${EARTHENDPOINT}/get/disaster`);
  return res.data;
};
export const deleteUserDisaster = async (id: string) => {
  const res = await apiClient.delete(`${EARTHENDPOINT}/delete/disaster/${id}`);
  return res;
};
export const deleteUserEarthQuake = async (id: string) => {
  try {
    console.log(id);
    const res = await apiClient.delete(
      `${EARTHENDPOINT}/delete/earthquake/${id}`
    );
    console.log(res);
    return res;
  } catch (err: any) {
    throw new Error(err.message || "disaster is not deleted");
  }
};
