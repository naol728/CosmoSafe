import { Request, Response, NextFunction } from "express";

export interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const sort = (req.query.sort as string) || "created_at";
  const order = (req.query.order as string) === "asc" ? "asc" : "desc";
  const search = req.query.search as string;

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    sort,
    order,
    search,
  };
}

export function paginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { page, limit, offset, sort, order, search } = parsePagination(req);
  (req as any).pagination = { page, limit, offset, sort, order };
  next();
}
