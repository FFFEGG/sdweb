import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const PSBDepartmentUserSalesInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
    const [list, setList] = React.useState([])
    const api = useRef()
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>配送部 门店用户交易情况</Box>

            <Form getFormApi={e => api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.PSBDepartmentUserSalesInfo',
                    ...e,
                    department: JSON.stringify(e.department)
                })
                setList(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.TreeSelect leafOnly filterTreeNode treeData={new_department_byname} style={{width: 150}}
                                 field={'department'} label={'业务部门'} multiple filter maxTagCount={1}/>
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    rowData={list.list1}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        // {
                        //     "department": "安吉店",
                        //     "memberid": "13597341795",
                        //     "address": "安吉气店对面修车铺",
                        //     "num": "1.0",
                        //     "accountopeningtime": "2022-06-07 11:30:48.830"
                        // }
                        // 门店	卡号	地址	换水数量	"开户时间
                        // （第一次换水时间）"
                        {
                            headerName: '门店饮用水用户换水明细', children: [
                                {field: 'department', headerName: '门店', flex: 1},
                                {field: 'memberid', headerName: '卡号', flex: 1},
                                {field: 'address', headerName: '地址', flex: 1},
                                {field: '桶装水', headerName: '桶装水', flex: 1},
                                {field: '支装水', headerName: '支装水', flex: 1},

                                {field: 'accountopeningtime', headerName: '开户时间（第一次换水时间）', flex: 1},
                            ]
                        },

                    ]}

                />
            </Box>


            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    rowData={list.list2}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        // {
                        //     "10": 1,
                        //     "memberid": "002893",
                        //     "department": "总公司店",
                        //     "accountopeningtime": "1999-04-26 00:00:00.000"
                        // }
                        // 卡号	门店	6月份换水数量	开户时间
                        {
                            headerName: '门店饮用水用户换水明细', children: [
                                {field: 'memberid', headerName: '卡号', flex: 1},
                                {field: 'department', headerName: '门店', flex: 1},
                                {
                                    field: `${api.current?.getValue('begintime')?.split('-')[1]}[tzsnum]`,
                                    headerName: api.current?.getValue('begintime')?.split('-')[1] + '桶装水数量',
                                    flex: 1
                                },
                                {
                                    field: `${api.current?.getValue('begintime')?.split('-')[1]}[zzsnum]`,
                                    headerName: api.current?.getValue('begintime')?.split('-')[1] + '支装水数量',
                                    flex: 1
                                },
                                {field: 'accountopeningtime', headerName: '开户时间', flex: 1},
                            ]
                        },

                    ]}

                />
            </Box>
        </Box>
    );
};

export default PSBDepartmentUserSalesInfo;
