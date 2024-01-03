import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const YYZXGasOrderRouteSummary = () => {
    const [list, setList] = useState([])
    return (
        <Box p={3}>
            <Box fontSize={18} mb={3}>预约中心液化气订单途径汇总</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.YYZXGasOrderRouteSummary',
                    ...e,
                })
                setList(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Button variant={'contained'} size={'small'} type={'submit'}>查询</Button>
            </Form>

            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        sortable: true,
                        resizable: true
                    }}
                    rowData={list}
                    className={'ag-theme-balham'}
                    columnDefs={[
                        // {
                        //     "department": "大沙田",
                        //     "customertype": "商业用户",
                        //     "wechat": 13,
                        //     "cti": 0,
                        //     "appointmentcenter": 3,
                        //     "departmentartificial": 4,
                        //     "total": 0
                        // }
                        {
                            headerName: '零售家庭用户各类预约方式统计', children: [
                                {headerName: '业务部门', field: 'department'},
                                {headerName: '客户类型', field: 'customertype'},
                                {headerName: '微信', field: 'wechat'},
                                {headerName: 'CTI', field: 'cti'},
                                {headerName: '预约中心', field: 'appointmentcenter'},
                                {headerName: '非预约中心', field: 'departmentartificial'},
                                // {headerName: '合计', field: 'total'},
                            ]
                        },

                    ]}
                />
            </Box>
        </Box>
    );
};

export default YYZXGasOrderRouteSummary;
