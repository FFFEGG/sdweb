import React, { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import translutions from "../../utils/translations.json";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import printJS from 'print-js';
const TraceTheSourceMaterialStockReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [billlist, setbillList] = useState([])
    const [amount, setamount] = useState([])
    const [open, setopen] = useState(false)
    const [billopen, setbillopen] = useState(false)
    const api = useRef();




    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取溯源类包装物库存报表</Typography>
            <Form getFormApi={formApi => api.current = formApi} onChange={e => {
                setList([])
                setamount([])
            }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.TraceTheSourceMaterialStockReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    packingtype: JSON.stringify(e.packingtype),
                })


                const list_arr = rew.data.info
                setamount(rew.data.amount)

                // 结果数组按照类型type排序 值等于‘重’的排在前面
                const arr = list_arr.sort((a, b) => {
                    if (a.type == '重') {
                        return -1
                    } else {
                        return 1
                    }
                })

                setList(arr)




                // setList(arr)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                {/*<Form.Select field='packingtype' maxTagCount={1} multiple label="包装物" style={{ width: 200}}>*/}
                {/*    {*/}
                {/*        initData.PackingtypeList.map(item=><Form.Select.Option value={item.name}>{ item.name }</Form.Select.Option>)*/}
                {/*    }*/}

                {/*</Form.Select>*/}

                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />





                <Button sx={{ mr: 1 }} type="submit" variant="outlined" size="small">搜索</Button>

                <Button onClick={async () => {
                    const formdata = api.current.getValues();
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.TraceTheSourceMaterialStockBookkeeping',
                        begintime: formdata.begintime,
                        endtime: formdata.endtime,
                        datajson: JSON.stringify(list)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('记账成功')
                    } else {
                        toast.error('记账失败' + rew.data.tips)
                    }

                }} sx={{ mr: 1 }} variant="outlined" size="small">记账</Button>
                <Button onClick={async () => {
                    const formdata = api.current.getValues();
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.CancelTraceTheSourceMaterialStockBookkeeping',
                        begintime: formdata.begintime,
                        endtime: formdata.endtime
                    })
                    if (rew.code === 200) {

                        toast.success('删除记账成功')
                    } else {
                        toast.error('删除记账失败')
                    }


                }} sx={{ mr: 1 }} variant="outlined" size="small">删除记账</Button>



                <Button sx={{ mr: 1 }} type="button" onClick={() => {

                    printJS({
                        printable: amount,
                        properties: [
                            { field: 'packingtype', displayName: '包装物类型' },
                            { field: 'type', displayName: '类型' },
                            { field: 'beginstocknum', displayName: '库存期初' },

                            { field: 'TransferInOfGPGL', displayName: '钢瓶管理部' },
                            { field: 'TransferInOfOther', displayName: '其它方式调入' },
                            { field: 'TransferInOfTransportationCompany', displayName: '运输公司调入' },
                            { field: 'TransferInOfOurStore', displayName: '本店调入' },
                            { field: 'TransferInOfUserReturnSpace', displayName: '用户回空调入' },
                            { field: 'TransferInOfUserBringIn', displayName: '用户带入调入' },
                            { field: 'TransferInOfBuy', displayName: '收购调入' },
                            { field: 'TransferInOfUserTemporaryStorage', displayName: '用户暂存调入' },
                            { field: 'TransferInOfUserOther', displayName: '用户其它调入' },
                            { field: 'TransferInOfUserReturnedMaterials', displayName: '用户退空调入' },

                            { field: 'TransferOutOfGPGL', displayName: '钢瓶管理部' },
                            { field: 'TransferOutOfOther', displayName: '其它方式调出' },
                            { field: 'TransferOutOfTransportationCompany', displayName: '运输公司调出' },
                            { field: 'TransferOutOfOurStore', displayName: '本店调出' },
                            { field: 'SalesUseBillsOfUser', displayName: '销售使用票据' },
                            { field: 'TransferOutOfUser', displayName: '用户销售调出' },
                            { field: 'endstocknum', displayName: '期末' },
                            // { field: 'nature', displayName: '性质' },

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
                }} variant="outlined" size="small">导出</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    // getRowStyle={params => {
                    //     console.log('params', params)
                    //     if (params.data.packingtype == '12+15') {
                    //         return { background: "blue" }
                    //     }
                    //     // if (params.data && params.data.state === '已使用') {
                    //     //     return { color: "red" }
                    //     // }
                    //     // if (params.data && params.data.state === '已退款') {
                    //     //     return { color: "blue" }
                    //     // }

                    //     // if (params.data && params.data.tate === '已接单') {
                    //     //     return { color: "green" }
                    //     // }


                    //     // if (params.data && params.data.tate === '取消') {
                    //     //     return { color: "pink" }
                    //     // }
                    //     return { color: "black" }
                    // }}
                    localeText={translutions}
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={[
                        { headerName: '包装物类型', field: 'packingtype', width: 200,pinned: 'left' },
                        { headerName: '类型 ', field: 'type', width: 200 },
                        { headerName: '库存期初 ', field: 'beginstocknum', width: 200 },
                        {
                            headerName: '调入',
                            children: [
                                { headerName: '钢瓶管理部', index: '钢瓶管理调入', field: 'TransferInOfGPGL', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '非钢瓶管理部门调入', index: '其它方式调入(非钢瓶管理部门调入)', field: 'TransferInOfOther', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '运输公司调入', index: '运输公司调入', field: 'TransferInOfTransportationCompany', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '本店调入', index: '本店调入', field: 'TransferInOfOurStore', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },

                                { headerName: '用户回空调入', index: '用户回空调入', field: 'TransferInOfUserReturnSpace', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户带瓶', index: '用户带入调入', field: 'TransferInOfUserBringIn', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '收购调入', index: '收购调入', field: 'TransferInOfBuy', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户暂存调入', index: '用户暂存调入', field: 'TransferInOfUserTemporaryStorage', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户其它', index: '用户其它调入', field: 'TransferInOfUserOther', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 },
                                { headerName: '用户退物资', index: '用户退空调入', field: 'TransferInOfUserReturnedMaterials', cellStyle: { color: 'black', 'background-color': '#FFB4B4' }, width: 200 }
                            ],
                        },

                        {
                            headerName: '调出',
                            children: [
                                { headerName: '钢瓶管理部', index: '钢瓶管理调出', field: 'TransferOutOfGPGL', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '其它', index: '其它方式调出(非钢瓶管理部门调出)', field: 'TransferOutOfOther', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '运输公司调出', index: '运输公司调出', field: 'TransferOutOfTransportationCompany', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                                { headerName: '本店调出', index: '本店调出', field: 'TransferOutOfOurStore', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },

                                { headerName: '用户销售调出', index: '用户销售调出', field: 'TransferOutOfUser', cellStyle: { color: 'black', 'background-color': '#B2A4FF' }, width: 200 },
                            ]
                        },

                        { headerName: '销售使用票据', index: '销售使用票据', field: 'SalesUseBillsOfUser', width: 200 },
                        { headerName: '期末', field: 'endstocknum', width: 200 },
                        { headerName: '性质', field: 'nature', width: 200 },

                    ]}
                    onCellDoubleClicked={async (data) => {
                        console.log(data);
                        const post = api.current.getValues()
                        // console.log('post', post);
                        // if (data.column.instanceId <= 2 || data.column.instanceId >= 13) {
                        //     return
                        // }
                        // const arr = initData.GoodsList.filter(item=>item.name === data.data.goodsname)
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Material_Infos.TraceTheSourceMaterialStockReportDetailed',
                            ...post,
                            department: JSON.stringify(post.department),
                            nature: data.data.nature,
                            packingtype: data.data.packingtype,
                            type: data.data.type,
                            project: data.colDef.index,
                        })
                        console.log(rew);
                        if (data.colDef.index !== '销售使用票据') {
                            setsubList(rew.data.info)
                            setopen(true)
                        } else {
                            setbillList(rew.data.info)
                            setbillopen(true)
                        }

                        // setsublist(rew.data)
                    }}
                    defaultColDef={{
                        resizable: true
                    }}

                />
                <Modal siez="large" title="物资详情" visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ width: '70vw' }}>
                    <Box height={'60vh'} overflow={"scroll"}>

                        <AgGridReact
                            className='ag-theme-balham'
                            rowData={sublist}
                            localeText={translutions}
                            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                            columnDefs={[
                                { headerName: '库存人', field: 'stockmen' },
                                { headerName: '性质', field: 'nature' },
                                { headerName: '包装物类型', field: 'packingtype' },
                                { headerName: '追溯码', field: 'code' },
                                { headerName: '重', field: 'type' },
                                { headerName: '数量', field: 'num' },
                                { headerName: '入库方式', field: 'grant_mode' },
                                { headerName: '发放部门', field: 'grant_department' },
                                { headerName: '原库存人', field: 'grantee' },
                                { headerName: '交易时间', field: 'grant_time' },
                                { headerName: '交易备注', field: 'grant_remarks' },
                                { headerName: '发出方式', field: 'receive_mode' },
                                { headerName: '接收部门', field: 'receive_department' },
                                { headerName: '接收人', field: 'receiver' },
                                { headerName: '接收时间', field: 'receive_time' },
                                { headerName: '接收备注', field: 'receive_remarks' }
                            ]}
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: 'agTextColumnFilter',
                                floatingFilter: true,
                            }}
                        />
                    </Box>
                </Modal>

                <Modal siez="large" visible={billopen} onCancel={() => setbillopen(false)} footer={<></>} style={{ width: '70vw' }}>
                    <Box height={'60vh'} overflow={"scroll"}>

                        <AgGridReact
                            className='ag-theme-balham'
                            rowData={billlist}
                            localeText={translutions}
                            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                            columnDefs={[
                                { headerName: '办理时间', field: 'addtime' },
                                { headerName: '票据类型', field: 'mode' },
                                { headerName: '票据号', field: 'billno' },
                                { headerName: '包装物', field: 'packingtype' },
                                { headerName: '会员号', field: 'memberid' },
                                { headerName: '票据名称', field: 'name' },
                                { headerName: '单价', field: 'price' },
                                { headerName: '数量', field: 'num' },
                                { headerName: '办理部门', field: 'department' },
                                { headerName: '使用时间', field: 'usetime' },
                                { headerName: '使用单据号', field: 'serial_use' },
                                { headerName: '使用部门', field: 'department_use' },
                                { headerName: '使用人', field: 'operator_use' }
                            ]}
                            defaultColDef={{
                                resizable: true
                            }}
                        />
                    </Box>
                </Modal>


            </Box>


            <Box overflow={'scroll'} mt={3}>
                <table className='my-table'>
                    <thead>
                        <tr>
                            <td colSpan={21}>合计</td>
                        </tr>
                        <tr>
                            <td>包装物类型</td>
                            <td>类型</td>
                            <td>库存期初</td>
                            <td>钢瓶管理部</td>
                            <td>其它方式调入</td>
                            <td>运输公司调入</td>
                            <td>本店调入</td>
                            <td>用户回空调入</td>
                            <td>用户带入调入</td>
                            <td>收购调入</td>
                            <td>用户暂存调入</td>
                            <td>用户其它调入</td>
                            <td>用户退空调入</td>
                            <td>钢瓶管理部</td>
                            <td>其它方式调出</td>
                            <td>运输公司调出</td>
                            <td>本店调出</td>
                            <td>销售使用票据</td>
                            <td>用户销售调出</td>
                            <td>期末</td>
                            <td>性质</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            amount.sort(item => {
                                if (item.type == '重') {
                                    return -1
                                } else {
                                    return 1
                                }
                            }).map(item => <tr>
                                <td>{item.packingtype}</td>
                                <td>{item.type}</td>
                                <td>{item.beginstocknum}</td>
                                <td>{item.TransferInOfGPGL}</td>
                                <td>{item.TransferInOfOther}</td>
                                <td>{item.TransferInOfTransportationCompany}</td>
                                <td>{item.TransferInOfOurStore}</td>
                                <td>{item.TransferInOfUserReturnSpace}</td>
                                <td>{item.TransferInOfUserBringIn}</td>
                                <td>{item.TransferInOfBuy}</td>
                                <td>{item.TransferInOfUserTemporaryStorage}</td>
                                <td>{item.TransferInOfUserOther}</td>
                                <td>{item.TransferInOfUserReturnedMaterials}</td>
                                <td>{item.TransferOutOfGPGL}</td>
                                <td>{item.TransferOutOfOther}</td>
                                <td>{item.TransferOutOfTransportationCompany}</td>
                                <td>{item.TransferOutOfOurStore}</td>
                                <td>{item.SalesUseBillsOfUser}</td>
                                <td>{item.TransferOutOfUser}</td>
                                <td>{item.endstocknum}</td>
                                <td>{item.nature}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default TraceTheSourceMaterialStockReport;
