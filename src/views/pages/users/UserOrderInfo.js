import React, { useCallback, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import translations from "../../../utils/translations";
import { Form } from '@douyinfe/semi-ui';

const UserOrderInfo = ({ userinfo }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const [list, setlist] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const gridRef = React.useRef(null);
    return (
        <Box border={1} p={1} mt={3} borderColor="#ccc">
            <Box>
                <Form labelPosition="inset" layout="horizontal" onSubmit={async data => {
                    const rew = await request('post', '/api/getInfo', {
                        userid: userinfo.userid,
                        url: 'Srapp.Web_User_Infos.UserOrderInfo',
                        distributionstore: '全部',
                        department: '全部',
                        // state: JSON.stringify(["正常", "已安排", "已接单", "已送达", "已收瓶", "取消"]),
                        begintime: moment(data.date[0]).format('YYYY-MM-DD'),
                        endtime: moment(data.date[1]).format('YYYY-MM-DD'),
                        date: undefined,
                        goodsids: JSON.stringify(data.goodsids),
                    })
                    setlist(rew.data)
                }}>
                    <Form.DatePicker label="日期" field="date" initValue={['1999-01-01', new Date()]} type="dateRange" presets={[
                        {
                            text: '最近一周',
                            end: new Date(),
                            start: moment().subtract(7, 'days').toDate(),

                        },
                        {
                            text: '最近三个月',
                            end: new Date(),
                            start: moment().subtract(3, 'months').toDate(),
                        },
                        {
                            text: '最近一年',
                            end: new Date(),
                            start: moment().subtract(1, 'years').toDate(),
                        }
                    ]} />
                    <Form.TreeSelect label="商品" field="goodsids" multiple filterTreeNode leafOnly treeData={new_goodslist} maxTagCount={1} />
                    <Button size="small" type="submit" sx={{ ml: 1 }} variant="contained">搜索</Button>
                </Form>
            </Box>
            <Box height="50vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    ref={gridRef}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    className="ag-theme-balham"
                    getRowStyle={params => {
                        if (params.data && params.data.suborder[0]?.state === '已安排') {
                            return { color: "red" }
                        }
                        if (params.data && params.data.suborder[0]?.state === '已送达') {
                            return { color: "blue" }
                        }

                        if (params.data && params.data.suborder[0]?.state === '已接单') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.suborder[0]?.state === '取消') {
                            return { color: "pink" }
                        }
                        return { color: "black" }
                    }}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={[
                        {
                            field: 'addtime', headerName: '日期', enableRowGroup: true, hide: true,
                            valueGetter: data => data.data ? moment(data.data.addtime).format('MM-DD') : '',

                        },
                        {
                            field: 'addtime', headerName: '下单时间', enableRowGroup: true,
                            valueGetter: data => data.data ? moment(data.data.addtime).format('YYYY-MM-DD HH:mm') : '',
                            cellRenderer: 'agGroupCellRenderer'
                        },

                        {
                            field: 'appointmenttime', headerName: '预约上门时间', enableRowGroup: true,
                            valueGetter: data => data.data ? moment(data.data.appointmenttime).format('YYYY-MM-DD HH:mm') : ''
                        },

                        {
                            field: 'id', headerName: '商品',
                            enableRowGroup: true,
                            valueGetter: (params) => {
                                let str = ''
                                if (params.data) {
                                    for (let i = 0; i < params.data.suborder.length; i += 1) {
                                        str += (`${params.data.suborder[i].goodsname}X${params.data.suborder[i].num} `)

                                    }
                                }
                                return str
                            }
                        },
                        { field: 'memberid', headerName: '会员号', enableRowGroup: true },
                        {
                            field: 'department', headerName: '门店', enableRowGroup: true,
                            valueGetter: params => params.data ? params?.data?.suborder[0]?.department : '',
                        },
                        { field: 'name', headerName: '联系人', enableRowGroup: true },
                        { field: 'telephone', headerName: '联系人电话', enableRowGroup: true },
                        { field: 'address', headerName: '地址', enableRowGroup: true },
                        { field: 'balance', headerName: '交易后余额', enableRowGroup: true },
                        { field: 'primary_balance', headerName: '交易前余额', enableRowGroup: true },
                        {
                            field: 'deliveryman', headerName: '配送员', enableRowGroup: true,
                            valueGetter: params => params.data ? params?.data?.suborder[0]?.deliveryman : ''
                        },
                        { field: 'booking_operator', headerName: '预约人', enableRowGroup: true },

                        {
                            field: 'payment',
                            headerName: '支付方式',
                            enableRowGroup: true,
                            valueGetter: params => params.data ? params?.data?.suborder[0]?.payment : '',

                        },
                        {
                            field: 'suborder', enableRowGroup: true, headerName: '状态', valueGetter: (params) => {
                                if (params.data) {
                                    return params?.data?.suborder[0]?.state
                                }
                                return ''
                            }
                        },
                        { field: 'remarks', headerName: '备注', enableRowGroup: true },
                        { field: 'ope_remarks', headerName: '内部备注', enableRowGroup: true },
                        { field: 'ope_remarks', headerName: '送达时间', enableRowGroup: true, valueGetter: ({ data }) => data?.suborder[0]?.arrivetime },
                        { field: 'ope_remarks', headerName: '打印时间', enableRowGroup: true, valueGetter: ({ data }) => data?.suborder[0]?.arrangetime },

                    ]}
                    masterDetail="true"
                    embedFullWidthRows="true"
                    detailRowAutoHeight="true"

                    detailCellRendererParams={{
                        detailGridOptions: {
                            columnDefs: [
                                { field: 'arrangetime', headerName: '打印时间', width: 100 },
                                { field: 'arrivetime', headerName: '送达时间', width: 100 },
                                { field: 'distributionmode', headerName: '派单模式', width: 100 },
                                { field: 'goodsname', headerName: '商品名称', width: 100 },
                                { field: 'num', headerName: '数量', width: 100 },
                                { field: 'total', headerName: '小计', width: 100 },
                                { field: 'mode', headerName: '模式', width: 100 },
                                { field: 'pay_arrears', headerName: '月结支付', width: 100 },
                                { field: 'pay_balance', headerName: '余额支付', width: 100 },
                                { field: 'pay_cash', headerName: '现金支付', width: 100 },
                                { field: 'pay_cashgift', headerName: '现金券支付', width: 100 },
                                { field: 'pay_coupon', headerName: '优惠券支付', width: 100 },
                                { field: 'pay_online', headerName: '在线支付', width: 100 },
                                { field: 'pay_stock', headerName: '库存支付', width: 100 },
                                { field: 'department', headerName: '订单部门', width: 100 },
                                { field: 'cancel_department', headerName: '取消部门', width: 100 },
                                { field: 'cancel_operator', headerName: '取消操作员', width: 100 },
                                { field: 'cancel_remarks', headerName: '取消备注', width: 100 },
                                { field: 'cancel_time', headerName: '取消时间', width: 100 },
                                { field: 'state', headerName: '子订单状态', width: 100 },
                            ],
                            defaultColDef: {

                                resizable: true
                            },
                        },
                        getDetailRowData: (params) => {
                            console.log(gridRef)
                            params.successCallback(params.data.suborder);
                        },

                    }}


                    rowData={list}

                    localeText={translations}


                />
            </Box>

        </Box>
    );
};

export default UserOrderInfo;
