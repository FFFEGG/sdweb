import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SignTransportRecordReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取签封方式调运记录报表</Typography>
            <Form onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Material_Infos.SignTransportRecordReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    handler: JSON.stringify(e.handler),
                })
                setList(rew.data)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200}}>
                    {

                        ( loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' ) ?

                            initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{ loginuser.login_department }</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Input field='begintime'  type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />
                <Form.Input field='endtime'  type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />

                <Form.Select field='handler' maxTagCount={1} multiple label="经手人" style={{ width: 200}}>
                    {
                        initData.OperatorList.map(item=><Form.Select.Option value={item.name}>{ item.name }</Form.Select.Option>)
                    }
                </Form.Select>

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName: '车号',field: 'car_no'},
                        {headerName: '部门',field: 'department'},
                        {headerName: '经手人',field: 'handler'},
                        {headerName: '出入',field: 'inorout'},
                        {headerName: '包装物',field: 'packingtype'},
                        {headerName: '数量',field: 'receive_num'},
                        {headerName: '类型',field: 'type'},
                        {headerName: '订单号',field: 'serial'},
                        {headerName: '主订单号',field: 'serial_main'},
                    ]}
                />
            </Box>
        </Box>
    );
};

export default SignTransportRecordReport;
