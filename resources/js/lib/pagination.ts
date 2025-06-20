import { PaginatedResponse } from '@/types';

export function hasOnePage(paginatedResponse: PaginatedResponse<any> | null) {
  if (paginatedResponse && paginatedResponse.last_page === 1) {
    return true;
  }

  return false;
}
