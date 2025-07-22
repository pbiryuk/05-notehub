import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={totalPages}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel={"←"}
      nextLabel={"→"}
      disabledClassName={css.disabled}
    />
  );
};

export default Pagination;
