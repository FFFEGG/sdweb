import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import getjsonlist from "../../utilities/getjsonlist";
import { Form } from '@douyinfe/semi-ui';
import translation from 'utils/translations.json';

const UserGoodsSalesRecord = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const [goodsarr, setGoodsarr] = useState([]);
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))

    const { handleSubmit, register } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_Infos.UserGoodsSalesRecord',
            userid: userinfo.userid
        })
        if (rew.data.length) {
            rew.data.push({
                goodsname: '合计',
                num: rew.data.reduce((a, b) => a + b.num, 0),
            })
        }
        setlist(rew.data)
        // console.log(getjsonlist(rew.data[0]))

    }
    useEffect(() => {
        setlist([])
    }, [userinfo])


    const ref = useRef()
    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Form labelPosition="inset" layout="horizontal" onSubmit={async data => {
                    const rew = await request('post', '/api/getInfo', {
                        ...data,
                        url: 'Srapp.Web_User_Infos.UserGoodsSalesRecord',
                        userid: userinfo.userid,
                        begintime: moment(data.date[0]).format('YYYY-MM-DD'),
                        endtime: moment(data.date[1]).format('YYYY-MM-DD'),
                        goodsids: JSON.stringify(data.goodsids),
                        date: undefined
                    })
                    if (rew.data.length) {
                        rew.data.push({
                            addtime: '合计',
                            num: rew.data.reduce((a, b) => a + b.num * 1, 0),
                            total: rew.data.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2),

                        })
                    }
                    setlist(rew.data)
                    let arr = new Set()
                    rew.data.forEach(item => {
                        if (item.goodsname !== undefined) {
                            arr.add(item.goodsname)
                        }
                    })

                    setGoodsarr(Array.from(arr))
                }} onChange={e => {
                    let key = e.values?.goodsname || ''
                    ref.current.api.setQuickFilter(key)
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
                    <Form.TreeSelect label="商品名称" field='goodsids' treeData={new_goodslist} multiple maxTagCount={2} leafOnly filterTreeNode />
                    <Button size="small" type="submit" sx={{ ml: 1 }} variant="contained">搜索</Button>
                </Form>
                {/* <TextField {...register('begintime')} size="small" type="date" />
                <TextField {...register('endtime')} size="small" type="date" /> */}

            </Box>
            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    localeText={translation}
                    ref={ref}
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    // onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    // getRowStyle={params => {
                    //     if (params.data && params.data.state != '正常') {
                    //         return { color: "pink" }
                    //     }

                    //     return { color: "black" }
                    // }}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,

                    }}
                    columnDefs={
                        [

                            {
                                field: "addtime",
                                headerName: "添加时间",

                            },
                            {
                                field: "collection_date",

                                headerName: "确认收款日期"
                            },
                            {
                                field: "mode",

                                headerName: "模式"
                            },
                            {
                                field: "goodsname",

                                headerName: "商品名称"
                            },
                            {
                                field: "packingtype",

                                headerName: "包装物"
                            },
                            {
                                field: "marketprice",

                                headerName: "市场价"
                            },
                            {
                                field: "num",

                                headerName: "数量"
                            },
                            {
                                field: "total",

                                headerName: "合计"
                            },
                            {
                                field: "payment",

                                headerName: "支付方式"
                            },
                            {
                                field: "inandout",

                                headerName: "收支"
                            },
                            {
                                field: "transaction_amount",

                                headerName: "交易金额"
                            },

                            {
                                field: "state",

                                headerName: "状态"
                            },
                            {
                                field: "residual_air_price",

                                headerName: "余气单价"
                            },
                            {
                                field: "residual_air_weight",

                                headerName: "余气重量"
                            },
                            {
                                field: "residual_air_total",

                                headerName: "余气合计"
                            },





                            {
                                field: "serial",
                                headerName: "订单号",

                                hide: true
                            },
                            {
                                field: "goodscat",
                                headerName: "商品分类",

                                hide: true
                            },
                            {
                                field: "serial_sale",
                                headerName: "销售单据号",

                                hide: true
                            },
                            {
                                field: "source",

                                headerName: "来源"
                            },

                            {
                                field: "salesmethods",

                                headerName: "销售模式"
                            },

                            {
                                field: "combinationgoods",

                                headerName: "组合商品",
                                hide: true
                            },

                            {
                                field: "attribute",

                                headerName: "商品属性"
                            },

                            {
                                field: "goodstype",
                                headerName: "商品类型",

                                hide: true
                            },
                            {
                                field: "goodsbrand",
                                headerName: "品牌",

                                hide: true
                            },




                            {
                                field: "price",

                                headerName: "单价"
                            },



                            {
                                field: "pay_arrears",

                                headerName: "月结支付"
                            },
                            {
                                field: "pay_cash",

                                headerName: "现金支付"
                            },
                            {
                                field: "pay_balance",

                                headerName: "余额支付"
                            },
                            {
                                field: "pay_online",

                                headerName: "在线支付"
                            },
                            {
                                field: "online_pay_serial",

                                headerName: "在线支付订单号",
                                hide: true
                            },
                            {
                                field: "pay_stock",

                                headerName: "库存款支付"
                            },
                            {
                                field: "pay_cashgift",

                                headerName: "专项款支付"
                            },
                            {
                                field: "pay_coupon",

                                headerName: "优惠券支付"
                            },
                            {
                                field: "couponinfo",

                                headerName: "优惠券"
                            },
                            {
                                field: "payfeeids",

                                headerName: "费用id",
                                hide: true
                            },
                            {
                                field: "userid",
                                headerName: "userid",

                                hide: true
                            },
                            {
                                field: "memberid",

                                headerName: "memberid",
                                hide: true
                            },
                            {
                                field: "username",

                                headerName: "姓名"
                            },
                            {
                                field: "workplace",

                                headerName: "单位"
                            },
                            {
                                field: "province",

                                headerName: "province",
                                hide: true
                            },
                            {
                                field: "city",
                                headerName: "city",
                                hide: true
                            },
                            {
                                field: "area",
                                headerName: "area",
                                hide: true
                            },
                            {
                                field: "town",
                                headerName: "town",
                                hide: true
                            },
                            {
                                field: "address",

                                headerName: "地址"
                            },
                            {
                                field: "floor",

                                headerName: "楼层"
                            },
                            {
                                field: "servicearea",
                                headerName: "servicearea",
                                hide: true
                            },
                            {
                                field: "viplevel",
                                headerName: "viplevel",
                                hide: true
                            },
                            {
                                field: "attributiondepartment",

                                headerName: "归属部门"
                            },
                            {
                                field: "customertype",

                                headerName: "用户类型"
                            },
                            {
                                field: "salesman",

                                headerName: "销售员"
                            },
                            {
                                field: "accountopeningtime",
                                headerName: "开户时间",
                                hide: true
                            },
                            {
                                field: "developsalesman",
                                headerName: "开户人员",
                                hide: true
                            },
                            {
                                field: "invoice",

                                headerName: "发票"
                            },
                            {
                                field: "booking_department",

                                headerName: "预约部门"
                            },
                            {
                                field: "booking_operator",

                                headerName: "预约人"
                            },
                            {
                                field: "booking_opeid",
                                headerName: "booking_opeid",
                                hide: true
                            },
                            {
                                field: "department",

                                headerName: "部门"
                            },
                            {
                                field: "operator",

                                headerName: "操作员",
                            },
                            {
                                field: "opeid",
                                headerName: "opeid",
                                hide: true
                            },
                            {
                                field: "distributionmode",

                                headerName: "派单模式"
                            },
                            {
                                field: "selfmention",
                                headerName: "selfmention",
                                hide: true
                            },
                            {
                                field: "deliveryman",

                                headerName: "配送员"
                            },
                            {
                                field: "deliveryman_opeid",
                                headerName: "deliveryman_opeid",
                                hide: true
                            },





                            {
                                field: "residual_air_remarks",

                                headerName: "余气备注"
                            },

                            {
                                field: "collection_amount",

                                headerName: "collection_amount",
                                hide: true
                            },
                            {
                                field: "collection_department",

                                headerName: "确认收款部门"
                            },
                            {
                                field: "collection_ope",

                                headerName: "确认收款人"
                            },
                            {
                                field: "collection_serial",
                                headerName: "collection_serial",
                                hide: true
                            },
                            {
                                field: "inserttime",
                                headerName: "inserttime",
                                hide: true
                            },
                            {
                                field: "modifytime",
                                headerName: "modifytime",
                                hide: true
                            },
                            {
                                field: "remarks",

                                headerName: "备注"
                            }]
                    }
                />
            </Box>
        </Box>
    );
};

export default UserGoodsSalesRecord;
