import { Request, Response } from "express";
import axios from "axios";

const OSDR_BASE = "https://osdr.nasa.gov/osdr/data/osd";
const API_SERVER = "https://osdr.nasa.gov"; // For constructing download URLs

interface StudyFile {
  category: string;
  date_created: number;
  file_name: string;
  file_size: number;
  remote_url: string;
  restricted: boolean;
  visible: boolean;
}

interface Study {
  file_count: number;
  study_files: StudyFile[];
}

const cleanStudyId = (id: string) => id.trim().replace(/[^0-9.]/g, "");

export const getStudyFiles = async (req: Request, res: Response) => {
  try {
    let { studyIds, page = 1, size = 10 } = req.query;

    if (!studyIds) {
      return res.status(400).json({
        success: false,
        error: "studyIds query parameter is required",
      });
    }

    const ids = studyIds.toString().split(",").map(cleanStudyId).join(",");

    const response = await axios.get(
      `${OSDR_BASE}/files/${ids}/?page=${page}&size=${size}`
    );

    const studies: Record<string, Study> = response.data.studies || {};

    Object.values(studies).forEach((study) => {
      study.study_files.forEach((file) => {
        file.remote_url = `${API_SERVER}${file.remote_url}`;
      });
    });

    res.status(200).json({
      success: true,
      studies,
      hits: response.data.hits || 0,
      page_number: response.data.page_number || page,
      page_size: response.data.page_size || size,
      page_total: response.data.page_total || 1,
      total_hits: response.data.total_hits || 0,
    });
  } catch (error: any) {
    console.error(error.message || error);
    res.status(200).json({
      success: false,
      studies: {},
      message: "Failed to fetch study files",
    });
  }
};

export const getStudyMetadata = async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;

    if (!studyId) {
      return res
        .status(400)
        .json({ success: false, error: "studyId param is required" });
    }

    const cleanId = cleanStudyId(studyId);
    const url = `${OSDR_BASE}/meta/${cleanId}`;

    const response = await axios.get(url);
    res.status(200).json({
      success: true,
      metadata: response.data.study || {},
    });
  } catch (error: any) {
    console.error(error.message || error);
    res.status(200).json({
      success: false,
      metadata: {},
      message: "Failed to fetch study metadata",
    });
  }
};

export const searchStudies = async (req: Request, res: Response) => {
  try {
    const { term, size = 10, from = 0 } = req.query;

    const nasaResponse = await axios.get(
      "https://osdr.nasa.gov/osdr/data/search",
      {
        params: { term, size, from },
      }
    );

    const hits = nasaResponse.data?.hits?.hits || [];

    const results = hits.map((hit: any) => {
      const src = hit._source || {};
      return {
        id: hit._id,
        identifier: src["Study Identifier"] || src.Accession,
        title: src["Study Title"] || "Untitled",
        description: src["Study Description"] || "",
        organism: src.organism || "",
        project: src["Project Title"] || "",
      };
    });

    res.json({ success: true, results });
  } catch (error: any) {
    console.error("NASA Search error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to search studies" });
  }
};
