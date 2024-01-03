import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";

const OutstandingOrdersReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>未完成订单报表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Manage_Infos.OutstandingOrdersReport',
                    department: JSON.stringify(e.department)
                })


            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200}}>
                    {

                        ( loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' ) ?

                            initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{ loginuser.login_department }</Form.Select.Option>
                    }

                </Form.Select>
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                />
            </Box>



        </Box>
    );
};

export default OutstandingOrdersReport;
