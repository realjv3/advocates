import { ChangeEvent, useState } from "react";

export const usePagination = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setPageSize(parseInt(e.target.value));
    }

    return ({page, setPage, pageSize, onPageSizeChange});
}