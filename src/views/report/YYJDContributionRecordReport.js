import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const YYJDContributionRecordReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = React.useState([])
    return (
        <Box borderRadius={1} p={3}>
            <Box fontSize={18} mb={3}>运营监督获取缴款记录信息</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Manage_Infos.YYJDContributionRecordReport',
                    ...e,
                    department: JSON.stringify(e.department)
                })
                setList(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始日期'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束日期'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Select label={'业务部门'} field={'department'} multiple filter maxTagCount={1} style={{width:200}}>
                    {
                        initData.DepartmentList.map((item,index)=>{
                            return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                        })
                    }
                </Form.Select>

                <Button variant="outlined" size={'small'} type={'submit'}>查询</Button>
            </Form>

            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "collectiondate": "2023-10-23",
                        //     "department": "爱华店",
                        //     "reporttotal": "1749.0000",
                        //     "entertotal": 0
                        // }
                        {field: 'collectiondate', headerName: '日期', width: 150},
                        {field: 'department', headerName: '业务部门', width: 150},
                        {field: 'reporttotal', headerName: '报表金额', width: 150},
                        {field: 'entertotal', headerName: '确认金额', width: 150},
                        {field: 'noentertotal', headerName: '未确认金额', width: 150},
                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                        floatingFilter: true,
                        filter: 'agTextColumnFilter',
                    }}

                />
            </Box>
        </Box>
    );
};

export default YYJDContributionRecordReport;
