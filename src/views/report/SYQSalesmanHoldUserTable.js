import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";

const SYQSalesmanHoldUserTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>业务员名下用户查询表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQSalesmanHoldUserTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>


                <Form.Input field={'memberid'} label={'会员号'} />
                <Form.Input field={'workplace'} label={'工作单位'} />
                <Form.Input field={'viplevel'} label={'星级'} />
                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} filter multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>



                <Form.Select label={'用户类型'} field={'customertypeid'} >
                    {
                        initData.CustomertypeList.map(item =>
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>



                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '电话', field: 'telephone' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '地址', field: 'completeaddress' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '星级', field: 'viplevel' },
                        { headerName: '住所类型', field: 'housingproperty' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
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

export default SYQSalesmanHoldUserTable;
