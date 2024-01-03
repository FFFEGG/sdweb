import React, { useState } from 'react';
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import { Box } from "@mui/system";
import { AgGridReact } from "ag-grid-react";

const AdvancePaymentOrderList = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))


    return (
        <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                console.log(e);
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Order_Infos.AdvancePaymentOrderList',
                    ...e
                })
                setList(rew.data)
            }}>
                <Form.Input label={'开始时间'} field={'begintime'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input label={'开始时间'} field={'endtime'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>
            </Form>


            <Box height={'60vh'} overflow={"scroll"} mt={3}>

                <AgGridReact
                    localeText={tanslations}
                    className="ag-theme-balham"
                    rowData={list}
                    defaultColDef={{
                        flex: 1,
                        minWidth: 100,
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    columnDefs={[
                        { headerName: '订单号', field: 'serial' },
                        { headerName: 'sns', field: 'sns' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '类型', field: 'type' },
                        { headerName: '信息', field: 'info' },
                        { headerName: 'payfeeids', field: 'payfeeids' },
                        { headerName: 'goodswarehouse', field: 'goodswarehouse' },
                        { headerName: 'couponinfo', field: 'couponinfo' },
                        { headerName: '在线支付', field: 'pay_online_total' },
                        { headerName: '余额', field: 'deductionbalance' },
                        { headerName: '时间戳', field: 'time_expire' },
                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Button onClick={async e => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Order_Handle.CancelAdvancePaymentOrder',
                                    id: data.id,
                                    serial: data.serial,
                                    remarks: loginuser.name + '取消'
                                })
                                console.log(rew)
                            }} size={"small"}>取消</Button>
                        },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default AdvancePaymentOrderList;
