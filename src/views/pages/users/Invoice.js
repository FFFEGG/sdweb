import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from "react-redux";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import UserInfo from "./UserInfo";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Modal, Popconfirm, Tabs, TabPane, Input } from "@douyinfe/semi-ui";
import { AgGridReact } from "ag-grid-react";
import { between } from "react-table/src/filterTypes";
import initData from "../../initData";


const Invoice = ({ customization }) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState('')
    const [UserInvoiceRecordList, setUserInvoiceRecord] = useState([])
    const [remarks, setremarks] = useState('')
    const [invoicelist, setInvoice] = useState([])
    const [goodsjson, setgoodsjson] = useState([])
    const [begintime, setbegintime] = useState(moment().format('YYYY-MM-DD'))
    const [endtime, setendtime] = useState(moment().format('YYYY-MM-DD'))
    const getlist = async (datetype) => {
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Invoice_Infos.UserDrawBillSalesRecord',
            begintime,
            endtime,
            type: datetype,
            userid: userinfo.userid
        })
        setlist(rew.data)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])
    const gridRef = useRef()

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        // console.log(selectedRows);
        setInvoice(selectedRows)
    }, []);


    const UserInvoiceRecord = async () => {
        setUserInvoiceRecord([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Invoice_Infos.UserInvoiceRecord',
            begintime,
            userid: userinfo.userid,
            endtime
        })
        // console.log(rew)
        setUserInvoiceRecord(rew.data)
    }

    const total = useMemo(() => invoicelist.reduce((total, item) => total + item.price * item.num - item.pay_coupon - item.pay_cashgift - item.residual_air_total, 0), [invoicelist])

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3}>
                <Tabs type="card">
                    <TabPane tab="开票" itemKey="1">
                        <Box paddingTop={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                            <Box display={'flex'} pb={1} >
                                <Input prefix="开始时间" value={begintime} type='date' onChange={e => setbegintime(e)} style={{ width: 220, height: 40 }} size="small" placeholder="开始时间" />
                                <Input prefix="结束时间" value={endtime} type='date' onChange={e => setendtime(e)} style={{ width: 220, height: 40, marginLeft: 3 }} size="small" placeholder="结束时间" />
                            </Box>
                            <Box display="flex" alignItems="center">

                                <Button size="large" onClick={() => {
                                    getlist('未开票')
                                }} variant="outlined">搜索用户开票订单</Button>
                                <Popconfirm title="提示" content="确认操作？" onConfirm={async () => {

                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Invoice_Handle.AddUserInvoiceGoods',
                                        userid: userinfo.userid,
                                        serials: JSON.stringify(invoicelist.map(item => item.serial)),
                                        remarks
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('操作成功')
                                    } else {
                                        toast.error('操作失败')
                                    }
                                    getlist('未开票')
                                    // console.log(rew);
                                }}>
                                    <Button size="large" sx={{ marginLeft: 1 }} variant="outlined">合并开票</Button>
                                </Popconfirm>
                                <TextField value={remarks} onChange={e => setremarks(e.target.value)} sx={{ marginLeft: 1 }}
                                    size="small" placeholder="开票备注" />
                                <Typography sx={{ ml: 1 }} color="red" fontSize={18}>[合计: {total}] </Typography>
                            </Box>

                            <Box height="80vh" overflow="scroll" marginTop={3}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowSelection="multiple"
                                    rowData={list}
                                    className="ag-theme-balham"
                                    onSelectionChanged={onSelectionChanged}
                                    columnDefs={[
                                        { headerName: '单据号', field: 'serial', checkboxSelection: true,headerCheckboxSelection: true },
                                        { headerName: '时间', field: 'addtime' },
                                        { headerName: '商品', field: 'goodsname' },
                                        { headerName: '数量', field: 'num' },
                                        {
                                            headerName: '专项款支付',
                                            field: 'pay_cashgift',
                                            valueFormatter: (data) => parseFloat(data.data.pay_cashgift).toFixed(2)
                                        },
                                        {
                                            headerName: '优惠券',
                                            field: 'pay_coupon',
                                            valueFormatter: (data) => parseFloat(data.data.pay_coupon).toFixed(2)
                                        },
                                        {
                                            headerName: '交易单价',
                                            field: 'price',
                                            valueFormatter: (data) => parseFloat(data.data.price).toFixed(2)
                                        },
                                        {
                                            headerName: '余气金额',
                                            field: 'residual_air_total',
                                            valueFormatter: (data) => parseFloat(data.data.residual_air_total).toFixed(2)
                                        },
                                        {
                                            headerName: '换气金额',
                                            field: 'total',
                                            valueFormatter: (data) => parseFloat(data.data.total).toFixed(2)
                                        },
                                    ]}
                                    defaultColDef={{
                                        // flex: 1
                                        resizable: true,
                                        sortable: true,
                                    }}
                                />
                            </Box>

                        </Box>
                    </TabPane>
                    <TabPane tab="重置/冲红" itemKey="2">


                        <Box mt={3}>
                            <Button onClick={() => {
                                UserInvoiceRecord()
                            }} variant="contained">搜索用户已开票信息</Button>
                            <Box mt={3} height="60vh" overflow="scroll">
                                <AgGridReact

                                    rowData={UserInvoiceRecordList}
                                    className="ag-theme-balham"
                                    columnDefs={[

                                        { headerName: '推送时间', field: 'addtime' },
                                        { headerName: '门店', field: 'department' },
                                        { headerName: '开票人', field: 'operator' },
                                        { headerName: '金额', field: 'total' },
                                        { headerName: '备注', field: 'remarks' },
                                        {
                                            headerName: '详情', field: 'goodsdetails', valueFormatter: data => {
                                                const list = JSON.parse(data.data.goodsdetails)
                                                let str = ''
                                                for (let i = 0; i < list.length; i += 1) {
                                                    str += `${list[i].goodsname} X ${list[i].num}`
                                                }
                                                return str
                                            }
                                        },
                                        { headerName: '状态', field: 'state' },
                                        {
                                            headerName: '操作', pinned: 'right', cellRendererFramework: data =>

                                                <>
                                                {
                                                    data.data.state === '正常' &&
                                                    <Popconfirm
                                                        title="提示"
                                                        content="确认操作？"
                                                        onConfirm={async () => {
                                                            const rew = await request('post', '/api/getInfo', {
                                                                url: 'Srapp.Web_Invoice_Handle.ResettingUserInvoiceRecord',
                                                                serial: data.data.serial,
                                                                userid: userinfo.userid
                                                            })
                                                            if (rew.data.msg === 'SUCCESS') {
                                                                toast.success('重置成功')
                                                            } else {
                                                                toast.error(`重置失败 ${rew.data.tips}`)
                                                            }
                                                            UserInvoiceRecord()
                                                        }}
                                                    ><Button size={'small'} variant="contained">重置</Button></Popconfirm>


                                                }

                                                    {
                                                        data.data.state === '已送达' &&
                                                        <Popconfirm
                                                            title="提示"
                                                            content="确认冲红操作？"
                                                            onConfirm={async () => {
                                                                const rew = await request('post', '/api/getInfo', {
                                                                    url: 'Srapp.Web_Invoice_Handle.InvoiceWriteOffs',
                                                                    id: data.data.id,
                                                                    userid: userinfo.userid
                                                                })
                                                                if (rew.data.msg === 'SUCCESS') {
                                                                    toast.success('冲红成功')
                                                                } else {
                                                                    toast.error(`冲红失败 ${rew.data.tips}`)
                                                                }
                                                                UserInvoiceRecord()
                                                            }}
                                                        ><Button size={'small'} variant="contained">冲红</Button></Popconfirm>


                                                    }
                                                </>



                                        },
                                    ]}
                                    defaultColDef={{
                                        // flex: 1
                                        resizable: true,
                                        sortable: true,
                                    }}
                                />
                            </Box>
                        </Box>
                    </TabPane>

                    <TabPane tab="手动开票" itemKey="3">
                        <Box mt={3}>
                            <Button onClick={() => {
                                goodsjson.push({
                                    goodsname: '',
                                    price: 120,
                                    num: 1,
                                    pay_coupon: 0,
                                    pay_cashgift: 0,
                                    residual_air_total: 0,
                                })
                                setgoodsjson([...goodsjson])
                            }} variant="contained">新增商品</Button>

                            <Button sx={{ marginLeft: 1 }} color="error" variant="outlined" onClick={() => {
                                setgoodsjson([])
                                setremarks('')
                            }}>刷新</Button>
                            {
                                goodsjson.map((items, k) => <Box display="flex" justifyContent="between" alignItems="center" paddingY={1}>
                                    <Select value={items.goodsname} onChange={e => {
                                        goodsjson[k].goodsname = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} size="small" sx={{ width: 200 }}>
                                        {
                                            initData.GoodsList.filter(item => item.canuse === true).map(item => <MenuItem
                                                value={item.name}>{item.name}</MenuItem>)
                                        }

                                    </Select>
                                    <TextField onChange={e => {
                                        goodsjson[k].price = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} value={items.price} label="单价" size="small" />



                                    <TextField onChange={e => {
                                        goodsjson[k].num = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} value={items.num} label="数量" size="small" />


                                    <TextField onChange={e => {
                                        goodsjson[k].pay_coupon = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} value={items.pay_coupon} label="优惠券金额" size="small" />


                                    <TextField onChange={e => {
                                        goodsjson[k].pay_cashgift = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} value={items.pay_cashgift} label="专项款金额" size="small" />


                                    <TextField onChange={e => {
                                        goodsjson[k].residual_air_total = e.target.value
                                        setgoodsjson([...goodsjson])
                                    }} value={items.residual_air_total} label="余气金额" size="small" />


                                    <Button onClick={() => {
                                        console.log(k)
                                        const list = goodsjson
                                        list.splice(k, 1)
                                        setgoodsjson([...list])

                                    }} variant="outlined">删除</Button>
                                </Box>)
                            }

                            <TextField value={remarks} onChange={e => setremarks(e.target.value)} sx={{ marginTop: 1 }} fullWidth placeholder="开票备注" size="small" />

                            <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                let arr = []
                                for (let i = 0; i < goodsjson.length; i++) {
                                    const item = goodsjson[i]
                                    item.num = parseInt(item.num)
                                    item.price = parseFloat(item.price)
                                    item.pay_coupon = parseFloat(item.pay_coupon)
                                    item.pay_cashgift = parseFloat(item.pay_cashgift)
                                    item.residual_air_total = parseFloat(item.residual_air_total)
                                    arr.push(item)
                                }
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Invoice_Handle.ManualAdditionUserInvoiceGoods',
                                    goodsjson: JSON.stringify(arr),
                                    remarks,
                                    userid: userinfo.userid
                                })

                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('操作成功')
                                } else {
                                    toast.error('操作失败')
                                }
                                setgoodsjson([])
                                setremarks('')
                            }}>
                                <Button sx={{ marginTop: 3 }} variant="contained">确认开票</Button>
                            </Popconfirm>


                        </Box>

                    </TabPane>
                </Tabs>
            </Box>


        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Invoice);
