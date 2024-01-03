import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";


const SYQUserOtherServicesRecordTable = () => {
    const [list,setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户其它服务记录表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Manage_Infos.SYQUserOtherServicesRecordTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item=>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'状态'} field={'state'} >
                    <Form.Select.Option value="已汇总">已汇总</Form.Select.Option>
                    <Form.Select.Option value="已安排">已安排</Form.Select.Option>
                    <Form.Select.Option value="已完成">已完成</Form.Select.Option>
                    <Form.Select.Option value="取消">取消</Form.Select.Option>
                </Form.Select>



                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName:'方式',field: 'mode'},
                        {headerName:'业务员',field: 'salesman'},
                        {headerName:'部门',field: 'department'},
                        {headerName:'折吨',field: 'AsTon'},
                        {headerName:'余气',field: 'residualgas'},
                        // {headerName:'地址',field: 'address'},
                        // {headerName:'楼层',field: 'floor'},
                        // {headerName:'超远补贴',field: 'addresssubsidy'},
                        // {headerName:'归属部门',field: 'attributiondepartment'},
                        // {headerName:'业务员',field: 'salesman'},
                        // {headerName:'商品',field: 'goodsname'},
                        // {headerName:'数量',field: 'num'},
                        // {headerName:'小计',field: 'total'},
                        // {headerName:'平均单价',field: 'averageunitprice'},
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e=>e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default SYQUserOtherServicesRecordTable;


