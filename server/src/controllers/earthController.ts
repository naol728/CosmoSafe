import axios from "axios";
import { Request, Response } from "express";
import { getDistance } from "../utils/getDistance";

export const getDisasters = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 5,
    search = "",
    lat = 9.03,
    lon = 38.74,
    radius = 500,
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  try {
    const eonet = await axios
      .get(
        `https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}&offset=${offset}`
      )
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

    res.json({
      disasters: filteredEvents,
      pagination: { page, limit, offset, radius, search },
    });
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
