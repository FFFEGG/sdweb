import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const HandleGoodsSalesMashupReport2 = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
    const [list,setlist] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>促销方案统计表</Box>


            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.HandleGoodsSalesMashupReport2',
                    ...e,
                    department: JSON.stringify(e.department)
                })
                rew.data.info.forEach(item=>{
                    // item.addtime = moment(item.addtime).format('YYYY-MM-DD')
                    item.num = item.num * 1
                    item.total = parseFloat(item.total).toFixed(2)
                })
                setlist(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')} style={{width: 200}}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}
                            style={{width: 200}}/>
                <Form.TreeSelect multiple leafOnly maxTagCount={1} filterTreeNode field={'department'} treeData={new_department_byname} label={'部门'}  />
                <Button variant={'outlined'} type={'submit'} size={'small'}>搜索</Button>
            </Form>
            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-09-13 00:00:00.000",
                        //     "department": "白沙店",
                        //     "memberid": "13788019709",
                        //     "goodsname": "石埠山泉水(10+5)",
                        //     "num": "1.0",
                        //     "total": "150.0000"
                        // }
                        {headerName: '时间', field: 'addtime'},
                        {headerName: '部门', field: 'department'},
                        {headerName: '会员号', field: 'memberid'},
                        {headerName: '商品名称', field: 'goodsname'},
                        {headerName: '数量', field: 'num'},
                        {headerName: '合计', field: 'total'},
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

export default HandleGoodsSalesMashupReport2;
