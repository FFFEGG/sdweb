import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";

const GetCostPrice = () => {
    const [list,setList] = React.useState([])
    const api = useRef()
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取维修配件成本</Box>
            <Form getFormApi={e=>api.current=e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetCostPrice',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
                <Button sx={{ml:2}} onClick={async ()=>{
                    let json = list.map(item=>{
                        return {
                            goodsname: item.goodsname,
                            costprice: item.costprice
                        }
                    })
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_RepairParts_Handle.DepartmentCostPriceBookkeeping',
                        data: JSON.stringify(json),
                        date: api.current.getValue('endtime')
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('记账成功')
                    } else {
                        toast.error('记账失败' + rew.data.tips)
                    }

                }} size={'small'} variant={'contained'}>记账</Button>
            </Form>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "department": "客服中心",
                        //     "goodsname": "自备铝塑管",
                        //     "stocktotal": 0,
                        //     "stocknum": 0,
                        //     "procuretotal": ".0000",
                        //     "procurenum": "1.0000",
                        //     "costprice": 0
                        // }
                        {field: 'department', headerName: '部门', flex: 1},
                        {field: 'goodsname', headerName: '商品名称', flex: 1},
                        {field: 'stocktotal', headerName: '库存总数', flex: 1},
                        {field: 'stocknum', headerName: '库存数量', flex: 1},
                        {field: 'procuretotal', headerName: '采购总数', flex: 1},
                        {field: 'procurenum', headerName: '采购数量', flex: 1},
                        {field: 'costprice', headerName: '成本价', flex: 1},
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

export default GetCostPrice;
