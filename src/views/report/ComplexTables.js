import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ComplexTable = ({list}) => {
    const rowData = list;

    const columnDefs = [
        { headerName: '发出部门', field: 'issuedepartment',
            rowGroup: true, hide: true,},
        { headerName: '接收部门', field: 'receivedepartment' },
        { headerName: '经手人', field: 'handler' },
        {
            headerName: '类型',
            field: 'packingtype',
            rowGroup: true, hide: true,
        },
        {
            headerName: '空瓶数量',
            field: 'num_k',
            type: 'numericColumn',
            // aggFunc: 'sum',
        },
        {
            headerName: '重瓶数量',
            field: 'num_z',
            type: 'numericColumn',
            // aggFunc: 'sum',
        }
    ];

    const autoGroupColumnDef = {
        headerName: '发出部门',
        field: 'issuedepartment',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            checkbox: true,
        },
    };

    const defaultColDef = {
        flex: 1,
        minWidth: 150,
        resizable: true,
    };

    return (
        <div
            className="ag-theme-balham"
            style={{
                height: '600px',
                width: '100%',
            }}
        >
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                // autoGroupColumnDef={autoGroupColumnDef}
                defaultColDef={defaultColDef}
                // groupIncludeFooter={true}
                // groupIncludeTotalFooter={true}
                rowSelection="multiple"
            />
        </div>
    );
};

export default ComplexTable;
