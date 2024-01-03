import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetFillAfterInspectRecord = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>充后检查</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_TraceabilityManagement_Infos.GetFillAfterInspectRecord',
                    ...e
                })
                rew.data.map(item=>{
                    try {
                        item.details = JSON.parse(item.details)
                        item.seal = item.details.密封检查 ?  '✓' : '✗'
                        item.temperature = item.details.瓶温检查 ?  '✓' : '✗'
                        item.body = item.details.瓶体检查 ?  '✓' : '✗'
                        item.label = item.details.警示标签 ?  '✓' : '✗'
                        item.paperweight = item.details.充装瓶重
                        item.settingweight = item.details.充装量
                        item.beforeweight = item.details.充前重量
                        item.afterweight = item.details.充后重量
                    } catch (e) {
                        item.details = []
                    }
                    return item
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
                        // 钢瓶编码	充前检查时间	检查人员
                        // 充装瓶重	充装量	充前重量	充后重量	密封检查	瓶温检查	瓶体检查	警示标签
                        // {
                        //     "code": "887397",
                        //     "time": "2023-10-19 08:19:08",
                        //     "opeid": "1020",
                        //     "paperweight": "46",
                        //     "settingweight": "45",
                        //     "beforeweight": "47.5",
                        //     "afterweight": "91"
                        // }
                        {field: 'code', headerName: '钢瓶编码'},
                        {field: 'addtime', headerName: '充后检查时间'},
                        {field: 'operator', headerName: '检查人员'},
                        {field: 'paperweight', headerName: '充装瓶重'},
                        {field: 'settingweight', headerName: '充装量'},
                        {field: 'beforeweight', headerName: '充前重量',hide: true},
                        {field: 'afterweight', headerName: '充后重量'},
                        {field: 'seal', headerName: '密封检查'},
                        {field: 'temperature', headerName: '瓶温检查'},
                        {field: 'body', headerName: '瓶体检查'},
                        {field: 'label', headerName: '警示标签'},




                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    onFirstDataRendered={(params) => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetFillAfterInspectRecord;
