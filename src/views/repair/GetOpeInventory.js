import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";

const GetOpeInventory = () => {
    const [list,setList] = React.useState([])
    const [key,setKeys] = React.useState([])
    const api = useRef()
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>维修配件员工库存</Box>
            <Form getFormApi={e=>api.current=e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetOpeInventory',
                    ...e
                })
                setList(rew.data)
                let keys = new Set();

                rew.data.forEach(item => {
                    Object.keys(item).forEach(key => {
                        keys.add(key);
                    });
                });

                let keysArray = Array.from(keys);

                setKeys(keysArray);
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>

                <Button sx={{ml:2}} onClick={async ()=>{
                    // let json = list.map(item=>{
                    //     return {
                    //         goodsname: item.goodsname,
                    //         costprice: item.costprice
                    //     }
                    // })
                    try {
                        const rew = await request('post','/api/getInfo',{
                            url: 'Srapp.Web_RepairParts_Handle.OpeGoodsInventoryBookkeeping',
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('记账成功')
                        } else {
                            toast.error('记账失败' + rew.data.tips)
                        }

                    } catch (e) {
                        // console.log('eeeee',e)
                        toast.error('记账失败请求频繁')
                    }

                }} size={'small'} variant={'contained'}>记账</Button>
            </Form>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={key.map(item=>({
                        headerName: item === 'counterparty' ? '服务人员' : item.replace('[begintstock]','[期初库存]').replace('[in]','[入库]').replace('[out]','[出库]').replace('[use]','[使用]').replace('[endstock]','[期末库存]'),
                            // {
                            //     "counterparty": "李东刚",
                            //     "镀锌管[begintstock]": 0,
                            //     "镀锌管[in]": "7.0000",
                            //     "镀锌管[out]": 0,
                            //     "镀锌管[use]": 0,
                            //     "镀锌管[endstock]": "7.0000",
                            //     "机械手[begintstock]": 0,
                            //     "机械手[in]": 0,
                            //     "机械手[out]": 0,
                            //     "机械手[use]": 0,
                            //     "机械手[endstock]": 0,
                            //     "胶管[begintstock]": 0,
                            //     "胶管[in]": 0,
                            //     "胶管[out]": 0,
                            //     "胶管[use]": 0,
                            //     "胶管[endstock]": 0
                            // }
                            // 将 [begintstock] 替换为 [期初库存]
                            // 将 [in] 替换为 [入库]
                            // 将 [out] 替换为 [出库]
                            // 将 [use] 替换为 [使用]
                            // 将 [endstock] 替换为 [期末库存]


                        field: item,
                    }))}

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

export default GetOpeInventory;
