import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const UserCallRegistrationReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [keys, setKeys] = useState([])
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>用户通话登记报表</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.UserCallRegistrationReport',
                    ...e,
                    operator: JSON.stringify(e.operator),
                })
                rew.data.info.forEach(item => {
                    // 合计所有字段
                    item['小计'] = Object.values(item).reduce((a, b) => {
                        console.log('小计字段', (b * 1));
                        return (a) + (isNaN(b * 1) ? 0 : (b * 1))
                    }, 0)
                })
                let hj = {

                }

                Object.keys(rew.data.info[0]).forEach(key => {
                    hj[key] = rew.data.info.reduce((a, b) => {
                        return a + (isNaN(b[key] * 1) ? 0 : (b[key] * 1))
                    }, 0)
                    hj['operator'] = '合计'
                })

                rew.data.info.push(hj)
                setList(rew.data.info)
                let keys = new Set();

                rew.data.info.forEach(item => {

                    Object.keys(item).forEach(key => {

                        keys.add(key.replaceAll('.', ','));
                        item[key.replaceAll('.', ',')] = item[key];
                    });
                });

                let keysArray = Array.from(keys);
                console.log(keysArray);
                setKeys(keysArray);

            }} layout='horizontal' labelPosition="inset">
                <Form.Select initValue={initData.OperatorList.filter(item => loginuser.login_departmentid == item.departmentid).map(item => item.name)} field='operator' maxTagCount={3} multiple label="接线员" filter>
                    {
                        initData.OperatorList.filter(item => loginuser.login_departmentid == item.departmentid).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>



                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
                <Button sx={{ ml: 1 }} type="submit" variant="contained" size="small">导出</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={
                        keys.map(item => {
                            return {
                                headerName: item == 'operator' ? '接线员' : item.replaceAll(',', '.'),
                                field: item,
                                sortable: true,
                                filter: true,
                                resizable: true,

                            }
                        })}

                />
            </Box>
        </Box>
    );
};

export default UserCallRegistrationReport;
