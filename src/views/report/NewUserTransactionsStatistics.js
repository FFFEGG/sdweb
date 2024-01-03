import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import translations from "../../utils/translations";
import { AgGridReact } from "ag-grid-react";

const NewUserTransactionsStatistics = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const [list, setList] = useState([])
    const [list2, setList2] = useState([])
    const [show, setShow] = useState(false)
    const [departmentids, setdepartmentids] = useState([])
    const api = useRef(null);
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>新户交易统计</Typography>
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.NewUserTransactionsStatistics',
                    ...e,
                    department: JSON.stringify(e.department),
                    goodsids: JSON.stringify(e.goodsids),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select filter field='department' maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select onChange={e => {
                    console.log('修改用户归属部门', e);
                    setdepartmentids(e)
                }} field='attributiondepartment' maxTagCount={1} multiple filter label="用户归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='salesman' filter maxTagCount={1} multiple label="维护业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.filter(item => {
                            if (departmentids.length) {
                                return departmentids.includes(item.department)
                            }
                            return true
                        }).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Input field='begintime' type="date" label="销售起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="销售结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                {/* 
                <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select> */}
                <Form.TreeSelect treeData={new_goodslist} field='goodsids' leafOnly filterTreeNode maxTagCount={1} multiple label="商品" style={{ width: 200 }} />
                <Form.Input field='days' type="number" label="开户天数(含)" initValue={90} style={{ width: 200 }} />
                <Form.Input field='numberoftransactions' type="number" label="交易次数" initValue={1} style={{ width: 200 }} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={[
                        // {
                        //     "attributiondepartment": "液化气公司",
                        //     "department": "二区店",
                        //     "developsalesman": "关云达",
                        //     "num": 1
                        //   }
                        { headerName: "用户归属部门", field: "attributiondepartment" },
                        { headerName: "业务部门", field: "department" },
                        { headerName: "维护业务员", field: "developsalesman" },
                        { headerName: "数量", field: "num" },

                    ]}
                    onCellDoubleClicked={async e => {
                        const { data } = e
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Business_Infos.NewUserTransactionsStatisticsDetailed',
                            department: JSON.stringify([data.department]),
                            attributiondepartment: JSON.stringify([data.attributiondepartment]),
                            salesman: JSON.stringify([data.developsalesman]),
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                            days: api.current.getValue('days'),
                            goodsids: JSON.stringify(api.current.getValue('goodsids')),
                            numberoftransactions: api.current.getValue('numberoftransactions'),
                        })
                        setList2(rew.data.info)
                        setShow(true)

                    }}
                />
            </Box>

            <Modal size="large" visible={show} title="新户交易统计明细" onCancel={() => setShow(false)} footer={null}>
                <Box mt={3} overflow="scroll" height="60vh">
                    <AgGridReact

                        className="ag-theme-balham"
                        rowData={list2}
                        localeText={translations}
                        columnDefs={[
                            { headerName: "添加时间", field: "addtime" },
                            { headerName: "会员号", field: "memberid" },
                            { headerName: "用户名称", field: "username" },
                            { headerName: "用户地址", field: "address" },
                            { headerName: "用户类型", field: "customertype" },
                            { headerName: "商品名称", field: "goodsname" },
                            { headerName: "市场价", field: "marketprice" },
                            { headerName: "单价", field: "price" },
                            { headerName: "销售价", field: "salesprice" },
                            { headerName: "数量", field: "num" },
                            { headerName: "用户归属部门", field: "attributiondepartment" },
                            { headerName: "业务部门", field: "department" },
                            { headerName: "配送员", field: "deliveryman" },
                            { headerName: "开户时间", field: "accountopeningtime" },
                            { headerName: "维护业务员", field: "developsalesman" },
                        ]}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default NewUserTransactionsStatistics;
