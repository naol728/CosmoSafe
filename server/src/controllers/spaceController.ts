import axios from "axios";
import { Request, Response } from "express";
import redis from "./../utils/redis";
import { collisionAlerts, neoAlerts } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

const SPACE_TRACK_USER = process.env.SPACE_TRACK_USER!;
const SPACE_TRACK_PASS = process.env.SPACE_TRACK_PASS!;
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const CACHE_TTL = 60 * 60; // 1 hour cache
function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

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
export const getNearbyObjects = async (req: Request, res: Response) => {
  try {
    const { start_date } = req.query;
    const end_date = formatDate(new Date()); // today as default
    const startDate = start_date ? String(start_date) : end_date;

    const cacheKey = `space:neo:${startDate}:${end_date}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${end_date}&api_key=${NASA_API_KEY}`;
    const resp = await axios.get(url);

    const nearEarthObjects = resp.data.near_earth_objects;

    const objects = Object.values(nearEarthObjects)
      .flat()
      .map((obj: any) => ({
        id: obj.id,
        name: obj.name,
        nasa_jpl_url: obj.nasa_jpl_url,
        magnitude: obj.absolute_magnitude_h,
        is_potentially_hazardous: obj.is_potentially_hazardous_asteroid,
        close_approach_date: obj.close_approach_data?.[0]?.close_approach_date,
        relative_velocity:
          obj.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour,
        miss_distance: obj.close_approach_data?.[0]?.miss_distance?.kilometers,
        orbiting_body: obj.close_approach_data?.[0]?.orbiting_body,
      }));

    await redis.set(cacheKey, JSON.stringify(objects), "EX", CACHE_TTL);

    res.json(objects);
  } catch (err: any) {
    console.error("Error fetching NASA NEO data:", err.message);
    res.status(500).json({ error: "Failed to fetch nearby objects" });
  }
};

export const createCollisionAlert = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const {
      cdmId,
      emergencyReportable,
      minRangeKm,
      probability,
      sat1Id,
      sat1Name,
      sat1Type,
      sat1Rcs,
      sat1ExclVol,
      sat2Id,
      sat2Name,
      sat2Type,
      sat2Rcs,
      sat2ExclVol,
      tca,
      createdAt,
    } = req.body;

    const result = await db
      .insert(collisionAlerts)
      .values({
        userId,
        cdmId,
        emergencyReportable,
        minRangeKm,
        probability,
        sat1Id,
        sat1Name,
        sat1Type,
        sat1Rcs,
        sat1ExclVol,
        sat2Id,
        sat2Name,
        sat2Type,
        sat2Rcs,
        sat2ExclVol,
        tca: new Date(tca),
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      })
      .returning();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating collision alert:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const getUserCollisons = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const userCollison = await db
      .select()
      .from(collisionAlerts)
      .where(eq(collisionAlerts.userId, userId));

    return res.status(200).json({ collision: userCollison });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const createNeoAlert = async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Insert the NEO alert into the database
    const newAlert = await db
      .insert(neoAlerts)
      .values({
        id,
        userId: req.user.id,
        name,
        closeApproachDate: new Date(close_approach_date),
        isPotentiallyHazardous: is_potentially_hazardous,
        magnitude: parseFloat(magnitude),
        missDistance: parseFloat(miss_distance),
        relativeVelocity: parseFloat(relative_velocity),
        nasaJplUrl: nasa_jpl_url,
        orbitingBody: orbiting_body,
      })
      .returning();

    return res.status(201).json(newAlert);
  } catch (error: any) {
    console.error("Error creating NEO alert:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserNeo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const userneo = await db
      .select()
      .from(neoAlerts)
      .where(eq(neoAlerts.userId, userId));

    return res.status(200).json({ userneo: userneo });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
