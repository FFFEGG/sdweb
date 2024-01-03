import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const OtherServicesReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>其它服务报表</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.OtherServicesReport',
                    ...e,
                    servicepersonal: JSON.stringify(e.servicepersonal),
                    department: JSON.stringify(e.department),
                    booking_department: JSON.stringify(e.booking_department),
                    booking_operator: JSON.stringify(e.booking_operator),
                    servicetype: JSON.stringify(e.servicetype),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                <Form.Select filter initValue={initData.OperatorList.map(item => item.name)} field='servicepersonal' maxTagCount={1} multiple label="服务人员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>


                <Form.Select field='servicetype' maxTagCount={1} multiple label="服务类型" style={{ width: 200 }}>
                    {
                        initData.ServiceTypeList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='booking_department' maxTagCount={1} multiple label="预约部门" filter style={{ width: 200 }}>
                    {
                        initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select>

                <Form.Select field='booking_operator' maxTagCount={1} multiple label="	预约人" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '业务员', field: 'deliveryman' },
                        { headerName: '1', field: '1' },
                        { headerName: '4', field: '4' },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default OtherServicesReport;
