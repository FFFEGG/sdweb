import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Popconfirm } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Modal, Typography } from "@mui/material";
import request from "../../utils/request";
import { toast } from 'react-toastify'
import { AgGridReact } from "ag-grid-react";
import printJS from "print-js";

const NoTraceTheSourceMaterialStockReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_department = JSON.parse(localStorage.getItem('new_department_byname'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const new_PackingtypeList = JSON.parse(localStorage.getItem('new_PackingtypeList'))
    const [list, setList] = useState([])
    const [sublist, setsublist] = useState([])
    const [open, setopen] = useState(false)
    const [columnDefslist, setcolumnDefs] = useState([])
    const api = useRef()
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取非溯源类包装物库存报表</Typography>
            <Form getFormApi={formapi => { api.current = formapi }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.NoTraceTheSourceMaterialStockReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    // goodsids: JSON.stringify(e.goodsids),
                    // packingtype: JSON.stringify(e.packingtype),
                })
                // let arr = rew.data
                // for (let i = 0; i < arr.length; i++) {
                //     arr[i].TransferOutOfUser = parseInt(arr[i].TransferOutOfUser)
                // }
                const arr = rew.data.info.sort((a, b) => {
                    if (a.type == '重') {
                        return -1
                    } else {
                        return 1
                    }
                })
                setList(arr)
                // setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                {

                    (loginuser.login_department === '信息中心' || loginuser.login_department === '配送部' || loginuser.login_department === '财务部') ?
                        <Form.TreeSelect leafOnly multiple filterTreeNode treeData={new_department} field={'department'} label={'业务部门'} style={{width: 200}} maxTagCount={1} />


                        : ''
                }

                {/* 
                <Form.Select field='goodsids' initValue={initData.GoodsList.filter(
                    item => {
                        if (item.attribute == '实体商品') {
                            if (item.salesmethods.includes('周转销售(扫描)')) {
                                return false
                            }
                            return true
                        } else {
                            return false
                        }

                    }
                ).map(item => item.id)} rules={[
                    { required: true }
                ]} maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => {
                            if (item.attribute == '实体商品') {
                                if (item.salesmethods.includes('周转销售(扫描)')) {
                                    return false
                                }
                                return true
                            } else {
                                return false
                            }

                        }).map(item => <Form.Select.Option
                            value={item.id}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select> */}


                {/* <Form.TreeSelect maxTagCount={1} field='goodsids' rules={[
                    { required: true }
                ]} label="商品" multiple filter filterTreeNode leafOnly treeData={new_goodslist} />
                <Form.TreeSelect maxTagCount={1} field='packingtype' rules={[
                    { required: true }
                ]} label="包装物" multiple filter filterTreeNode leafOnly treeData={new_PackingtypeList} /> */}



                {/* <Form.Select field='packingtype' rules={[
                    { required: true }
                ]} maxTagCount={1} multiple label="包装物" style={{ width: 200 }}>
                    {
                        initData.PackingtypeList.map(item => <Form.Select.Option
                            value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select> */}


                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />



                <Button type="submit" variant="contained" size="small">搜索</Button>

                <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.NoTraceTheSourceMaterialStockBookkeeping',
                        begintime: api.current.getValue('begintime'),
                        endtime: api.current.getValue('endtime'),
                        datajson: JSON.stringify(list)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                }}>
                    <Button sx={{ ml: 3 }} variant="contained" size="small">记账</Button>
                </Popconfirm>


                <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.CancelNoTraceTheSourceMaterialStockBookkeeping',
                        begintime: api.current.getValue('begintime'),
                        endtime: api.current.getValue('endtime')
                        // datajson: JSON.stringify(list)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                }}>
                    <Button sx={{ ml: 3 }} variant="contained" size="small">删除记账</Button>
                </Popconfirm>


                <Button sx={{ ml: 3 }} type="button" variant="contained" size="small" onClick={()=>{
                    printJS({
                        printable: list,
                        properties: [
                            { field: 'goodsname', displayName: '商品' },
                            { field: 'type', displayName: '类型' },
                            { field: 'packingtype', displayName: '包装物类型' },
                            { field: 'beginstocknum', displayName: '期初库存数量' },
                            { field: 'TransferInOfOther', displayName: '其它调入' },
                            { field: 'TransferInOfUser', displayName: '用户退空调入' },
                            { field: 'TransferInOfUserSales', displayName: '用户回空调入' },
                            { field: 'SalesUseBillsOfUser', displayName: '用户销售使用票据' },
                            { field: 'TransferOutOfOther', displayName: '其它调出' },
                            { field: 'TransferOutOfUser', displayName: '用户销售调出' },
                            { field: 'endstocknum', displayName: '期末库存数量' },

                        ],
                        type: 'json',
                        gridHeaderStyle: 'max-width: 100px;font-size: 9px;border: 1px solid #000;',
                        gridStyle: 'border: 1px solid #000;',
                        header: `<div style="display:flex;
                        justify-content:space-between;    
                        margin-bottom:10px;">
                         
                            <div>时间:${api.current.getValue('begintime')}至
                            ${api.current.getValue('endtime')}</div>
                            
                            <div style="margin-left: 20px;">打印人:${loginuser.name}</div>
                            <div style="margin-left: 20px;">部门:${loginuser.login_department}</div>
                        </div>`,

                    })
                }}>打印</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '类型', field: 'type' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '期初库存数量', field: 'beginstocknum' },
                        { headerName: '其它调入', field: 'TransferInOfOther' },
                        { headerName: '用户退空调入', field: 'TransferInOfUser' },
                        { headerName: '用户回空调入', field: 'TransferInOfUserSales' },
                        { headerName: '用户销售使用票据', field: 'SalesUseBillsOfUser' },
                        { headerName: '其它调出', field: 'TransferOutOfOther' },
                        { headerName: '用户销售调出', field: 'TransferOutOfUser' },
                        { headerName: '期末库存数量', field: 'endstocknum' },
                    ]}

                    onCellDoubleClicked={async (data) => {
                        // console.log(data);
                        const post = api.current.getValues()
                        const arr = initData.GoodsList.filter(item => item.name === data.data?.goodsname)
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Material_Infos.NoTraceTheSourceMaterialStockReportDetailed',
                            ...post,
                            department: JSON.stringify(post.department),
                            goodsids: arr.length ? JSON.stringify([arr[0].id]) : JSON.stringify([0]),
                            packingtype: JSON.stringify([data.data?.packingtype]),
                            type: data.data.type,
                            project: data.colDef.headerName,
                        })
                        if (data.colDef.headerName == '用户销售使用票据') {
                            // {
                            //     "id": "2665",
                            //     "addtime": "2023-07-11 14:26:02.240",
                            //     "mode": "押金",
                            //     "billno": "7587087654715531",
                            //     "packingtype": "[\"5加仑PC桶\"]",
                            //     "memberid": "2810289",
                            //     "name": "5加仑PC桶押金",
                            //     "price": "25.0000",
                            //     "num": "1",
                            //     "department": "新竹店",
                            //     "usetime": "2023-07-11 14:27:27.000",
                            //     "serial_use": "800220230711140329260258001",
                            //     "department_use": "新竹店",
                            //     "operator_use": "李婷媛"
                            // }
                            setcolumnDefs([
                                { headerName: '时间', field: 'addtime' },
                                { headerName: '模式', field: 'mode' },
                                { headerName: '票据号', field: 'billno' },
                                { headerName: '包装物类型', field: 'packingtype' },
                                { headerName: '会员号', field: 'memberid' },
                                { headerName: '商品', field: 'name' },
                                { headerName: '单价', field: 'price' },
                                { headerName: '数量', field: 'num' },
                                { headerName: '部门', field: 'department' },
                                { headerName: '使用时间', field: 'usetime' },
                                { headerName: '使用流水号', field: 'serial_use' },
                                { headerName: '使用部门', field: 'department_use' },
                                { headerName: '使用操作员', field: 'operator_use' },
                            ])

                        } else {
                            // {
                            //     "addtime": "2023-07-05 15:57:52.550",
                            //     "mode": "调拨",
                            //     "packingtype": "5加仑PC桶",
                            //     "type": "空",
                            //     "memberid": "",
                            //     "goodsname": "19L娃哈哈纯净水",
                            //     "num": "380",
                            //     "remarks": "100",
                            //     "grant_department": "新竹店",
                            //     "grantee": "李婷媛",
                            //     "handler": "李婷媛",
                            //     "department": "水厂",
                            //     "operator": ""
                            // }
                            setcolumnDefs([
                                { headerName: '时间', field: 'addtime' },
                                { headerName: '模式', field: 'mode' },
                                { headerName: '包装物类型', field: 'packingtype' },
                                { headerName: '类型', field: 'type' },
                                { headerName: '会员号', field: 'memberid' },
                                { headerName: '商品', field: 'goodsname' },
                                { headerName: '数量', field: 'num' },
                                { headerName: '备注', field: 'remarks' },
                                { headerName: '发放部门', field: 'grant_department' },
                                { headerName: '发放人', field: 'grantee' },
                                { headerName: '经手人', field: 'handler' },
                                { headerName: '部门', field: 'department' },
                                { headerName: '操作员', field: 'operator' },
                            ])
                        }


                        setopen(true)
                        setsublist(rew.data.info)
                    }}
                    defaultColDef={{
                        resizable: true,
                        // flex: 1,
                        sortable: true,
                    }}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </Box>


            <Modal open={open} onClose={() => setopen(false)}>
                <Box sx={{
                    ...style,
                    bgcolor: '#fff',
                    overflow: 'scroll',
                    height: '60vh',
                    width: '80vw',
                }}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={columnDefslist}
                        defaultColDef={{
                            flex: 1,
                            resizable: true,
                            sortable: true,
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default NoTraceTheSourceMaterialStockReport;
