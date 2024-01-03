import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";

const SYQNEWUSERCXTable = () => {
    const [list,setList] = React.useState([])
    return (
        <Box p={3}>
            <Box fontSize={18} mb={3}>
                商用气新开客户查询表
            </Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Manage_Infos.SYQNEWUSERCXTable',
                    ...e
                })
                setList(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button variant={'outlined'} size={'small'} type={'submit'} >搜索</Button>
            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-09-22 08:07:06.103",
                        //     "memberid": "851739",
                        //     "name": "史桂花",
                        //     "workplace": "隆江猪脚饭博白白切",
                        //     "address": "岗平路大都华园5-102号隆江猪脚饭博白白切",
                        //     "customertypeid": "2",
                        //     "attributiondepartmentid": "91",
                        //     "developsalesman": "贾德志",
                        //     "salesman": "贾德志",
                        //     "department": "发卡室",
                        //     "operator": "曾栗平",
                        //     "attributiondepartment": "商用气开发二部",
                        //     "customertype": "商业用户"
                        // }
                        {headerName: '时间',field: 'addtime'},
                        {headerName: '会员号',field: 'memberid'},
                        {headerName: '姓名',field: 'name'},
                        {headerName: '单位',field: 'workplace'},
                        {headerName: '地址',field: 'address'},
                        {headerName: '客户类型',field: 'customertype'},
                        {headerName: '归属部门',field: 'attributiondepartment'},
                        {headerName: '开发业务员',field: 'developsalesman'},
                        {headerName: '业务员',field: 'salesman'},
                        {headerName: '部门',field: 'department'},
                        {headerName: '操作员',field: 'operator'},


                    ]}
                    defaultColDef={{
                        width: 100,
                        editable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        resizable: true,

                    }}
                />
            </Box>
        </Box>
    );
};

export default SYQNEWUSERCXTable;
