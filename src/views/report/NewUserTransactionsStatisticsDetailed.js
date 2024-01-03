import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const NewUserTransactionsStatisticsDetailed = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist_byname = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>新户交易统计明细</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.NewUserTransactionsStatisticsDetailed',
                    ...e,
                    department: JSON.stringify(e.department),
                    goodsids: JSON.stringify(e.goodsids),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='attributiondepartment' maxTagCount={1} multiple filter label="用户归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='salesman' maxTagCount={1} multiple label="维护业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Input field='begintime' type="date" label="销售起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="销售结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                {/* <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>
                 */}
                <Form.TreeSelect field='goodsids' treeData={new_goodslist_byname} maxTagCount={1} leafOnly filterTreeNode multiple label="商品" style={{ width: 250 }} />

                <Form.Input field='days' type="number" label="开户天数(含)" initValue={90} style={{ width: 200 }} />
                <Form.Input field='numberoftransactions' type="number" label="交易次数" initValue={1} style={{ width: 200 }} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '配送员', field: 'deliveryman' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'username' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '地址', field: 'address' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '销售价', field: 'salesprice' },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        // flex: 1
                    }}
                />
            </Box>
        </Box>
    );
};

export default NewUserTransactionsStatisticsDetailed;
