import {
  PaginationOrderEnum,
  PaginationSortingColumnEnum,
} from "./enum/paginationOrder.enum";

export const PARTICIPANT_QUERY_PARAMS = {
  ADDRESS: "address",
};
export const PAGINATION_DEFAULT_LIMIT = 10;
export const PAGINATION_DEFAULT_ORDER = PaginationOrderEnum.asc;
export const PAGINATION_DEFAULT_SORTING_COLUMN =
  PaginationSortingColumnEnum.createdAt;
