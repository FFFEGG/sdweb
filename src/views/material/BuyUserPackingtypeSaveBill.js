import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import NavCard from "../../ui-component/cards/NavCard";
import UserInfo from "../pages/users/UserInfo";
import { connect } from "react-redux";
import UserPackingtypeWarehouse from "../pages/users/UserPackingtypeWarehouse";
import { Popconfirm } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';
import {getCode} from "../../utils/getCode";

const BuyUserPackingtypeSaveBill = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([])
    const [type, settype] = useState('票据')
    const [code, setcode] = useState('')
    const [remarks, setremarks] = useState('')
    const [residual, setresidual] = useState(0)
    const [packingtypwarehouseserial, setpackingtypwarehouseserial] = useState('')
    const [packingtypwarehouseid, setpackingtypwarehouseid] = useState('')

    const getlist = async () => {
        if (!userinfo.userid) {
            return;
        }
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse',
            userid: userinfo.userid,
            begintime: '1991-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        })
        const arr = (rew.data).filter(item => (item.state === '正常' && item.mode === '暂存'))
        // 排出arr中mode = ‘带入’ && state != ‘正常’的数据
        // const arr1 = arr.filter(item => !(item.mode === '暂存' && item.state == '正常'))


        setlist(arr)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    useEffect(() => {
        getlist()
    }, [userinfo])

    return (
        <Box>

            <NavCard title="用户业务办理" subtitle="收购转存瓶" />

            <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
                <Box mt={2} height="30vh">
                    <AgGridReact
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'addtime', headerName: '办理时间', },
                            { field: 'serial', headerName: '订单号', },
                            { field: 'mode', headerName: '办理方式', },
                            { field: 'name', headerName: '商品名称', },
                            { field: 'packingtype', headerName: '包装物', },
                            { field: 'num', headerName: '数量', },
                            { field: 'billingmode', headerName: '计费方式', },
                            { field: 'billno', headerName: '票据号', },
                            { field: 'price', headerName: '价格', },
                            { field: 'remarks', headerName: '备注', },
                            { field: 'department', headerName: '办理部门', },
                            { field: 'department_use', headerName: '使用部门', },
                            { field: 'operator_use', headerName: '使用人', },
                            { field: 'usetime', headerName: '使用时间', },
                            { field: 'state', headerName: '状态', },
                        ]}
                        rowSelection="single"
                        rowData={list}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                        onRowClicked={data => {
                            setpackingtypwarehouseserial(data.data.serial)
                            setpackingtypwarehouseid(data.data.id)
                            // setcode(data.data.billno)
                            // 118-50元，28.6/35.5-20元，12-5元
                            if (data.data.packingtype.includes('35.5') || data.data.packingtype.includes('28.6')) {
                                setcode('20')
                            }
                            if (data.data.packingtype.includes('118')) {
                                setcode('50')
                            }
                            if (data.data.packingtype.includes('12')) {
                                setcode('5')
                            }

                        }}
                        onGridReady={params => {
                            params.api.sizeColumnsToFit();
                        }}
                        getRowStyle={params => {
                            if (params.data && params.data.state === '已使用') {
                                return { color: "red" }
                            }

                            return { color: "black" }
                        }}
                    />
                </Box>

                <Box>
                    <TextField value={packingtypwarehouseserial} label="单据号" fullWidth sx={{ mt: 2 }}
                               InputLabelProps={{ shrink: true }} />


                    <TextField value={code} onChange={(data) => setcode(data.target.value)} label="单价" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />

                    <Popconfirm title="提示" content="确认办理？" onConfirm={async () => {
                        // let str = await getCode(code)
                        // console.log('str',str)
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_BusinessProcessing_Handle.BuyUserPackingtypeSaveBill',
                            id: packingtypwarehouseid,
                            serial: packingtypwarehouseserial,
                            price: code,
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('办理成功！')
                            getlist()
                            if (rew.data.printinfo) {
                                myprint(rew.data.printinfo)
                            }
                        } else {
                            toast.error(`办理失败！${rew.data.tips}`)
                        }
                    }}><Button sx={{ mt: 2 }} variant="contained">确认办理</Button></Popconfirm>
                </Box>
            </Box>

        </Box>
    );
};
const mapStateToProps = (state) => state

export default connect(mapStateToProps)(BuyUserPackingtypeSaveBill);
