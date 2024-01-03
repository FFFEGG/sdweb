import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import translations from "../../utils/translations";

const DeliverymanDeliveryResidualReport = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>工商用气调运销售余气(运输公司用 司机调运销售余气报表)</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.DeliverymanDeliveryResidualReport',
                    ...e,
                    deliveryman: JSON.stringify(e.deliveryman),
                    department: JSON.stringify(e.department)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field='deliveryman' label='配送员' multiple filter >
                    {
                        initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>
                <Form.Select field='department' label='服务部门' multiple filter >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={[
                        // {
                        //     "department": "运输公司",
                        //     "deliveryman": "梁朝凯",
                        //     "goodsname": "45KG液化气",
                        //     "return_num": "0",
                        //     "residual_air_weight": "0.0"
                        // }
                        { field: 'department', headerName: '部门', flex: 1 },
                        { field: 'deliveryman', headerName: '配送员', flex: 1 },
                        { field: 'goodsname', headerName: '商品名称', flex: 1 },
                        { field: 'return_num', headerName: '空瓶', flex: 1 },
                        { field: 'residual_air_weight', headerName: '余气重量', flex: 1 },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default DeliverymanDeliveryResidualReport;
