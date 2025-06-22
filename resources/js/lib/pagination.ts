import { PaginatedResponse } from '@/types';

export function hasOnePage(paginatedResponse: PaginatedResponse<any> | null) {
  if (paginatedResponse && paginatedResponse.last_page === 1) {
    return true;
  }

  return false;
}

export function buildPageLinks(currentPage: number, lastPage: number): { label: string; url: string | null; active: boolean }[] {
  const result: { label: string; url: string | null; active: boolean }[] = [];

  const createLink = (page: number) => ({
    label: `${page}`,
    url: `?page=${page}`,
    active: page === currentPage,
  });

  result.push(createLink(1));
  if (lastPage >= 2) result.push(createLink(2));

  if (currentPage >= 5) {
    result.push({ label: '...', url: null, active: false });
  }

  const start = Math.max(3, currentPage - 1);
  const end = Math.min(lastPage - 2, currentPage + 1);
  for (let i = start; i <= end && result.length < 7; i++) {
    if (![1, 2, lastPage - 1, lastPage].includes(i)) {
      result.push(createLink(i));
    }
  }

  if (end < lastPage - 2) {
    result.push({ label: '...', url: null, active: false });
  }

  if (lastPage > 3) result.push(createLink(lastPage - 1));
  if (lastPage > 2) result.push(createLink(lastPage));

  // Remove duplicate labels
  const seen = new Set();
  return result.filter((link) => {
    if (link.label === '...') return true;
    if (seen.has(link.label)) return false;
    seen.add(link.label);
    return true;
  });
}
