export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPaginationParams = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const sortBy = query.sortBy || 'id';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

  return { page, limit, sortBy, sortOrder };
};

export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const getTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

