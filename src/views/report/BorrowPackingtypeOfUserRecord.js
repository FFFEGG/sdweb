import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { set } from 'react-hook-form';
import { toast } from 'react-toastify';
import myprint from 'utils/myprint';

const BorrowPackingtypeOfUserRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [show, setShow] = useState(false)
    const [rowdata, setRowdata] = useState({})
    const [UserPackingtypeWarehouse, setUserPackingtypeWarehouse] = useState([])
    const api = useRef()
    const api2 = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取借用包装物记录(可还瓶)</Typography>
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.BorrowPackingtypeOfUserRecord',
                    ...e,
                    department: JSON.stringify([loginuser.login_department]),

                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">



                <Form.Input field='mmeberid' label="会员号" style={{ width: 200 }} />
                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "950855",
                        //     "serial": "800020230802102438938359149",
                        //     "addtime": "2023-08-02 10:24:33.837",
                        //     "userid": "576851",
                        //     "memberid": "18275788343",
                        //     "attributiondepartment": "液化气公司",
                        //     "salesman": "",
                        //     "department": "三津店",
                        //     "operator": "杨洁",
                        //     "name": "15KG借用",
                        //     "billno": "0604422226466104",
                        //     "packingtype": "[\"YSP35.5型钢瓶\",\"YSP28.6型钢瓶\"]",
                        //     "num": "1",
                        //     "department_use": "三津店",
                        //     "operator_use": "蓝勇智",
                        //     "type_use": "订单销售",
                        //     "usetime": "2023-08-02 10:40:36.000"
                        // }

                        { headerName: '订单号', field: 'serial', hide: true },
                        { headerName: '办理时间', field: 'addtime' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '备注', field: 'remarks' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '办理部门', field: 'department' },
                        { headerName: '办理人', field: 'operator' },
                        { headerName: '包装物名称', field: 'name' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '包装物数量', field: 'num' },

                        { headerName: '使用门店', field: 'department_use' },
                        { headerName: '使用操作人', field: 'operator_use' },
                        { headerName: '使用类型', field: 'type_use' },
                        { headerName: '使用时间', field: 'usetime' },
                        {
                            headerName: '操作', pinned: 'right', width: 100, cellRendererFramework: ({ data }) => <Button onClick={async () => {
                                setRowdata(data)
                                setShow(true)
                                // 查找用户抵押物信息
                                const rew = await request('post', '/api/getInfo', {
                                    "url": "Srapp.Web_User_Infos.UserPackingtypeWarehouse",
                                    "userid": data.userid,
                                    "begintime": "1991-01-01",
                                    "endtime": moment().format('YYYY-MM-DD'),
                                })
                                setUserPackingtypeWarehouse(rew.data)

                            }} size="small" >还瓶</Button>
                        },




                    ]}


                />
            </Box>
            <Modal size='large' title="详细信息" visible={show} onCancel={() => setShow(false)} footer={<></>}>
                <Box overflow="scroll" height="30vh">
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={UserPackingtypeWarehouse}
                        columnDefs={[
                            {
                                headerName: '用户抵押物信息', children: [
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
                                    { field: 'state', headerName: '状态', },
                                ]
                            },

                        ]}
                        onCellClicked={e => {
                            api2.current.setValue('code', e.data.billno)
                        }}

                    />
                </Box>
                <Form getFormApi={e => api2.current = e} onSubmit={async e => {
                    // userid	整型	必须			userid
                    // packingtypwarehouseid	整型	必须			包装物仓库ID
                    // packingtypwarehouseserial	字符串	必须			单据号
                    // type	枚举类型	必须		范围：票据/物品	状态（票据,物品）
                    // code	字符串	必须			票据号或者物资识别号
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserPackingtypeMaterial',
                        userid: rowdata.userid,
                        packingtypwarehouseid: rowdata.id,
                        packingtypwarehouseserial: rowdata.serial,
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('还瓶成功')
                        setShow(false)
                        api.current.submitForm()
                        if (rew.data.printinfo) {
                            myprint(rew.data.printinfo)
                        }
                    } else {
                        toast.error(`还瓶失败 ${rew.data.tips}`)
                    }
                }}>
                    <Form.Input field="name" label="包装物名称" initValue={rowdata.name} />
                    <Form.Select field='type' label="类型" initValue={'票据'} style={{ width: '100%' }}>
                        <Form.Select.Option value="票据">票据</Form.Select.Option>
                        <Form.Select.Option value="物品">钢物品</Form.Select.Option>
                    </Form.Select>
                    {/* 票据号或者物资识别号 */}
                    <Form.Input rules={[{ required: true }]} field="code" label="票据号或者物资识别号" />
                    <Button type='submit' variant="outlined" sx={{ mt: 2 }}>确认还瓶</Button>
                </Form>

            </Modal>

        </Box>
    );
};

export default BorrowPackingtypeOfUserRecord;
