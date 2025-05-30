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

interface PaginationProps {
  paginateItems: PaginatedResponse<any>;
}

export default function InertiaPagination({ paginateItems }: PaginationProps) {
  const { links } = paginateItems;

  const pageLinks = links.filter((link) => !['&laquo; Previous', 'Next &raquo;'].includes(link.label));

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious href={paginateItems.prev_page_url ?? '#'} />
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
              >
                {link.label}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext href={paginateItems.next_page_url ?? '#'} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
