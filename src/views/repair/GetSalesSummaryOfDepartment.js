import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetSalesSummaryOfDepartment = () => {
        const initData = JSON.parse(localStorage.getItem('initData'))
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取维修配件部门销售汇总</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetSalesSummaryOfDepartment',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select field={'department'} label={'部门'} style={{width:200}} filter>
                    {
                        initData?.DepartmentList?.map((item,index)=><Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select>
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetSalesSummaryOfDepartment;
