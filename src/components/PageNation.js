import React, { useEffect } from 'react'
import '../styles/Pagenation.css'
export default function PageNation({ range, setPage, page, slice }) {
    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
            setPage(page - 1);
        }
    }, [slice, page, setPage]);

    return (
        <div className='pageNation'>
            {range.map((e1, index) => (
                <button
                    key={index}
                    className={page === e1 ? 'activeButton' : 'inactiveButton'}
                    onClick={() => setPage(e1)}
                >
                    {e1}
                </button>
            ))}

        </div>
    );
}
