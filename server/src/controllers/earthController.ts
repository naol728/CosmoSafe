import axios from "axios";
import { Request, Response } from "express";
import { getDistance } from "../utils/getDistance";
import redis from "./../utils/redis";
import { db } from "../db/db";
import { earthquakes } from "../db/schema";
import { eq } from "drizzle-orm";

export const getDisasters = async (req: Request, res: Response) => {
  const { search = "", lat = 9.03, lon = 38.74, radius = 1000 } = req.query;
  const { page = 1, limit = 5, offset } = (req as any).pagination;

  try {
    const cacheKey = `disasters:${page}:${limit}:${search}:${lat}:${lon}:${radius}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const eonet = await axios
      .get(`https://eonet.gsfc.nasa.gov/api/v3/events?offset=${offset}`)
      .then((r) => r.data.events);

    let filteredEvents = eonet.filter((event: any) => {
      if (!event.geometry?.length) return false;
      const [eventLon, eventLat] = event.geometry[0].coordinates;
      return (
        getDistance(Number(lat), Number(lon), eventLat, eventLon) <=
        Number(radius)
      );
    });

    if (search) {
      filteredEvents = filteredEvents.filter((event: any) =>
        event.title.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    const result = {
      disasters: filteredEvents,
      pagination: { page, limit, offset, radius, search },
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getWeather = async (req: Request, res: Response) => {
  const { lat = 9.03, lon = 38.74 } = req.query;

  try {
    const weather = await axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&forecast_days=7&timezone=auto`
      )
      .then((r) => r.data);

    res.json({ weather });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFlood = async (req: Request, res: Response) => {
  const { lat = 9.03, lon = 38.74 } = req.query;

  try {
    const flood = await axios
      .get(
        `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge,river_discharge_mean&forecast_days=7&timezone=auto`
      )
      .then((r) => r.data);

    res.json({ flood });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarbon = async (_req: Request, res: Response) => {
  const carbon = {
    global_co2_ppm: 419.3,
    trend: "+0.4 ppm compared to last year",
  };

  res.json({ carbon });
};
export const getEarthquakes = async (req: Request, res: Response) => {
  try {
    const {
      lat = 9.03,
      lon = 38.74,
      radius = "500",
      startTime,
      endTime,
      minMagnitude,
      maxMagnitude,
    } = req.query;

    const { page, limit, offset } = (req as any).pagination;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const params: any = {
      format: "geojson",
      latitude: 38,
      longitude: 13,
      maxradiuskm: radius,
      limit,
      offset: offset > 0 ? offset : 1,
    };

    if (startTime) params.starttime = startTime;
    if (endTime) params.endtime = endTime;
    if (minMagnitude) params.minmagnitude = minMagnitude;
    if (maxMagnitude) params.maxmagnitude = maxMagnitude;

    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query";

    const response = await axios.get(url, { params });

    const earthquakes = response.data.features.map((eq: any) => ({
      id: eq.id,
      magnitude: eq.properties.mag,
      place: eq.properties.place,
      time: new Date(eq.properties.time).toISOString(),
      url: eq.properties.url,
      coordinates: {
        lon: eq.geometry.coordinates[0],
        lat: eq.geometry.coordinates[1],
        depth: eq.geometry.coordinates[2],
      },
    }));

    res.json({
      pagination: { page, limit, offset },
      count: earthquakes.length,
      earthquakes,
    });
  } catch (error: any) {
    console.error(
      "Earthquake fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch earthquake data" });
  }
};

export const addEarthquake = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, magnitude, place, time, depth, latitude, longitude, url } =
      req.body;

    if (
      !magnitude ||
      !place ||
      !time ||
      !depth ||
      !latitude ||
      !longitude ||
      !url
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [newEarthquake] = await db
      .insert(earthquakes)
      .values({
        id: id,
        user_id: userId,
        magnitude,
        place,
        time: new Date(time),
        depth,
        latitude,
        longitude,
        url,
      })
      .returning();

    return res.status(201).json({
      message: "Earthquake record added successfully",
      data: newEarthquake,
    });
  } catch (error) {
    console.error("Error adding earthquake:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEarthquakedb = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await db
      .select()
      .from(earthquakes)
      .where(eq(earthquakes.user_id, userId));

    return res.json({
      data,
    });
  } catch (error) {
    console.log("Error feching er from db", error);
    res.status(500).json({ error });
  }
};
