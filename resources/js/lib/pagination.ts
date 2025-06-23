import { PaginatedResponse } from '@/types';

export function hasOnePage<T>(paginatedResponse: PaginatedResponse<T> | null) {
  if (paginatedResponse && paginatedResponse.last_page === 1) {
    return true;
  }

  return false;
}
