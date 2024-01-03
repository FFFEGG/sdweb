import React, {useEffect} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetWanderAboutRecord = () => {
    const [list,setList] = React.useState([])
    const [page,setPage] = React.useState(1)
    const [pageInfo,setPageInfo] = React.useState({})
    const api = React.useRef()
    useEffect(()=>{
        api.current.submitForm()
    },[page])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>钢瓶流转信息</Box>
            <Form getFormApi={e=>api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_TraceabilityManagement_Infos.GetWanderAboutRecord',
                    ...e,
                    row: 1000,
                    page
                })
                // {
                //     "pageCount": 3,
                //     "pageNumber": 1,
                //     "records": 25219
                // }
                setList(rew.data)
                setPageInfo(rew.pageinfo)
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
                        // 当前位置	来源	二维码	钢瓶状态	交换类型	交换时间

                        // {
                        //     "position": "莫村店-李小松",
                        //     "source": "运输公司-梁朝凯",
                        //     "code": "1059052",
                        //     "type": "重",
                        //     "grant_mode": "员工交接",
                        //     "grant_time": "2023-10-20 16:08:24.000"
                        // }
                        {field: 'position', headerName: '当前位置'},
                        {field: 'source', headerName: '来源'},
                        {field: 'code', headerName: '二维码'},
                        {field: 'type', headerName: '钢瓶状态'},
                        {field: 'grant_mode', headerName: '交换类型'},
                        {field: 'grant_time', headerName: '交换时间'},

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
            {/*    显示分页 */}
            <Box mt={1} display={'flex'} justifyContent={'end'}>
                <Button disabled={page===1} onClick={e=>{
                    setPage(page-1)

                }   } variant={'outlined'}>上一页</Button>
                <Box mx={3} display={'flex'} alignItems={'center'}>{page}/{pageInfo.pageCount}</Box>
                <Button disabled={page===pageInfo.pageCount} onClick={e=>{
                    setPage(page+1)

                }   } variant={'outlined'}>下一页</Button>
            </Box>
        </Box>
    );
};

export default GetWanderAboutRecord;
