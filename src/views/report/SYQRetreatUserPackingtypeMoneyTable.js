import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'


const SyqRetreatUserPackingtypeMoneyTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户办理包装物退款表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqRetreatUserPackingtypeMoneyTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

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

                <Form.Select label={'业务员'} multiple maxTagCount={3} filter style={{width:300}} field={'salesman'} >
                    {
                        initData.OperatorList.filter(item=>item.department.includes('商')).map(item =>
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
                    localeText={tanslations}
                    columnDefs={[
                        // {
                        //     "refund_attributiondepartment": "液化气公司",
                        //     "refund_salesman": "",
                        //     "refund_time": "2023-08-17 12:45:47.000",
                        //     "name": "1办理押金15\u0000 ",
                        //     "packingtype": "[\"YSP35.5型钢瓶\",\"YSP28.6型钢瓶\"]",
                        //     "price": "120.0000",
                        //     "num": "1",
                        //     "billno": "13435396\u0000",
                        //     "mode": "押金",
                        //     "refund_remarks": ""
                        // }
                        { headerName: '归属部门', field: 'refund_attributiondepartment' },
                        { headerName: '业务员', field: 'refund_salesman' },
                        { headerName: '退款时间', field: 'refund_time' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '包装物', field: 'packingtype' },
                        { headerName: '金额', field: 'price' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '单据号', field: 'billno' },
                        { headerName: '退款方式', field: 'mode' },
                        { headerName: '原因', field: 'refund_remarks' },
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

export default SyqRetreatUserPackingtypeMoneyTable;


