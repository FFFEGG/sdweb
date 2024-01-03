import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const UserLastTransactionsRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>用户最后一次交易记录</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.UserLastTransactionsRecord',
                    ...e,
                    department: JSON.stringify(e.department),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman),
                    goodsids: JSON.stringify(e.goodsids),
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
                <Form.Select field='attributiondepartment' filter maxTagCount={1} multiple label="用户归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option
                            value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='salesman' filter maxTagCount={1} multiple label="维护业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option
                            value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>


                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />

                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />

                {/* <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option
                            value={item.id}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select> */}

                <Form.TreeSelect treeData={new_goodslist} field='goodsids' leafOnly filterTreeNode maxTagCount={1} multiple label="商品" style={{ width: 300 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-04-07 00:00:00.000",
                        //     "userid": "77",
                        //     "memberid": "13878828838",
                        //     "telephone": "13878828838",
                        //     "workplace": "",
                        //     "province": "广西壮族自治区",
                        //     "city": "南宁市",
                        //     "area": "青秀区",
                        //     "town": "新竹街道",
                        //     "address": "鲤湾路1号",
                        //     "goodsname": "12KG液化气",
                        //     "price": "110.0000",
                        //     "num": "1.0",
                        //     "attributiondepartment": "液化气公司",
                        //     "salesman": "关云达",
                        //     "department": "二区店",
                        //     "deliveryman": "二区配送员",
                        //     "accountopeningtime": "2023-04-07 09:26:52.477",
                        //     "developsalesman": "关云达",
                        //     "rowid": "1"
                        //   }
                        { headerName: "交易时间", field: "addtime" },
                        { headerName: "用户ID", field: "userid", hide: true },
                        { headerName: "会员号", field: "memberid" },
                        { headerName: "用户类型", field: "customertype" },
                        { headerName: "用户姓名", field: "telephone" },
                        { headerName: "用户工作单位", field: "workplace" },
                        { headerName: "用户省份", field: "province" },
                        { headerName: "用户城市", field: "city" },
                        { headerName: "用户区县", field: "area" },
                        { headerName: "用户街道", field: "town" },
                        { headerName: "用户详细地址", field: "address" },
                        { headerName: "商品名称", field: "goodsname" },
                        { headerName: "商品单价", field: "price" },
                        { headerName: "商品数量", field: "num" },
                        { headerName: "用户归属部门", field: "attributiondepartment" },
                        { headerName: "维护业务员", field: "salesman" },
                        { headerName: "业务部门", field: "department" },
                        { headerName: "配送员", field: "deliveryman" },
                        { headerName: "开户时间", field: "accountopeningtime" },
                        { headerName: "开户业务员", field: "developsalesman" },


                    ]}
                />
            </Box>
        </Box>
    );
};

export default UserLastTransactionsRecord;
