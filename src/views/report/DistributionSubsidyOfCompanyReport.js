import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const DistributionSubsidyOfCompanyReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取公司补贴运费报表</Typography>
            <Form onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Finance_Infos.DistributionSubsidyOfCompanyReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select field='department' maxTagCount={1} multiple filter  label="配送部门" style={{ width: 200}}>
                    {
                        initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='attributiondepartment' maxTagCount={1} filter multiple label="用户归属部门" style={{ width: 200}}>
                    {
                        initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Input field='begintime'  type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />
                <Form.Input field='endtime'  type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200}} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName: '商品',field: 'goodsname'},
                        {headerName: '数量',field: 'num'},
                        {headerName: '金额',field: 'total'},
                        {headerName: '类型',field: 'type'},
                        {headerName: '部门',field: 'department'},
                        {headerName: '业务员',field: 'deliveryman'},
                    ]}
                />
            </Box>
        </Box>
    );
};

export default DistributionSubsidyOfCompanyReport;
