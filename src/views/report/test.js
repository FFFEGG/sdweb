import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const OverdueSalesArrearsRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>超期销售欠款记录</Typography>
            <Form onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Material_Infos.OverdueSalesArrearsRecord',
                    ...e,
                    department: JSON.stringify(e.department),
                })
                setList(rew.data)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select field='department' maxTagCount={1} multiple label="配送部门" filter style={{ width: 200}}>
                    {
                        initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='type'  label="属性" style={{ width: 200}}>
                    <Form.Select.Option value="全部">全部</Form.Select.Option>
                    <Form.Select.Option value="已回款">已回款</Form.Select.Option>
                    <Form.Select.Option value="未回款">未回款</Form.Select.Option>
                </Form.Select>

                <Form.Input field='date'  type="date" label="时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />
                <Form.Input field='days'  type="number" label="天数" style={{ width: 200}} />


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

export default OverdueSalesArrearsRecord;
