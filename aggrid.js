import {AgGridReact} from "ag-grid-react";
import moment from "moment";
import React from "react";

<AgGridReact
    reactUi="true"

    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
    className="ag-theme-alpine"
    // masterDetail="true"
    // detailCellRenderer={detailCellRenderer}
    embedFullWidthRows="true"
    columnDefs={[
        {
            field: 'addtime', headerName: '日期', enableRowGroup: true,hide: true,
            valueGetter: data => data.data ? moment(data.data.addtime).format('MM-DD') : '',

        },
        {
            field: 'addtime', headerName: '下单时间', enableRowGroup: true,
            valueGetter: data => data.data ? moment(data.data.addtime).format('MM-DD HH:mm') : '',
            // cellRenderer: 'agGroupCellRenderer'
        },

        {
            field: 'appointmenttime', headerName: '预约上门时间', enableRowGroup: true,
            valueGetter: data => data.data ? moment(data.data.appointmenttime).format('MM-DD HH:mm') : ''
        },
        {
            field: 'arrangetime', headerName: '打印时间', enableRowGroup: true,
            valueGetter: data => data.data ? moment(data.data.suborder[0].arrangetime).format('MM-DD HH:mm') : ''

        },
        {
            field: 'id', headerName: '商品',
            enableRowGroup: true,
            valueGetter: (params) => {
                let str = ''
                if (params.data) {
                    for (let i = 0; i < params.data.suborder.length; i += 1) {
                        if (params.data.suborder[i].goodstype === '液化气') {
                            str += (`${params.data.suborder[i].goodsname}X${params.data.suborder[i].num} `)
                        } else {
                            str += ' '
                        }

                    }
                }
                return str
            }
        },
        {field: 'memberid', headerName: '会员号', enableRowGroup: true},
        {field: 'name', headerName: '联系人', enableRowGroup: true},
        {field: 'telephone', headerName: '联系人电话', enableRowGroup: true},
        {field: 'address', headerName: '地址', enableRowGroup: true},
        {
            field: 'deliveryman', headerName: '配送员', enableRowGroup: true,
            valueGetter: params => params.data ? params.data.suborder[0].deliveryman : ''
        },
        {field: 'booking_ope', headerName: '预约人', enableRowGroup: true},

        {
            field: 'payment',
            headerName: '支付方式',
            enableRowGroup: true,
            valueGetter: params => params.data ? params.data.suborder[0].payment : ''
        },
        {
            field: 'suborder', enableRowGroup: true, headerName: '状态', valueGetter: (params) => {
                if (params.data) {
                    return params.data.suborder[0].state
                }
                return ''
            }
        },
        {field: 'remarks', headerName: '备注', enableRowGroup: true},
        {field: 'ope_remarks', headerName: '内部备注', enableRowGroup: true},

    ]}
    localeTextFunc={(data) => {
        if (data === 'autosizeAllColumns') {
            return '自适应列宽度'
        }
        if (data === 'autosizeThiscolumn') {
            return '展开这一列'
        }
        if (data === 'resetColumns') {
            return '重置列'
        }

        if (data === 'pinColumn') {
            return '固定列'
        }
        if (data === 'rowGroupColumnsEmptyMessage') {
            return '拖拽这里分组排序'
        }

        if (data === 'pinLeft') {
            return '固定左'
        }

        if (data === 'pinRight') {
            return '固定右'
        }
        if (data === 'group') {
            return '分组'
        }

        if (data === 'noPin') {
            return '不固定'
        }


        return data
    }}
    // animateRows="true"
    // detailCellRendererParams={detailCellRendererParams}
    // masterDetail="true"
    defaultColDef={defaultColDef}
    // autoGroupColumnDef={autoGroupColumnDef}
    rowGroupPanelShow="always"
    // enableRangeSelection="true"
    rowData={List}
    // rowSelection="multiple"
    // groupSelectsChildren="true"
    onRowClicked={(params) => {
        if (!params.data) {
            return;
        }
        const arr = params.data.suborder.filter(item => item.state === '正常')
        if (arr.length !== 0) {
            setorderData(params.data.suborder)
            setappointmenttime(params.data.appointmenttime)
            setmainorder(params.data)
            setopen(true)

            for (let i = 0; i < params.data.suborder.length; i += 1) {
                parameter.push({
                    id: params.data.suborder[i].id,
                    grant: [],
                    recovery: [],
                })
                setparameter([...parameter])
            }
            return;
        }
        const arrs = params.data.suborder.filter(item => item.state === '已安排')

        if (arrs.length !== 0) {
            setorderData(params.data.suborder)
            setappointmenttime(params.data.appointmenttime)
            setmainorder(params.data)
            sethzopen(true)

            for (let i = 0; i < params.data.suborder.length; i += 1) {
                parameter.push({
                    id: params.data.suborder[i].id,
                    grant: [],
                    recovery: [],
                })
                setparameter([...parameter])
            }
            const initialValue = 0;
            const sum = (params.data.suborder).reduce(
                (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.pay_cash),
                initialValue
            )
            setcash(sum)
        }
    }}
    // suppressRowClickSelection="true"
    getRowStyle={params => {
        if (params.data && params.data.suborder[0].state === '已安排') {
            return {color: "red"}
        }
        if (params.data && params.data.suborder[0].state === '已送达') {
            return {color: "blue"}
        }
        return {color: "black"}
    }}
/>


