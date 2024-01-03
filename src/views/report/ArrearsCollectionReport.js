import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const ArrearsCollectionReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取欠款收款报表(回款)</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.ArrearsCollectionReport',
                    ...e,
                    department: JSON.stringify(e.department),
                })
                if (rew.data.info.length) {
                    rew.data.info.push({
                        "mode": "合计",
                        "goodsname": "",
                        "packingtype": "",
                        "inandout": "",
                        "num": "",
                        "paycash": rew.data.info.reduce((a, b) => a + parseFloat(b.paycash), 0),
                        "paybalance": rew.data.info.reduce((a, b) => a + parseFloat(b.paybalance), 0),
                        "payonline": rew.data.info.reduce((a, b) => a + parseFloat(b.payonline), 0),
                        "paystock": rew.data.info.reduce((a, b) => a + parseFloat(b.paystock), 0),
                        "paycashgift": rew.data.info.reduce((a, b) => a + parseFloat(b.paycashgift), 0),
                        "payarrears": rew.data.info.reduce((a, b) => a + parseFloat(b.payarrears), 0),
                        "paycoupon": rew.data.info.reduce((a, b) => a + parseFloat(b.paycoupon), 0),
                    })

                }
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} filter field='department' maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='type' label="欠款方式" style={{ width: 200 }}>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
                </Form.Select>

                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='memberid'   label="会员号"  style={{ width: 200 }} />



                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "mode": "商品销售",
                        //     "goodsname": "45KG液化气",
                        //     "packingtype": "[\"YSP118型钢瓶\"]",
                        //     "inandout": "收",
                        //     "num": "2.0",
                        //     "paycash": ".0000",
                        //     "paybalance": ".0000",
                        //     "payonline": ".0000",
                        //     "paystock": ".0000",
                        //     "paycashgift": ".0000",
                        //     "payarrears": "745.0000",
                        //     "paycoupon": ".0000"
                        // }
                        { field: 'mode', headerName: '模式' },
                        { field: 'goodsname', headerName: '商品名称' },
                        { field: 'packingtype', headerName: '包装类型' },
                        { field: 'inandout', headerName: '收/付' },
                        { field: 'num', headerName: '数量' },
                        { field: 'paycash', headerName: '现金' },
                        { field: 'paybalance', headerName: '余额' },
                        { field: 'payonline', headerName: '在线支付' },
                        { field: 'paystock', headerName: '库存' },
                        // { field: 'paycashgift', headerName: '现金券'},
                        { field: 'payarrears', headerName: '欠款' },
                        { field: 'paycoupon', headerName: '优惠券' },


                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default ArrearsCollectionReport;
