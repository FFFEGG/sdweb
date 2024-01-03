import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";

const GetDepartmentInventory = () => {
    const [list,setList] = React.useState([])
    const [key,setKeys] = React.useState([])
    const api = useRef()
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>维修配件部门库存</Box>
            <Form getFormApi={e=>api.current=e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_RepairParts_Infos.GetDepartmentInventory',
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
                            url: 'Srapp.Web_RepairParts_Handle.DepartmentGoodsInventoryBookkeeping',
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
                    columnDefs={
                        key.map(item=>({

                                // {
                                //     "department": "客服中心",
                                //     "镀锌管[begintstock]": 0,
                                //     "镀锌管[procurein]": 0,
                                //     "镀锌管[departmentout]": 0,
                                //     "镀锌管[departmentreturn]": 0,
                                //     "镀锌管[userbuy]": 0,
                                //     "镀锌管[opeout]": "7.0000",
                                //     "镀锌管[opein]": 0,
                                //     "镀锌管[opestock]": 7,
                                //     "镀锌管[endstock]": -7,
                                //     "机械手[begintstock]": 0,
                                //     "机械手[procurein]": 0,
                                //     "机械手[departmentout]": 0,
                                //     "机械手[departmentreturn]": 0,
                                //     "机械手[userbuy]": 0,
                                //     "机械手[opeout]": 0,
                                //     "机械手[opein]": 5,
                                //     "机械手[opestock]": -8,
                                //     "机械手[endstock]": 5,
                                //     "胶管[begintstock]": 0,
                                //     "胶管[procurein]": 0,
                                //     "胶管[departmentout]": 0,
                                //     "胶管[departmentreturn]": 0,
                                //     "胶管[userbuy]": 0,
                                //     "胶管[opeout]": 0,
                                //     "胶管[opein]": 12,
                                //     "胶管[opestock]": -28.5,
                                //     "胶管[endstock]": 12
                                // }

                            headerName: item === 'department' ? '部门' : item.replace('[begintstock]','[期初库存]').replace('[procurein]','[采购入库]').replace('[departmentout]','[部门出库]').replace('[departmentreturn]','[部门退回]').replace('[userbuy]','[用户购买]').replace('[opeout]','[员工出库]').replace('[opein]','[员工入库]').replace('[opestock]','[员工库存]').replace('[endstock]','[期末库存]'),
                            field: item,
                            flex: 1
                        }))
                    }
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

export default GetDepartmentInventory;
