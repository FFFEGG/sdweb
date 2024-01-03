import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetFillRecord = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>充装记录</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_TraceabilityManagement_Infos.GetFillRecord',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'code'} label={'识别码'}/>
                <Button size={'small'} variant={'outlined'} type={'submit'}>搜索</Button>
            </Form>


            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "273807",
                        //     "filltime": "2023-10-19 08:15:20.000",
                        //     "packingtype": "YSP118型钢瓶",
                        //     "opeid": "1020",
                        //     "machine_code": "9",
                        //     "num": "1",
                        //     "code": "887397",
                        //     "endtime": "2023-10-19 08:18:55.000",
                        //     "beforeweight": "47.5",
                        //     "afterweight": "91",
                        //     "settingweight": "45",
                        //     "paperweight": "46"
                        // }
                        // {field: 'id', headerName: 'ID', width: 100},
                        {field: 'filltime', headerName: '充装日期', },
                        {field: 'packingtype', headerName: '钢瓶类型', },
                        {field: 'opeid', headerName: '充装员', },
                        {field: 'machine_code', headerName: '充装枪号', },
                        {field: 'num', headerName: '充装次数', },

                        // {field: 'endtime', headerName: '结束时间', },
                        {field: 'beforeweight', headerName: '充装前重量', },
                        {field: 'afterweight', headerName: '充装后重量', },
                        {field: 'settingweight', headerName: '设定重量', },
                        // {field: 'paperweight', headerName: '纸张重量', },
                        {field: 'code', headerName: '二维码', },

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        flex:1
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetFillRecord;
