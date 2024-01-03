import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";

const GetUserSNSPayInfo = () => {
    const [list,setList] = useState([])
    return (
        <Box p={3}>
            <Box fontSize={18} mb={3}>获取用户SNS支付信息</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Other_Infos.GetUserSNSPayInfo',
                    ...e
                })
                // console.log(rew)
                setList(rew.data)
            }}>
                {/*Srapp.Web_Other_Infos.GetUserSNSPayInfo*/}
                {/*获取用户SNS支付信息*/}
                {/*接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Other_Infos.GetUserSNSPayInfo*/}
                {/*POST*/}
                {/*接口描述：*/}

                {/*接口参数*/}
                {/*参数名字	类型	是否必须	默认值	其他	说明*/}
                {/*begintime	日期	必须			开始时间*/}
                {/*endtime	日期	必须			结束时间*/}
                {/*serial	字符串	可选			商户单号*/}
                {/*payserial	字符串	可选			交易单号*/}

                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'serial'} label={'商户单号'} />
                <Form.Input field={'payserial'} label={'交易单号'} />
                <Button size="small" variant="outlined" type="submit">搜索</Button>
            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-09-25 08:29:36.560",
                        //     "sns": "大当家",
                        //     "ordertype": "SnsBusinessOrder",
                        //     "serial": "800120230925082920064427491",
                        //     "payserial": "4200001979202309252802388415",
                        //     "payment": "微信支付",
                        //     "paymentaccount": "微信支付(三燃液化气)",
                        //     "paytotal": "360.0000",
                        //     "exeresults": "OK",
                        //     "advanceorder": [],
                        //     "applyrefund": []
                        // }
                        {field: 'addtime', headerName: '添加时间'},
                        {field: 'sns', headerName: 'SNS'},
                        {field: 'ordertype', headerName: '订单类型'},
                        {field: 'serial', headerName: '商户单号'},
                        {field: 'payserial', headerName: '交易单号'},
                        {field: 'payment', headerName: '支付方式'},
                        {field: 'paymentaccount', headerName: '支付账户'},
                        {field: 'paytotal', headerName: '支付金额'},
                        {field: 'exeresults', headerName: '执行结果'},
                        {field: 'advanceorder', headerName: '预支付订单(双击显示详情)'},
                        {field: 'applyrefund', headerName: '申请退款信息(双击显示详情)'},

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    onCellDoubleClicked={e=>{
                        console.log(e.data)
                        // {
                        //     "addtime": "2023-09-24 10:39:48.337",
                        //     "sns": "大当家",
                        //     "ordertype": "SnsBusinessOrder",
                        //     "serial": "800120230924103940718777022",
                        //     "payserial": "4200001973202309247347464786",
                        //     "payment": "微信支付",
                        //     "paymentaccount": "微信支付(三燃液化气)",
                        //     "paytotal": "112.0000",
                        //     "exeresults": "OK",
                        //     "advanceorder": {
                        //     "addtime": "2023-09-24 10:39:40.917",
                        //         "serial": "800120230924103940718777022",
                        //         "type": "预约销售商品订单",
                        //         "memberid": "13077798470",
                        //         "payment": "微信支付",
                        //         "paymentstatus": "已支付",
                        //         "pay_time": "2023-09-24 10:39:48.000",
                        //         "cancel_time": null,
                        //         "cancel_department": "",
                        //         "cancel_operator": "",
                        //         "integrity": "",
                        //         "state": "已完成"
                        // },
                        //     "applyrefund": {
                        //     "addtime": "2023-09-24 11:04:07.797",
                        //         "serial": "800120230924103940718777022",
                        //         "sub_serial": "800220230924103940730372998",
                        //         "pay_time": "2023-09-24 00:00:00.000",
                        //         "pay_total": "112.0000",
                        //         "refund_fee": "110.0000",
                        //         "refundtime": "2023-09-24 11:15:07.000",
                        //         "return_msg": "{\"mchid\":\"1586841541\",\"out_trade_no\":\"800120230924103940718777022\",\"transaction_id\":\"4200001973202309247347464786\",\"out_refund_no\":\"800220230924103940730372998\",\"refund_id\":\"50301307182023092411930629789\",\"refund_status\":\"SUCCESS\",\"success_time\":\"2023-09-24T11:15:15+08:00\",\"amount\":{\"total\":11200,\"refund\":11000,\"payer_total\":11200,\"payer_refund\":11000},\"user_received_account\":\"支付用户零钱通\"}",
                        //         "return_time": "2023-09-24 11:15:21.000",
                        //         "state": "已完成"
                        // }
                        // }


                        Modal.info({
                            title: '详情',
                            content: <Box>
                                <Box
                                    p={1}
                                    border={1}
                                    fontSize={15}
                                >
                                    <Box fontSize={18} mb={1}>预支付订单</Box>
                                    <Box p={1} bgcolor={'#f8f8f8'} mt={1}>
                                    <Box>会员号: {e.data.advanceorder.memberid}</Box>
                                    <Box>下单时间: {e.data.advanceorder.addtime}</Box>
                                    <Box>支付单号: {e.data.advanceorder.serial}</Box>
                                    <Box>支付方式: {e.data.advanceorder.payment}</Box>
                                    <Box>支付状态: {e.data.advanceorder.paymentstatus}</Box>
                                    <Box>支付时间: {e.data.advanceorder.pay_time}</Box>
                                    <Box>取消时间: {e.data.advanceorder.cancel_time}</Box>
                                    <Box>取消部门: {e.data.advanceorder.cancel_department}</Box>
                                    <Box>取消操作员: {e.data.advanceorder.cancel_operator}</Box>
                                    <Box>完整性: {e.data.advanceorder.integrity}</Box>
                                    <Box>状态: {e.data.advanceorder.state}</Box>
                                    </Box>
                                </Box>
                                <Box
                                    p={1}
                                    border={1}
                                    mt={1}
                                    fontSize={15}
                                >
                                <Box fontSize={18} mb={1}>申请退款信息</Box>
                                    {
                                        e.data.applyrefund.map((item,index)=>
                                            <Box p={1} bgcolor={'#f8f8f8'} mt={1}>
                                                <Box>序号: {index+1}</Box>
                                                <Box>申请时间: {item.addtime}</Box>
                                                <Box>支付单号: {item.serial}</Box>
                                                <Box>子单号: {item.sub_serial}</Box>
                                                <Box>支付时间: {item.pay_time}</Box>
                                                <Box>支付总金额: {item.pay_total}</Box>
                                                <Box>退款金额: {item.refund_fee}</Box>
                                                <Box>退款执行时间: {item.refundtime}</Box>
                                                {/*<Box>退款信息: {item.return_msg}</Box>*/}
                                                <Box>退款确认时间: {item.return_time}</Box>
                                                <Box>状态: {item.state}</Box>
                                            </Box>

                                        )
                                    }


                                </Box>
                            </Box>,
                            footer: <></>,
                        })
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetUserSNSPayInfo;
