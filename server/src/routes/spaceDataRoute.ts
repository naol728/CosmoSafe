import express from "express";
import {
  getStudyFiles,
  getStudyMetadata,
  searchStudies,
} from "../controllers/spaceDataController";

const router = express.Router();

// GET /api/space-data/files?studyIds=87,137
router.get("/files", getStudyFiles);

// GET /api/space-data/meta/:studyId
router.get("/meta/:studyId", getStudyMetadata);

// GET /api/space-data/search?term=space
router.get("/search", searchStudies);

export default router;
