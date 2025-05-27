import React from 'react';
import { PaginationInterface } from '../../types/Pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationStyle from './PaginationStyle.module.css';

const Pagination: React.FC<PaginationInterface> = ({
    totalProducts,
    productsPerPage,
    setCurrentPage,
    currentPage,
}) => {
    const pageNumbers: number[] = [];
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentPage(pageNumber);
    };

    //Hantera klick bakåt
    const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //Hantera klick framåt
    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='max-w-[100rem] border-[1px] border-forma_ro_grey mt-10 rounded-2xl m-2'>
            <ul className="flex gap-10 w-full justify-between max-w-fit mx-auto mt-5 mb-5">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={(e) => handlePrevious(e)} className="flex text-[16px]" disabled={currentPage === 1}><ChevronLeft /> Föregående</button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                        <button onClick={(e) => paginate(number, e)} className={`${currentPage === number ? PaginationStyle.active : ''} text-[16px]`}>{number}</button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={(e) => handleNext(e)} disabled={currentPage === totalPages} className='flex text-[16px]'>Nästa <ChevronRight /></button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;