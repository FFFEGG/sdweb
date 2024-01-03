import React from 'react';
import {useTable} from 'react-table'
import styled from 'styled-components'

const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid #ccc;
    width: 100%;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      text-align: left;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const Mytable = ({columns, data}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })
    return (
        <Styles>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </Styles>
    );
};

export default Mytable;