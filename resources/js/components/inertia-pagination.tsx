import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatedResponse } from '@/types';

interface PaginationProps<T> {
  paginateItems: PaginatedResponse<T>;
}

export default function InertiaPagination<T>({ paginateItems }: PaginationProps<T>) {
  const { links } = paginateItems;

  const pageLinks = links.filter((link) => !['&laquo; Previous', 'Next &raquo;'].includes(link.label));

  console.log(paginateItems);

  return (
    <Pagination className="my-3">
      <PaginationContent>
        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious
            href={paginateItems.prev_page_url ?? '#'}
            disabled={paginateItems.prev_page_url === null}
          />
        </PaginationItem>

        {/* Page Numbers and Ellipsis */}
        {pageLinks.map((link, index) => {
          if (link.label === '...') {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                href={link.url ?? '#'}
                isActive={link.active}
                disabled={link.active}
              >
                {link.label}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext
            href={paginateItems.next_page_url ?? '#'}
            disabled={paginateItems.next_page_url === null}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
