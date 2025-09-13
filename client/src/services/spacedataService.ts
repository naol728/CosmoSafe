/*eslint-disable*/
import apiClient from "./apiClient";

export const getStudyFiles = async (
  studyIds: string,
  page = 1,
  size = 10,
  allFiles = false
) => {
  try {
    const ids = studyIds
      .split(",")
      .map((id) => id.trim().replace(/\.$/, ""))
      .join(",");
    const response = await apiClient.get("/space-data/files", {
      params: { studyIds: ids, page, size, allFiles },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch study files:", error);
    throw error;
  }
};

// Fetch metadata for a single study
export const getStudyMetadata = async (studyId: string) => {
  try {
    const cleanId = studyId.trim().replace(/\.$/, "");
    const response = await apiClient.get(`/space-data/meta/${cleanId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch study metadata:", error);
    throw error;
  }
};

export interface SearchStudiesParams {
  term?: string;
  from?: number;
  size?: number;
  type?: string;
  sort?: string;
  order?: "ASC" | "DESC";
  ffield?: string;
  fvalue?: string;
}

export const searchStudies = async (params: {
  term: string;
  size?: number;
}) => {
  try {
    const response = await apiClient.get("/space-data/search", { params });
    console.log("Search API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to search studies:", error);
    throw error;
  }
};

export const summarizeStudy = async (text: string) => {
  try {
    const response = await apiClient.post("/ai/summarize", { text });
    return response.data.summary;
  } catch (err) {
    console.log(err);
    throw new Error("Faild to summerize ");
  }
};
