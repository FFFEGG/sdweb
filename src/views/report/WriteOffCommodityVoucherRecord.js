import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const WriteOffCommodityVoucherRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [arr, setArr] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取核销商品抵扣凭证记录</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.WriteOffCommodityVoucherRecord',
                    ...e,
                    department: JSON.stringify(e.department),
                })




                if (rew.data.info.length) {
                    rew.data.info.push({
                        "id": "合计",
                        num: rew.data.info.reduce((a, b) => a + b.num * 1, 0),
                    })
                }
                setList(rew.data.info)


                // 统计商品goodsname 数量 num
                // const arrs  = rew.data.info.forEach((a, b) => {
                //     const index = a.findIndex(item => item.goodsname == b.goodsname)
                //     if (index == -1) {
                //         a.push(b)
                //     } else {
                //         a[index].num = parseInt(a[index].num) + parseInt(b.num)
                //     }
                //     return a
                // }, [])
                // setArr(arrs)
            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department == '配送部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>


                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />




                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>
            <Box

            display="flex"
            flexWrap="wrap"

            >
                {
                    arr.filter(item=>item.goodsname).map(item => <Box
                        key={item.goodsname}
                        bgcolor="#eee"
                        p={1}
                        my={1}
                        mr={1}
                        borderRadius={1}

                    >{item.goodsname}：{item.num}</Box>)
                }
            </Box>
            <Box mt={1} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '日期', field: 'time' },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '票号', field: 'goodsorderserial' },
                        { headerName: '操作员', field: 'operator' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '业务员', field: 'deliveryman' },
                    ]}

                />
            </Box>
        </Box>
    );
};

export default WriteOffCommodityVoucherRecord;
