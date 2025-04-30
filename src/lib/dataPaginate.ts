export function Paginate<T>(data: T[], recordsPerPage: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < data.length; i += recordsPerPage) {
    pages.push(data.slice(i, i + recordsPerPage));
  }
  return pages;
}
