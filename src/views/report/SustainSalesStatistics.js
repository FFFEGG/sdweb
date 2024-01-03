import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Modal, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const SustainSalesStatistics = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))

    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [open, setopen] = useState(false)
    const api = useRef()
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [columnDefs, setcolumnDefs] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>归属部门业务员维系用户销售统计</Typography>
            <Form getFormApi={e => { api.current = e }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.SustainSalesStatistics',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department),
                    salesman: JSON.stringify(e.salesman),
                    goodsids: JSON.stringify(e.goodsids),
                })

                if (rew.data.data) {
                    setList(rew.data.data)

                    const arr = (rew.data.key).map((item, index) => {
                        console.log(item)
                        return { headerName: (rew.data.title)[index], field: item, name: (rew.data.title)[index].split('-')[0] }
                    })
                    setcolumnDefs(arr)
                }

                // console.log(arr)

            }} layout='horizontal' labelPosition="inset">
                <Form.Select field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Select field='attributiondepartment' maxTagCount={1} multiple filter label="用户归属部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='salesman' filter maxTagCount={1} multiple label="维护业务员" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                <Form.TreeSelect treeData={new_goodslist} rules={[{ required: true }]} field='goodsids' leafOnly filterTreeNode maxTagCount={1} multiple label="商品" style={{ width: 200 }} />

                <Form.Select field='type' rules={[{ required: true }]} label="属性" style={{ width: 200 }}>
                    <Form.Select.Option value="数量">数量</Form.Select.Option>
                    <Form.Select.Option value="净重">净重</Form.Select.Option>
                </Form.Select>

                <Form.Select field='settlementmethod' rules={[{ required: true }]} label="欠款方式" style={{ width: 200 }}>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>

                </Form.Select>
                <Form.Input field='days' type="number" label="开户天数" initValue={14600} style={{ width: 200 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={columnDefs}
                    onCellDoubleClicked={async e => {
                        if (parseFloat(e.value) === 0) {
                            return
                        }
                        setopen(true)
                        console.log(e)
                        const post = api.current.getFormState().values
                        setsubList([])
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Business_Infos.SustainSalesStatisticsDetailed',
                            ...post,
                            goodsname: e.colDef.name,
                            attributiondepartment: JSON.stringify([e.data.attributiondepartment]),
                            department: JSON.stringify(post.department),
                            salesman: JSON.stringify(post.salesman),
                            goodsids: JSON.stringify(post.goodsids),
                        })
                        if (rew.rew.msg === 'SUCCESS') {
                            setsubList(rew.data.info)
                        }
                    }}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true
                    }}
                />
            </Box>

            <Modal open={open} onClose={() => setopen(false)}>
                <Box sx={{
                    ...style,
                    bgcolor: '#fff',
                    overflow: 'scroll',
                    height: '60vh'
                }}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={[
                            { headerName: '时间', field: 'addtime' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '充装量', field: 'suttle' },
                            { headerName: '余气重量', field: 'residual_air_weight' },
                            { headerName: '余气金额', field: 'residual_air_total' },
                            { headerName: '优惠券金额', field: 'pay_coupon' },
                            { headerName: '支付方式', field: 'payment' },
                            { headerName: '单价', field: 'price' },
                            { headerName: '合计', field: 'total' },
                        ]}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default SustainSalesStatistics;
