import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const SyqRetreatUserPackingtypeMaterialNotMoneyTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气退包装物未退款表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqRetreatUserPackingtypeMaterialNotMoneyTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} field={'attributiondepartmentid'} filter>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} filter multiple maxTagCount={3} field={'salesman'} >
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
                    columnDefs={[
                        // {
                        //     "retreat_time": "2023-08-02 10:08:08.000",
                        //     "userid": "662292",
                        //     "memberid": "19561956",
                        //     "mode": "借用",
                        //     "packingtypename": "45KG液相瓶借用",
                        //     "num": "1",
                        //     "retreat_salesman": "刘春霞"
                        // }
                        { headerName: '退瓶时间', field: 'retreat_time' },

                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '业务类型', field: 'mode' },
                        { headerName: '包装物类型', field: 'packingtypename' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '退瓶业务员', field: 'retreat_salesman' },
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

export default SyqRetreatUserPackingtypeMaterialNotMoneyTable;

