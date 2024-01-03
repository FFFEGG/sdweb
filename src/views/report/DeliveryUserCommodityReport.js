import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";

const DeliveryUserCommodityReport = () => {

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])

    const [keys, setKeys] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>配送用户商品报表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.DeliveryUserCommodityReport',
                    ...e,
                    department: JSON.stringify(e.department),
                    goodsids: JSON.stringify(e.goodsids),
                })
                setList(rew.data.info)


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
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department == '零售后勤') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Select field='goodsids' maxTagCount={1} multiple label="商品" style={{ width: 200 }}>
                    {
                        initData.GoodsList.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>


                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={
                        keys.map(key => {
                            return {
                                // key 等于 'department' 时，headerName 为 '部门' key 等于 deliveryman 时，headerName 为 '配送员'
                                // key 等于其他值时，headerName 为 key
                                headerName: key === 'department' ? '部门' : key === 'deliveryman' ? '配送员' : key,
                                field: key,
                                sortable: true,
                                filter: true,
                                resizable: true,

                            }
                        }
                        )
                    }
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    onRowDataChanged={params => params.api.sizeColumnsToFit()}
                    defaultColDef={{
                        resizable: true
                    }}
                />
            </Box>



        </Box>
    );
};

export default DeliveryUserCommodityReport;
