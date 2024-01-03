import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetFillBeforeInspectRecord = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>充前检查</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_TraceabilityManagement_Infos.GetFillBeforeInspectRecord',
                    ...e
                })

                rew.data.map(item=>{
                    try {
                        item.details = JSON.parse(item.details)
                        item.doubt = item.details.可疑气瓶 ?  '✗' : '✓'
                        item.cover = item.details.护罩损坏 ?  '✗' : '✓'
                        item.base = item.details.底座损坏 ?  '✗' : '✓'
                        item.valve = item.details.瓶阀损坏 ?  '✗' : '✓'
                        item.bodycrack = item.details.瓶体裂纹 ?  '✗' : '✓'
                        item.bodyweld = item.details.瓶体焊疤 ?  '✗' : '✓'
                        item.bodydeform = item.details.瓶体变形 ?  '✗' : '✓'
                        item.color = item.details.颜色不符 ?  '✗' : '✓'
                        item.number = item.details.瓶号不符 ?  '✗' : '✓'
                        item.medium = item.details.介质不符 ?  '✗' : '✓'
                        item.bodycorrosion = item.details.瓶体腐蚀 ?  '✗' : '✓'
                        item.grease = item.details.油脂污损 ?  '✗' : '✓'
                        item.bodyburn = item.details.瓶体火烧 ?  '✗' : '✓'
                        item.appearance = item.details.外观凹坑 ?  '✗' : '✓'
                        item.valvedefect = item.details.阀体缺损 ?  '✗' : '✓'
                        item.pnyy = item.details.瓶内余压 ?  '✗' : '✓'
                        // 瓶内余压

                    } catch (e) {
                        item.details = []
                    }


                    
                    return item
                })
                console.log(rew.data)
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
                        // 可疑气瓶	护罩损坏	底座损坏	瓶阀损坏	瓶体裂纹	瓶体焊疤	瓶体变形	颜色不符	瓶号不符	介质不符	瓶体腐蚀	油脂污损	瓶体火烧	外观凹坑	阀体缺损

                        {field: 'code', headerName: '钢瓶编码'},
                        {field: 'addtime', headerName: '充前检查时间'},
                        {field: 'operator', headerName: '检查人员'},
                        {field: 'doubt', headerName: '可疑气瓶'},
                        {field: 'pnyy', headerName: '瓶内余压'},
                        {field: 'cover', headerName: '护罩损坏'},
                        {field: 'base', headerName: '底座损坏'},
                        {field: 'valve', headerName: '瓶阀损坏'},
                        {field: 'bodycrack', headerName: '瓶体裂纹'},
                        {field: 'bodyweld', headerName: '瓶体焊疤'},
                        {field: 'bodydeform', headerName: '瓶体变形'},
                        {field: 'color', headerName: '颜色不符'},
                        {field: 'number', headerName: '瓶号不符'},
                        {field: 'medium', headerName: '介质不符'},
                        {field: 'bodycorrosion', headerName: '瓶体腐蚀'},
                        {field: 'grease', headerName: '油脂污损'},
                        {field: 'bodyburn', headerName: '瓶体火烧'},
                        {field: 'appearance', headerName: '外观凹坑'},
                        {field: 'valvedefect', headerName: '阀体缺损'},
                        {field: 'detectionresult',headerName: '结论'},


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

export default GetFillBeforeInspectRecord;
