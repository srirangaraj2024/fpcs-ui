import React from 'react'
import { useState, useEffect } from 'react';

export default function TableUtil (data, page, rowsPerPage) {
    const [tableRange, setTableRange] = useState([]);
    const [slice, setSlice] = useState([]);

    useEffect(() => {
        const range = calculatePageRange(data, rowsPerPage);
        setTableRange([...range]);

        const slice = slicePageData(data, page, rowsPerPage);
        setSlice([...slice]);
    }, [data, setTableRange, page, setSlice, rowsPerPage]);
    return { slice, range: tableRange }
};
const calculatePageRange = (data, rowsPerPage) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage);
    for (let i = 1; i <= num; i++) {
        range.push(i)
    }
    return range;
};

const slicePageData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};
