import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import getjsonlist from "../../utilities/getjsonlist";
import { Modal } from "@douyinfe/semi-ui";

const UserGoodsWarehouse = ({ userinfo }) => {
    // 商品库存信息
    const [list, setlist] = useState([])
    const { handleSubmit, register } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_Infos.UserGoodsWarehouse',
            userid: userinfo.userid
        })
        // console.log(getjsonlist(rew.data[0]))
        setlist(rew.data)
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])


    const [uselist, setuserlist] = useState([])
    const [show, setshow] = useState(false)
    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Button onClick={handleSubmit(getlist)} variant="contained">搜索</Button>
            </Box>

            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    getRowStyle={params => {
                        if (params.data && params.data.state != '正常') {
                            return { color: "pink" }
                        }

                        return { color: "black" }
                    }}
                    rowData={list}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={
                        [
                            { field: "serial", headerName: "订单号", hide: true },
                            {
                                field: "addtime",
                                headerName: "添加时间"
                            },
                            { field: "mode", headerName: "方式" },
                            {
                                field: "userid",
                                headerName: "userid",
                                hide: true
                            },
                            { field: "goodsid", headerName: "goodsid", hide: true },
                            {
                                field: "goodsname",
                                headerName: "商品名称"
                            },
                            { field: "salestype", headerName: "优惠方式" },
                            {
                                field: "price",
                                headerName: "价格"
                            },
                            {
                                field: "actualprice",
                                headerName: "实际价格"
                            },
                            { field: "initial_num", headerName: "总数量" },
                            {
                                field: "num",
                                headerName: "剩余数量"
                            }, {
                                field: "paymentstatus", headerName: "是否支付"
                            },
                            {
                                field: "begin_termofvalidity",
                                headerName: "begin_termofvalidity",
                                hide: true
                            },
                            { field: "end_termofvalidity", headerName: "end_termofvalidity", hide: true },
                            {
                                field: "department",
                                headerName: "部门"
                            },
                            { field: "operator", headerName: "操作员" },
                            {
                                field: "remarks",
                                headerName: "备注"
                            },
                            { field: "state", headerName: "状态" },
                            {
                                field: "marketprice",
                                headerName: "marketprice",
                                hide: true
                            }]
                    }
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onRowClicked={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_User_Infos.UserGoodsWarehouseUseRecord',
                            warehouseid: e.data.id,
                            userid: userinfo.userid
                        })
                        setuserlist(rew.data)
                        setshow(true)
                    }}
                />
            </Box>


            <Modal visible={show} onCancel={() => setshow(false)} footer={<></>} style={{ top: '10%', width: '70%', left: '5%' }} >
                <Box fontSize={18} mb={3}>用户商品库存使用记录信息</Box>
                <Box height={'60vh'} overflow={"scroll"}>
                    <AgGridReact
                        className='ag-theme-balham'
                        rowData={uselist}
                        columnDefs={[
                            { headerName: '订单号', field: 'serial_use' },
                            { headerName: '使用时间', field: 'addtime' },
                            { headerName: '方式', field: 'mode' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '员工', field: 'operator' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '状态', field: 'state' },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true
                        }}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default UserGoodsWarehouse;
