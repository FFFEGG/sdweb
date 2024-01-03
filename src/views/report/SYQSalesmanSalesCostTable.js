import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";


const SYQSalesmanSalesCostTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气业务员销售费用表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqSalesmanSalesCostTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                //SYQSalesmanSalesCostTable
                rew.data.info.push({
                    goodsname: '合计',
                    num: rew.data.info.reduce((a, b) => a + parseFloat(b.num), 0),
                    AsKg: rew.data.info.reduce((a, b) => a + parseFloat(b.AsKg), 0),
                    residualgas: rew.data.info.reduce((a, b) => a + parseFloat(b.residualgas), 0),
                    residualgastotal: rew.data.info.reduce((a, b) => a + parseFloat(b.residualgastotal), 0),
                    ActualSalesWeight: rew.data.info.reduce((a, b) => a + parseFloat(b.ActualSalesWeight), 0),

                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.filter(item => item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'商品'} filter field={'goodsid'} >
                    {
                        initData.GoodsList.map(item =>
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>

                <Form.Select filter label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
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
                        { headerName: '商品名称', field: 'goodsname' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '折公斤', field: 'AsKg' },
                        { headerName: '零售价', field: 'marketprice' },
                        { headerName: '实际交易单价', field: 'price' },
                        { headerName: '优惠券', field: 'coupon' },
                        { headerName: '优惠金额', valueGetter: params => parseFloat(params.data.marketprice) - parseFloat(params.data.price), width: 80 },
                        { headerName: '补贴金额', field: 'distributionsubsidy_total' },
                        { headerName: '实际换气金额', field: 'total' },
                        { headerName: '退残重量', field: 'residualgas' },
                        { headerName: '退残金额', field: 'residualgastotal' },
                        { headerName: '实际销售重量', field: 'ActualSalesWeight' },
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

export default SYQSalesmanSalesCostTable;


