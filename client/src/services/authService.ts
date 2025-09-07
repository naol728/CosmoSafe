/* eslint-disable */
import apiClient from "./apiClient";

const AUTH_ENDPOINT = "/auth";

export const requestOtp = async ({ email }: { email: string }) => {
  const res = await apiClient.post(`${AUTH_ENDPOINT}/request-otp`, { email });
  return res;
};

export const verifyOtp = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const res = await apiClient.post(`${AUTH_ENDPOINT}/verify-otp`, {
    email,
    token,
  });
  return res;
};

export const me = async () => {
  try {
    const res = await apiClient.get(`${AUTH_ENDPOINT}/me`);
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message || "Failed to fetch user");
  }
};
