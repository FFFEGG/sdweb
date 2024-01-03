import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SCBAccUserInfoRecord = () => {
    // Srapp.Web_Report_Manage_Infos.SCBAccUserInfoRecord
    // 市场部查询开户记录
    // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Report_Manage_Infos.SCBAccUserInfoRecord
    //     POST
    // 接口描述：
    //
    // 接口参数
    //     参数名字	类型	是否必须	默认值	其他	说明
    //     begintime	日期	必须			起始时间
    //     endtime	日期	必须			结束时间
    const [list,setlist] = useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>市场部查询开户</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Manage_Infos.SCBAccUserInfoRecord',
                    ...e
                })
                setlist(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'起始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>

            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[

                        // {field: 'userid', headerName: '用户ID', flex: 1,hide: true},
                        // {field: 'accountopeningtime ', headerName: '开户时间', flex: 1},
                        // {field: 'memberid', headerName: '会员号', flex: 1},
                        // {field: 'address', headerName: '地址', flex: 1},
                        // {field: 'customertypeid', headerName: '客户类型ID', flex: 1,hide: true},
                        // {field: 'accountopeningdepartment', headerName: '开户部门', flex: 1,filter: 'agSetColumnFilter'},
                        // {field: 'attributiondepartmentid', headerName: '归属部门ID', flex: 1,hide: true},
                        // {field: 'salesman', headerName: '业务员', flex: 1},
                        // {field: 'housingpropertyid', headerName: '房产类型ID', flex: 1,hide: true},
                        // {field: 'operator', headerName: '开户人员', flex: 1},
                        // {field: 'attributiondepartment', headerName: '归属部门', flex: 1,filter: 'agSetColumnFilter'},
                        // {field: 'customertype', headerName: '客户类型', flex: 1,filter: 'agSetColumnFilter'},
                        // {field: 'housingproperty', headerName: '住宅类型', flex: 1,filter: 'agSetColumnFilter'},
                        // {
                        //     "userid": "686003",
                        //     "accountopeningdepartment": "银海店",
                        //     "accountopeningtime": "2023-12-05 08:09:10.583",
                        //     "memberid": "15307872573",
                        //     "address": "马头坡18号2楼",
                        //     "customertype": "家庭用户",
                        //     "attributiondepartment": "零售江南分公司",
                        //     "salesman": "陈建卫",
                        //     "developsalesman": "陈建卫"
                        // }
                        {field: 'userid', headerName: '用户ID', flex: 1,hide: true},
                        {field: 'accountopeningdepartment', headerName: '开户部门', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true },
                        {field: 'accountopeningtime', headerName: '开户时间', flex: 1},
                        {field: 'memberid', headerName: '会员号', flex: 1},
                        {field: 'address', headerName: '地址', flex: 1},
                        {field: 'customertype', headerName: '客户类型', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'attributiondepartment', headerName: '归属部门', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'department', headerName: '销售部门', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'salesman', headerName: '业务员', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true},
                        {field: 'developsalesman', headerName: '开户业务员', flex: 1,filter: 'agSetColumnFilter',enableRowGroup: true},

                    ]}
                    // 分组
                    rowGroupPanelShow={'always'}


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

export default SCBAccUserInfoRecord;
