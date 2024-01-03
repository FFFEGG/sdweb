import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const UserTransactionsRecordOfFrequency = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>某段时间开户用户在某段时间第N次交易记录</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.UserTransactionsRecordOfFrequency',
                    ...e,
                    department: JSON.stringify(e.department),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    goodsids: JSON.stringify(e.goodsids),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department == '零售后勤') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='attributiondepartment' filter maxTagCount={1} multiple label="归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option
                            value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='salesman' maxTagCount={1} multiple label="维护业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option
                            value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>
                {/* <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option
                            value={item.id}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select> */}
                <Form.TreeSelect field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 230 }} treeData={new_goodslist} filterTreeNode leafOnly />

                <Form.Input field='putonrecord_begintime' type="date" label="开户时间"
                    initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='putonrecord_endtime' type="date" label="开户结束"
                    initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='begintime' type="date" label="交易起始" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="交易结束" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />


                <Form.Input field='frequency' type="number" initValue={1} label="第N次数交易" style={{ width: 200 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-07-25 00:00:00.000",
                        //     "accountopeningdepartment": "商用气维护部",
                        //     "userid": "662154",
                        //     "memberid": "8000111",
                        //     "telephone": "137000000009",
                        //     "workplace": "远方",
                        //     "province": "广西壮族自治区",
                        //     "city": "南宁市",
                        //     "area": "兴宁区",
                        //     "town": "民生街道",
                        //     "address": "望州路3号",
                        //     "goodsname": "45KG液化气",
                        //     "marketprice": "470.0000",
                        //     "price": "370.0000",
                        //     "num": "1.0",
                        //     "attributiondepartment": "商用气维护部",
                        //     "customertype": "商用气机关事业单位用户",
                        //     "salesman": "SY0011",
                        //     "department": "运输公司",
                        //     "deliveryman": "苏卫",
                        //     "accountopeningtime": "2023-07-25 16:30:48.550",
                        //     "developsalesman": "SY0011",
                        //     "rowid": "1"
                        // }

                        { field: 'accountopeningdepartment', headerName: '办卡站点', width: 150 },
                        { field: 'customertype', headerName: '用户类型', width: 150 },
                        { field: 'memberid', headerName: '会员号', width: 150 },
                        { field: 'developsalesman', headerName: '开户人', width: 150, floatingFilter: true },
                        { field: 'accountopeningtime', headerName: '开户时间', width: 150 },
                        { field: 'addtime', headerName: '二次换气时间', width: 150 },
                        { field: 'goodsname', headerName: '商品', width: 150 },
                        { field: 'num', headerName: '数量', width: 150 },
                        { field: 'marketprice', headerName: '市场价', width: 150 },
                        { field: 'price', headerName: '交易价', width: 150 },


                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserTransactionsRecordOfFrequency;
