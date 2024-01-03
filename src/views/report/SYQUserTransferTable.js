import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const SYQUserTransferTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户移交记录</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQUserTransferTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>
                <Form.Input field={'memberid'} label={'会员号'} />


                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "accountopeningtime": "2023-03-02 15:29:01.137",
                        //     "transfertime": "2023-06-01 16:27:15.000",
                        //     "userid": "37",
                        //     "memberid": "996633",
                        //     "workplace": "炒饭",
                        //     "address": "广西壮族自治区南宁市青秀区中山街道南国街3号",
                        //     "telephone": "13245678912",
                        //     "customertype": "商业用户",
                        //     "viplevel": "5",
                        //     "primary_attributiondepartment": "商用气维护部",
                        //     "primary_salesman": "测试业务员",
                        //     "attributiondepartment": "商用气维护部",
                        //     "salesman": "SY0012",
                        //     "remarks": "0",
                        //     "department": "商用气维护部",
                        //     "operator": "SY0011"
                        //   }
                        { field: 'accountopeningtime', headerName: '开户时间', width: 150 },
                        { field: 'transfertime', headerName: '移交时间', width: 150 },
                        { field: 'userid', headerName: '用户ID', width: 150 },
                        { field: 'memberid', headerName: '会员号', width: 150 },
                        { field: 'workplace', headerName: '工作单位', width: 150 },
                        { field: 'address', headerName: '地址', width: 150 },
                        { field: 'telephone', headerName: '电话', width: 150 },
                        { field: 'customertype', headerName: '客户类型', width: 150 },
                        { field: 'viplevel', headerName: 'VIP等级', width: 150 },
                        { field: 'primary_attributiondepartment', headerName: '原归属部门', width: 150 },
                        { field: 'primary_salesman', headerName: '原业务员', width: 150 },
                        { field: 'attributiondepartment', headerName: '归属部门', width: 150 },
                        { field: 'salesman', headerName: '业务员', width: 150 },
                        { field: 'remarks', headerName: '备注', width: 150 },
                        { field: 'department', headerName: '部门', width: 150 },
                        { field: 'operator', headerName: '操作员', width: 150 },

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true

                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default SYQUserTransferTable;


