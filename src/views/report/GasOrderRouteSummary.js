import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GasOrderRouteSummary = () => {
    const [list, setList] = useState([])
    const [list1, setList1] = useState([])
    const [list2, setList2] = useState([])
    const [list3, setList3] = useState([])
    return (
        <Box p={3}>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.GasOrderRouteSummary',
                    ...e
                })
                console.log(rew)
                let arr1 = []
                let arr2 = []
                let arr3 = []
                let arr4 = {}
                rew.data.info.map(item => {
                    if (item.project == '家庭用户') {
                        arr1.push(item)
                    }
                    if (item.project == '商业用户') {
                        arr2.push(item)
                    }
                    if (item.project == '零售商业') {
                        arr3.push(item)
                    }
                    if (arr4[item.date]) {
                        arr4[item.date].wechat += item.wechat
                        arr4[item.date].cti += item.cti
                        arr4[item.date].appointmentcenter += item.appointmentcenter
                        arr4[item.date].department += item.department
                        arr4[item.date].total += item.total

                    } else {
                        arr4[item.date] = {
                            date: item.date,
                            wechat: item.wechat,
                            cti: item.cti,
                            appointmentcenter: item.appointmentcenter,
                            department: item.department,
                            total: item.total
                        }

                    }
                })
                setList1(arr1)
                setList2(arr2)
                setList3(arr3)
                setList(Object.values(arr4))

            }}>
                <Form.Input field={'begintime'} type={'date'} label={'起始时间'} initValue={moment().format('YYYY-MM-01')}/>
                <Form.Input field={'endtime'} type={'date'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')}/>
                <Button variant="contained" size={'small'} color="primary" type="submit">查询</Button>
            </Form>

            <Box height={'40vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    rowData={list1}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        {headerName: '家庭用户', children:[
                                {field: 'date', headerName: '日期', flex: 1},
                                {field: 'wechat', headerName: '微信下单量', flex: 1},
                                {field: 'cti', headerName: '电话自助下单量', flex: 1},
                                {field: 'appointmentcenter', headerName: '预约中心', flex: 1},
                                {field: 'department', headerName: '门店人工', flex: 1},
                                {field: 'total', headerName: '小计', flex: 1},
                            ]
                        },

                    ]}
                />
            </Box>
            <Box height={'40vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    rowData={list2}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        {headerName: '商业用户', children:[
                                {field: 'date', headerName: '日期', flex: 1},
                                {field: 'wechat', headerName: '微信下单量', flex: 1},
                                {field: 'cti', headerName: '电话自助下单量', flex: 1},
                                {field: 'appointmentcenter', headerName: '预约中心', flex: 1},
                                {field: 'department', headerName: '门店人工', flex: 1},
                                {field: 'total', headerName: '小计', flex: 1},
                            ]
                        },

                    ]}
                />
            </Box>
            <Box height={'40vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    rowData={list3}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        {headerName: '零售商业', children:[
                                {field: 'date', headerName: '日期', flex: 1},
                                {field: 'wechat', headerName: '微信下单量', flex: 1},
                                {field: 'cti', headerName: '电话自助下单量', flex: 1},
                                {field: 'appointmentcenter', headerName: '预约中心', flex: 1},
                                {field: 'department', headerName: '门店人工', flex: 1},
                                {field: 'total', headerName: '小计', flex: 1},
                            ]
                        },

                    ]}
                />
            </Box>

            <Box height={'40vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    rowData={list}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        {headerName: '总表', children:[
                                {field: 'date', headerName: '日期', flex: 1},
                                {field: 'wechat', headerName: '微信下单量', flex: 1},
                                {field: 'cti', headerName: '电话自助下单量', flex: 1},
                                {field: 'appointmentcenter', headerName: '预约中心', flex: 1},
                                {field: 'department', headerName: '门店人工', flex: 1},
                                {field: 'total', headerName: '小计', flex: 1},
                            ]
                        },

                    ]}
                />
            </Box>
        </Box>
    );
};

export default GasOrderRouteSummary;
