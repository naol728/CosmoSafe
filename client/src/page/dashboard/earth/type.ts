export interface Params {
  page?: number;
  search?: string;
  location?: {
    lat: number;
    lon: number;
  } | null;
  limit?: number;
}
