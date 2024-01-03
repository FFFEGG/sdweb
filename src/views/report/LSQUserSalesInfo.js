import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const LSQUserSalesInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [keys, setKeys] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用换气台账</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.LSQBusinessUserSalesInfo',
                    ...e,
                    department: JSON.stringify(e.department),
                    memberid: JSON.stringify(e.memberid)
                })
                // rew.data.info 按照 e.memberid 的顺序排列
                rew.data.info.sort((a, b) => {
                    return e.memberid.indexOf(a.memberid) - e.memberid.indexOf(b.memberid)
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
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select label="业务部门" field='department' maxTagCount={1} multiple initValue={[loginuser.login_department]}>
                    {
                        initData.DepartmentList.filter(item => item.type == '业务门店').map(item => {
                            return <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        }
                        )
                    }
                </Form.Select>
                <Form.TagInput label="会员号" field='memberid' placeholder={'回车多个卡号'} style={{width: 500}} />



                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={
                        keys.map(key => {
                            if (key == 'memberid') {
                                return {
                                    headerName: '会员号',
                                    field: key,
                                }
                            }
                            if (key == 'address') {
                                return {
                                    headerName: '地址',
                                    field: key,
                                }
                            }
                            return {
                                headerName: key,
                                field: key,
                            }
                        })
                    }
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        floatingFilter: true,
                        filter: 'agTextColumnFilter',
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default LSQUserSalesInfo;
