import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const SyqUserSalesGoodsDifferenceTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef(null);
    const [attributiondepartmentid, setattributiondepartmentid] = useState('')
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户换气差异表</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqUserSalesGoodsDifferenceTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime1'} label={'开始时间1'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime1'} label={'结束时间1'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'begintime2'} label={'开始时间2'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime2'} label={'结束时间2'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} onChange={e => setattributiondepartmentid(e)} >
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} rules={[{ required: true, message: '必选' }]} filter multiple maxTagCount={3} field={'salesman'} style={{ width: 200 }}>
                    {
                        initData.OperatorList.filter(item => item.departmentid == attributiondepartmentid).map(item =>
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
                    columnDefs={[
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '手机号', field: 'telephone' },
                        { headerName: '工作单位', field: 'workplace' },
                        { headerName: '地址', field: 'completeaddress' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        {
                            headerName: '期间1', field: 'salesinfo1', valueGetter: ({ data }) => {
                                // {
                                //     "goodsname": "45KG液化气",
                                //     "num": "4.0"
                                //   }
                                return data.salesinfo1.map(item => `${item.goodsname}X${item.num}`).join(',')
                            }
                        },
                        {
                            headerName: '期间2', field: 'salesinfo2', valueGetter: ({ data }) => {
                                // {
                                //     "goodsname": "45KG液化气",
                                //     "num": "4.0"
                                //   }
                                return data.salesinfo2.map(item => `${item.goodsname}X${item.num}`).join(',')
                            }
                        },

                    ]}
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

export default SyqUserSalesGoodsDifferenceTable;



