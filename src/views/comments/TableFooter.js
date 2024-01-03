// TableFooter.js
import React from 'react';

const TableFooter = ({ columnDefs, rowData, gridColumnApi }) => {
    const calculateTotals = (field) => {
        if (!field) {
            return '';
        }
        // 保留两位小数
        return rowData.reduce((sum, row) => sum + parseFloat(row[field] || 0), 0)
            .toFixed(2);
    };

    const generateColumnWidths = () => {
        if (!gridColumnApi) {
            return 'auto';
        }
        return (
            columnDefs
                .map(col => {
                    const column = gridColumnApi.getColumn(col.field);
                    return column ? column.getActualWidth() : 'auto';
                })
                .join('px ') + 'px'
        );
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: generateColumnWidths(),
                borderTop: '1px solid #ccc',
                padding: '5px',
            }}
        >
            {columnDefs.map((col, index) => {
                if (index === 0) {
                    return (
                        <div key={col.field} style={{ gridColumn: index + 1 }}>
                            合计：
                        </div>
                    );
                } else {
                    return (
                        <div key={col.field} style={{ gridColumn: index + 1 }}>
                            {calculateTotals(col.field)}
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default TableFooter;
