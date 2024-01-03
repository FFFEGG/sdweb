import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const SyqSalesmanHoldUserTransactionTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [keys, setKeys] = useState([])

    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气业务员管理用户交易户数表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqSalesmanHoldUserTransactionTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

                if (rew.data.info.length) {
                    // 在每一行后面增加合计字段
                    rew.data.info.forEach(item => {
                        let total = 0;
                        for (let key in item) {
                            if (key !== 'salesman') {
                                total += Number(item[key]);
                            }
                        }

                        item['合计'] = total;
                    });
                    let hj = {}
                    rew.data.info.forEach(item => {
                        for (let key in item) {
                            if (key !== 'salesman') {
                                if (hj[key]) {
                                    hj[key] += Number(item[key]);
                                } else {
                                    hj[key] = Number(item[key]);
                                }
                            } else {
                                hj[key] = '合计';
                            }
                        }
                    }
                    );
                    rew.data.info.push(hj);
                }

                let keys = new Set();


                rew.data.info.forEach(item => {
                    Object.keys(item).forEach(key => {
                        keys.add(key);
                    });
                });

                let keysArray = Array.from(keys);
                console.log(keysArray);
                setKeys(keysArray);

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>




                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={
                        keys.map(item => {
                            if (item == 'salesman') {
                                return {
                                    headerName: '业务员', field: 'salesman'
                                }
                            }

                            return { headerName: item, field: item }
                        })
                    }
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default SyqSalesmanHoldUserTransactionTable;


