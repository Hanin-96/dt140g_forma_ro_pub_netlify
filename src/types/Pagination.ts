export interface PaginationInterface {
    totalProducts: number;
    productsPerPage: number; 
    setCurrentPage: (page: number) => void;
    currentPage: number;
}