export interface Pagination{
  to: number;
  from: number;
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  count: number;
  links: PaginationLinks;
}

export interface PaginatedResponse<T>{
  data: T[];
  meta: Pagination;
}


export interface PaginationLinks {
  first: string;
  last: string;
  next?: string;
  prev?: string;
}
