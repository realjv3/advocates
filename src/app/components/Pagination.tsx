import { Dispatch, SetStateAction } from "react";

export type PaginationProps = {
    page: number;
    pageSize: number;
    totalItems: number;
    setPage: Dispatch<SetStateAction<number>>
}

const Pagination = ({page, totalItems, pageSize, setPage}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPage(page);
        }
    };

    return (
        <div className="flex justify-center my-4  mt-12">
            <div className="join">
                <button
                    className="join-item btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    «
                </button>
                {pageNumbers.map((v) => (
                    <button
                        key={v}
                        className={`join-item btn ${v === page ? "btn-active" : ""}`}
                        onClick={() => handlePageChange(v)}
                    >
                        {v}
                    </button>
                ))}
                <button
                    className="join-item btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default Pagination;