import axios from "axios";
import { Request, Response } from "express";
import redis from "./../utils/redis";

const SPACE_TRACK_USER = process.env.SPACE_TRACK_USER!;
const SPACE_TRACK_PASS = process.env.SPACE_TRACK_PASS!;
const CACHE_TTL = 60 * 15; // 15 minutes

async function getSpaceTrackCookie(): Promise<string> {
  const cacheKey = "spacetrack:cookie";
  const cachedCookie = await redis.get(cacheKey);
  if (cachedCookie) return cachedCookie;

  // login
  const loginResp = await axios.post(
    "https://www.space-track.org/ajaxauth/login",
    new URLSearchParams({
      identity: SPACE_TRACK_USER,
      password: SPACE_TRACK_PASS,
    }),
    { withCredentials: true }
  );

  const cookies = loginResp.headers["set-cookie"];
  if (!cookies) throw new Error("Failed to get Space-Track cookie");

  const cookieHeader = cookies.map((c) => c.split(";")[0]).join("; ");

  // cache cookie (they usually last ~1 day, but you can refresh earlier)
  await redis.set("spacetrack:cookie", cookieHeader, "EX", 60 * 60 * 6); // 6 hours
  return cookieHeader;
}

export const getOrbitalTracking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `tle:${id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const resp = await axios.get(
      `https://www.space-track.org/basicspacedata/query/class/tle_latest/NORAD_CAT_ID/${id}/format/json`
    );

    await redis.set(cacheKey, JSON.stringify(resp.data), "EX", CACHE_TTL);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orbital tracking data" });
  }
};

export const getSpaceWeatherNow = async (_: Request, res: Response) => {
  const cacheKey = "spaceWeather:now";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const resp = await axios.get("https://auroraforecast.space/api/kp/now");

    await redis.set(cacheKey, JSON.stringify(resp.data), "EX", CACHE_TTL);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch space weather now" });
  }
};

export const getSpaceWeatherForecast = async (_: Request, res: Response) => {
  const cacheKey = "spaceWeather:forecast";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const resp = await axios.get(
      "https://auroraforecast.space/api/kp/forecast"
    );

    await redis.set(cacheKey, JSON.stringify(resp.data), "EX", CACHE_TTL);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch space weather forecast" });
  }
};

export const getCollisionAlerts = async (_: Request, res: Response) => {
  const cacheKey = "collision:alerts";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const cookie = await getSpaceTrackCookie();

    const resp = await axios.get(
      "https://www.space-track.org/basicspacedata/query/class/cdm_public/limit/20/format/json",
      {
        headers: { Cookie: cookie },
      }
    );

    await redis.set(cacheKey, JSON.stringify(resp.data), "EX", CACHE_TTL);
    res.json(resp.data);
  } catch (err: any) {
    console.error("Error fetching collision alerts:", err.message);
    res.status(500).json({ error: "Failed to fetch collision alerts" });
  }
};
export const getISSPosition = async (_: Request, res: Response) => {
  const cacheKey = "iss:position";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const cookie = await getSpaceTrackCookie();

    const resp = await axios.get(
      "https://www.space-track.org/basicspacedata/query/class/tle_latest/NORAD_CAT_ID/25544/format/json",
      {
        headers: { Cookie: cookie },
      }
    );

    await redis.set(cacheKey, JSON.stringify(resp.data), "EX", CACHE_TTL);
    res.json(resp.data);
  } catch (err: any) {
    console.error("ISS fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch ISS position" });
  }
};
export const getNearbyObjects = async (_: Request, res: Response) => {
  const cacheKey = "space:nearby-objects";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // Space-Track public catalog for all objects
    const resp = await axios.get(
      "https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/limit/1000/format/json",
      {
        headers: {
          // You need Space-Track auth cookie
          Cookie: process.env.SPACE_TRACK_COOKIE || "",
        },
      }
    );

    // Map relevant info for UI
    const objects = resp.data.map((obj: any) => ({
      name: obj.OBJECT_NAME,
      noradId: obj.NORAD_CAT_ID,
      inclination: obj.INCLINATION,
      altitude: obj.ECCENTRICITY, // or calculate from perigee/apogee if available
      epoch: obj.EPOCH,
    }));

    await redis.set(cacheKey, JSON.stringify(objects), "EX", CACHE_TTL);
    res.json(objects);
  } catch (err: any) {
    console.error("Error fetching nearby objects:", err.message);
    res.status(500).json({ error: "Failed to fetch nearby objects" });
  }
};
