const SORT_ORDERS = ["asc", "desc"];

export const parseSortParams = (query) => {
  let { sortBy = "name", sortOrder = "asc" } = query;
  sortOrder = SORT_ORDERS.includes(sortOrder) ? sortOrder : "asc";
  return { sortBy, sortOrder };
};
