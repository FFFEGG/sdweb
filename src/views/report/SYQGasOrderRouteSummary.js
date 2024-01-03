import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SYQGasOrderRouteSummary = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setlist] = useState([])
    return (
        <Box>
            <Box fontSize={18} mb={3}>商用气液化气订单途径汇总</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Business_Infos.SYQGasOrderRouteSummary',
                    ...e
                })
                // console.log(rew.data
                setlist(rew.data.info)
            }}>
                {/*begintime	日期	必须			开始时间*/}
                {/*endtime	日期	必须			结束时间*/}
                {/*memberid	字符串	可选			会员号*/}
                {/*attributiondepartment	字符串	必须			归属部门 JSON ["商用气开发一部","商用气开发二部"]*/}
                {/*salesman	字符串	可选			业务员 JSON ["张三","李四"]*/}
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>

                <Button variant={'contained'} size={'small'} type={'submit'}>查询</Button>

            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[

                        {field: 'attributiondepartment', headerName: '归属部门', flex: 1},
                        {field: 'customertype', headerName: '客户类型', flex: 1},
                        {field: 'wechat', headerName: '微信', flex: 1},
                        {field: 'cti', headerName: '自助', flex: 1},
                        {field: 'appointmentcenter', headerName: '预约中心', flex: 1},
                        {field: 'departmentartificial', headerName: '门店', flex: 1},

                    ]}
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

export default SYQGasOrderRouteSummary;
