import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetSalesSummaryOfGoodsname = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>维修配件商品名称销售汇总</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetSalesSummaryOfGoodsname',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>

            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "department": "客服中心",
                        //     "goodsname": "0401 1216管",
                        //     "num": 8,
                        //     "total": 384,
                        //     "cost": 0
                        // }
                        {field: 'department', headerName: '部门'},
                        {field: 'goodsname', headerName: '商品名称'},
                        {field: 'num', headerName: '数量'},
                        {field: 'total', headerName: '总金额'},
                        {field: 'cost', headerName: '成本'},
                    ]}
                    defaultColDef={{

                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        resizable: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetSalesSummaryOfGoodsname;
