import { FC } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface PaginatorProps {
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
}

const Paginator: FC<PaginatorProps> = ({ page, setPage, totalPages }) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
            className={
              page === 1
                ? 'text-muted-foreground cursor-default hover:bg-transparent hover:text-muted-foreground'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                setPage(pageNum);
              }}
              isActive={pageNum === page}
              className="cursor-pointer"
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) setPage(page + 1);
            }}
            className={
              page === totalPages
                ? 'text-muted-foreground cursor-default hover:bg-transparent hover:text-muted-foreground'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
