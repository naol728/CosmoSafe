/*eslint-disable*/
import apiClinet from "./apiClient";

const BASE = "/admin";

export const getAnalytics = async () => {
  try {
    const res = await apiClinet.get(`${BASE}/analytics`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getTopUsers = async () => {
  try {
    const res = await apiClinet.get(`${BASE}/top-users`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export const getAllUsers = async () => {
  try {
    const res = await apiClinet.get(`${BASE}/users`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export const deleteUser = async (id: string) => {
  try {
    const res = await apiClinet.delete(`${BASE}/del/user/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
