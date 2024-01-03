import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SustainSalesStatisticsDetailed = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = useState([])

    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>归属部门\业务员维系用户销售统计-明细</Typography>
            <Form onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Business_Infos.SustainSalesStatisticsDetailed',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department),
                    salesman: JSON.stringify(e.salesman),

                })



            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200}}>
                    {

                        ( loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' ) ?

                            initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{ loginuser.login_department }</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Select field='attributiondepartment' maxTagCount={1} multiple filter label="用户归属部门" style={{ width: 200}}>
                    {
                        initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                    }

                </Form.Select>
               <Form.Select field='salesman' maxTagCount={1} multiple label="维护业务员" style={{ width: 200}}>
                    {
                        initData.OperatorList.map(item=><Form.Select.Option value={item.name}>{ item.name }</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Input field='begintime'  type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />
                <Form.Input field='endtime'  type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />

                <Form.Select field='goodsname' label="商品" style={{ width: 200}}>
                    {
                        initData.GoodsList.filter(item=>item.canuse === true).map(item=><Form.Select.Option value={item.name}>{ item.name }</Form.Select.Option>)
                    }
                </Form.Select>


                 <Form.Select field='settlementmethod'  label="欠款方式" style={{ width: 200}}>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
                    <Form.Select.Option value="欠款">欠款</Form.Select.Option>
                </Form.Select>
                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName: '商品',field: 'goodsname'},
                        {headerName: '部门',field: 'department'},
                        {headerName: '业务员',field: 'deliveryman'},
                    ]}
                />
            </Box>
        </Box>
    );
};

export default SustainSalesStatisticsDetailed;
