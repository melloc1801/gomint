import {
  PaginationOrderEnum,
  PaginationSortingColumnEnum,
} from "../enum/paginationOrder.enum";

export type PaginationParams = {
  limit?: number;
  page?: number;
  order?: PaginationOrderEnum;
  sortingColumn?: PaginationSortingColumnEnum;
};
