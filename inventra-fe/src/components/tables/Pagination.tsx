import { Trans } from "@lingui/macro";
import { useTranslate } from "@/hooks/useTranslate";
import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number | string;
  onItemsPerPageChange?: (items: number) => void;
  itemsPerPageOptions?: (number | string)[];
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100, "Semua"],
}) => {
  const { _ } = useTranslate();

  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisibleAround = 1; // show currentPage - 1, currentPage, currentPage + 1

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - maxVisibleAround && i <= currentPage + maxVisibleAround)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - maxVisibleAround - 1 ||
        i === currentPage + maxVisibleAround + 1
      ) {
        pages.push("...");
      }
    }

    return pages.filter((item, index) => {
      if (item === "..." && pages[index - 1] === "...") return false;
      return true;
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Dropdown Items Per Page */}
      {onItemsPerPageChange ? (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span><Trans>Tampilkan</Trans>:</span>
          <select
            value={itemsPerPage === 1000 || itemsPerPage === "all" ? "Semua" : itemsPerPage || 10}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Semua" || val === "all") {
                onItemsPerPageChange(1000); // 1000 items represents 'Semua' cleanly for backend pagination
              } else {
                onItemsPerPageChange(Number(val));
              }
            }}
            className="h-9 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-sm font-medium text-gray-700 shadow-theme-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={String(opt)}>
                {opt === "Semua" || opt === "all" ? _("Semua") : opt}
              </option>
            ))}
          </select>
          <span><Trans>per halaman</Trans></span>
        </div>
      ) : <div />}

      {/* Page Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2.5 flex items-center h-9 justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm font-medium"
          >
            <Trans>Sebelumnya</Trans>
          </button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, idx) =>
              typeof page === "string" ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3.5 py-1.5 rounded-lg flex w-9 items-center justify-center h-9 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-gray-700 hover:bg-brand-500/[0.08] hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700 shadow-theme-xs text-sm font-medium hover:bg-gray-50 h-9 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            <Trans>Selanjutnya</Trans>
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
