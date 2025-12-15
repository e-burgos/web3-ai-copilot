export interface ZerionPaginationInfo {
  totalCount: number;
  pageCount: number;
  pageSize: number;
  hasNext: boolean;
  nextCursor?: string;
}
