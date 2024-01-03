import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../../utils/request";
import translations from '../../../utils/translations.json'
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

const UserOrderResidualRecord = ({ userinfo }) => {
    const [list, setList] = useState([])
    return (
        <Box>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserOrderResidualRecord',
                    ...e,
                    userid: userinfo.userid
                })
                setList(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={'1999-01-01'} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button variant={"outlined"} type={"submit"}>搜索</Button>

            </Form>

            <Box height={'60vh'} overflow={"scroll"} mt={1}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    localeText={translations}
                    columnDefs={[
                        { headerName: '创建时间', field: 'addtime', },
                        { headerName: '订单号', field: 'serial' },
                        { headerName: '来源', field: 'source' },
                        { headerName: '模式', field: 'mode' },
                        // { headerName: 'relationgoodswarehouseid', field: 'relationgoodswarehouseid' },
                        // { headerName: 'combinationgoods', field: 'combinationgoods' },
                        // { headerName: 'serial_relation', field: 'serial_relation' },
                        // { headerName: 'gsmname', field: 'gsmname' },
                        { headerName: '商品名称', field: 'goodsname' },
                        { headerName: '报表充装量', field: 'reportsuttle' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '合计', field: 'total' },
                        { headerName: 'iouid', field: 'iouid' },
                        { headerName: '支付方式', field: 'payment' },
                        // { headerName: 'transaction_amount', field: 'transaction_amount' },
                        { headerName: '余气单价', field: 'residual_air_price' },
                        { headerName: '余气重量', field: 'residual_air_weight' },
                        { headerName: '余气小计金额', field: 'residual_air_total' },
                        {
                            headerName: '余气备注', field: 'residual_air_remarks', cellRendererFramework: ({ data }) => <Box>
                                {
                                    JSON.parse(data.residual_air_remarks).map(item => <Box>条码:{item.code}重量:{item.weight}|</Box>)
                                }

                            </Box>
                        },
                    ]}
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

export default UserOrderResidualRecord;
