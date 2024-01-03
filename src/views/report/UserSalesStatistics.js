import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const UserSalesStatistics = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>用户群组时间段销量统计(折吨)</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.UserSalesStatistics',
                    ...e,
                    department: JSON.stringify(e.department),
                    goodsids: JSON.stringify(e.goodsids),
                    memberids: JSON.stringify(e.memberids),
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
                <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>

                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.TagInput field='memberids' label="会员号" style={{ width: 200 }} maxTagCount={1} placeholder="输入会员号按回车" />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '会员号', field: 'memberid' },

                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '销售重量', field: 'weight', valueGetter: ({ data }) => parseFloat(data.weight).toFixed(5) },
                        { headerName: '余气重量', field: 'residual_air_weight', valueGetter: ({ data }) => parseFloat(data.residual_air_weight).toFixed(5) },
                        { headerName: '实际销量', valueGetter: ({ data }) => (parseFloat(data?.weight) - parseFloat(data?.residual_air_weight)).toFixed(5) },


                    ]}
                />
            </Box>
        </Box>
    );
};

export default UserSalesStatistics;
