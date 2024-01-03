import React from 'react';
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {AgGridReact} from "ag-grid-react";

const GetInvoiceKpr = () => {
    const [list, setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取发票开票人</Box>

            <Button variant={'outlined'} sx={{mr:2}} onClick={async ()=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Other_Infos.GetInvoiceKpr'
                })
                setList([rew.data])
            }}>获取</Button>
            <Button variant={'outlined'} onClick={async ()=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Other_Handle.SettingInvoiceKpr'
                })
                console.log(rew);
                if (rew.data.msg == 'SUCCESS') {
                    toast.success('设置成功')
                } else {
                    toast.error('设置失败' + rew.data.tips)
                }

            }}>设置</Button>
            <Box height={'60vh'} overflow={'auto'} mt={2}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "kpr": "胡东CD",
                        //     "dlzh": "17677153715",
                        //     "updatetime": "2023-10-20 11:20:12"
                        // }
                        {field: 'kpr', headerName: '开票人', flex: 1},
                        {field: 'dlzh', headerName: '登录账号', flex: 1},
                        {field: 'updatetime', headerName: '更新时间', flex: 1},
                    ]}
                    defaultColDef={{
                        flex: 1,
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

export default GetInvoiceKpr;
