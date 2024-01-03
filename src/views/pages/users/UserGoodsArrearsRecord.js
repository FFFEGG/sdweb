import React, { useState } from 'react';
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { AgGridReact } from "ag-grid-react";
import request from "../../../utils/request";

const UserGoodsArrearsRecord = ({ userinfo }) => {
    const [list, setlist] = useState([])
    return (
        <div>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserGoodsArrearsRecord',
                    ...e,
                    userid: userinfo.userid
                })
                setlist(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={'1999-01-01'} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>


            </Form>


            <Box height={'60vh'} overflow={"scroll"} mt={1}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        { headerName: '订单号', field: 'serial', filter: 'agTextColumnFilter' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '类型', field: 'payment' },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '金额', field: 'total' },
                        { headerName: '残液重量', field: 'residual_air_weight' },
                        { headerName: '残液金额', field: 'residual_air_total' },
                        { headerName: '实欠金额', field: 'pay_arrears', valueGetter: ({ data }) => parseFloat(data.pay_arrears) - parseFloat(data.residual_air_total) },
                        { headerName: '还款时间', field: 'collection_date' },
                        { headerName: '还款金额', field: 'collection_serial', valueGetter: ({ data }) => data.collection_serial ? (parseFloat(data.pay_arrears) - parseFloat(data.residual_air_total)) : '' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '备注', field: 'remark' },
                        { headerName: '管理部门', field: 'attributiondepartment' },
                        { headerName: '操作人', field: 'operator' },
                        { headerName: '状态', field: 'state' },

                    ]}
                    defaultColDef={{
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        resizable: true,
                    }}
                />
            </Box>

        </div>
    );
};

export default UserGoodsArrearsRecord;
