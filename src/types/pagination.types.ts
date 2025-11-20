export interface PaginatedResponse<T> {
    data: T[];
    pageCount: number;
}