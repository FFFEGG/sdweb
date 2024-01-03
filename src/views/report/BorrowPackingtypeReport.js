import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import printJS from "print-js";

const BorrowPackingtypeReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [show, setShow] = useState(false)
    const api = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取借用包装物报表</Typography>
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.BorrowPackingtypeReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select filter field='department' maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department.includes('商用')) ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='attributiondepartment' maxTagCount={1} filter multiple label="归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='salesman' maxTagCount={1} filter multiple label="业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
                <Button type="button" sx={{ml:2}}
                        onClick={()=>{
                            printJS({
                                printable: list,
                                properties: [
                                    { field: 'packingtype', displayName: '包装物类型' },
                                    { field: 'beforetimeuse', displayName: '期间前使用' },
                                    { field: 'currenttimeuse', displayName: '期间使用' },
                                    { field: 'currenttimeretreat', displayName: '期间退物资' },
                                    { field: 'surplus', displayName: '期末数量' },
                                ],
                                type: 'json'
                            })

                        }}

                        variant="contained" size="small">导出</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "packingtype": "[\"5加仑PC桶\"]",
                        //     "beforetimeuse": 0,
                        //     "currenttimeuse": 1,
                        //     "currenttimeretreat": 0,
                        //     "surplus": 1
                        // }

                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '期间前使用', field: 'beforetimeuse' },
                        { headerName: '期间使用', field: 'currenttimeuse' },
                        { headerName: '期间退物资', field: 'currenttimeretreat' },
                        { headerName: '期末数量', field: 'surplus' },




                    ]}

                    onCellDoubleClicked={async e => {
                        console.log(e)
                        const { data, colDef, value } = e
                        // console.log(colDef.headerName, data)
                        if (colDef.headerName !== '包装物类型' && value !== 0) {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_Report_Material_Infos.BorrowPackingtypeReportDetailed',
                                // department	字符串	可选			办理部门(不传默认全部) JSON ["二区店","二桥店"]
                                // attributiondepartment	字符串	可选			归属部门(不传默认全部) JSON ["二区店","二桥店"]
                                // salesman	字符串	可选			业务员(不传默认全部) JSON ["张三","李四"]
                                // begintime	日期	必须			起始时间
                                // endtime	日期	必须			结束时间
                                // project	枚举类型	必须		范围：期间前使用/期间使用/期间退物资	项目
                                // packingtype	字符串	必须			包装物名称 YSP118型钢瓶,18.6L水桶
                                department: JSON.stringify(api.current.getValue('department')),
                                attributiondepartment: JSON.stringify(api.current.getValue('attributiondepartment')),
                                salesman: JSON.stringify(api.current.getValue('salesman')),
                                begintime: api.current.getValue('begintime'),
                                endtime: api.current.getValue('endtime'),
                                project: colDef.headerName,
                                packingtype: data.packingtype,
                            })
                            console.log(rew.data)
                            setsubList(rew.data.info)
                            setShow(true)
                        }

                    }}
                />
            </Box>
            <Modal size='large' title="详细信息" visible={show} onCancel={() => setShow(false)} footer={<></>}>
                <Box overflow="scroll" height="60vh">
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={[

                            { headerName: '订单号', field: 'billno' },
                            { headerName: '订单时间', field: 'addtime' },
                            { headerName: '订单类型', field: 'mode' },
                            { headerName: '状态', field: 'state' },
                            { headerName: '包装物类型', field: 'packingtype' },
                            { headerName: '包装物名称', field: 'name' },
                            { headerName: '包装物数量', field: 'num' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '归属部门', field: 'attributiondepartment' },
                            { headerName: '业务员', field: 'salesman' },
                            { headerName: '办理部门', field: 'department' },
                            { headerName: '办理人', field: 'operator' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '退物类型', field: 'retreat_type' },
                            { headerName: '退物时间', field: 'retreat_time' },
                            { headerName: '退物门店', field: 'retreat_department' },
                            { headerName: '退物操作人', field: 'retreat_ope' },
                            { headerName: '退款时间', field: 'refund_time' },
                            { headerName: '退款门店', field: 'refund_department' },
                            { headerName: '退款操作人', field: 'refund_ope' },
                            { headerName: '退款备注', field: 'refund_remarks' },

                        ]}
                    />
                </Box>

            </Modal>

        </Box>
    );
};

export default BorrowPackingtypeReport;
