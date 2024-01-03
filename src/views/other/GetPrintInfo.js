import React, { useMemo, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { Form, Table } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import myprint from 'utils/myprint';

const GetPrintInfo = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setlist] = useState([])

    const scroll = useMemo(() => ({ y: 300, x: 1200 }), []);
    const api = useRef()


    return (
        <Box bgcolor={'#fff'} borderRadius={1} p={3}>
            <Typography fontSize={18} fontWeight={"bold"}>订单打印列表</Typography>
            <Box mt={3}>
                <Form layout={"horizontal"} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Other_Infos.GetPrintInfo',
                        ...e
                    })
                    // 按照打印时间倒序
                    rew.data.sort((a, b) => {
                        return new Date(b.addtime) - new Date(a.addtime)
                    })


                    setlist(rew.data)
                    console.log(rew);
                }} onChange={e => {
                    const keywords = e.values?.keywords || ''
                    api.current.api.setQuickFilter(keywords)
                }}>
                    <Form.DatePicker initValue={moment().format('YYYY-MM-DD')} field={'begintime'} label={'开始时间'} />
                    <Form.DatePicker initValue={moment().format('YYYY-MM-DD')} field={'endtime'} label={'结束时间'} />
                    <Form.Input field='memberid' placeholder={'会员号'} label="会员号" />
                    <Box display={"flex"} alignItems={"end"}>
                        <Button size={"small"} variant={"contained"} type={"submit"}>搜索</Button>
                    </Box>

                </Form>
            </Box>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}

                    ref={api}
                    columnDefs={[
                        { headerName: '打印时间', autoHeight: true, field: 'addtime' },
                        { headerName: '类型', autoHeight: true, field: 'type' },
                        {
                            headerName: '会员信息', autoHeight: true, cellRendererFramework: ({ data }) => {
                                let userinfo = JSON.parse(data.userinfo) || {}
                                if (userinfo !== {}) {
                                    return <Box>
                                        <Box>卡号: {userinfo.memberid} 姓名: {userinfo.name}</Box>
                                        <Box>电话: {userinfo.telephone} </Box>
                                        <Box>地址: {userinfo.address} </Box>
                                        <Box>单位: {userinfo.workplace} </Box>
                                    </Box>
                                }
                                return <Box>无会员信息</Box>

                            }
                        },
                        {
                            headerName: '部门人员', autoHeight: true, cellRendererFramework: ({ data }) => {
                                let departmentinfo = JSON.parse(data.departmentinfo) || {}

                                if (departmentinfo !== {}) {
                                    return <Box>
                                        <Box>门店: {departmentinfo.department}</Box>
                                        <Box>配送员: {departmentinfo.deliveryman} </Box>
                                        <Box>操作员: {departmentinfo.operator} </Box>

                                    </Box>
                                }


                            }
                        },
                        {
                            headerName: '付款信息', autoHeight: true, cellRendererFramework: ({ data }) => {
                                let info = data.info || {}

                                if (info !== {}) {
                                    return <Box>

                                        <Box>账户余额: {info.balance}</Box>
                                        {/* <Box>微信支付: {info.pay_online} </Box>
                                        <Box>月结支付: {info.pay_arrears} </Box>
                                        <Box>优惠券支付: {info.pay_coupon} </Box>
                                        <Box>余额支付: {info.pay_balance} </Box> */}
                                        {parseFloat(info.pay_cash) > 0 && <Box>现金支付: {info.pay_cash} </Box>}
                                        {parseFloat(info.pay_online) > 0 && <Box>微信支付: {info.pay_pos} </Box>}
                                        {parseFloat(info.pay_arrears) > 0 && <Box>月结支付: {info.pay_pos} </Box>}
                                        {parseFloat(info.pay_coupon) > 0 && <Box>优惠券支付: {info.pay_coupon} </Box>}
                                        {parseFloat(info.pay_balance) > 0 && <Box>余额支付: {info.pay_balance} </Box>}


                                    </Box>
                                }


                            }
                        },
                        {
                            headerName: '商品信息', autoHeight: true, cellRendererFramework: ({ data }) => {
                                let goodslist = data?.info?.goodslist || []

                                return goodslist.map(item => {
                                    return <Box>
                                        <Box>模式: {item.mode}    </Box>
                                        <Box>商品名称: {item.goodsname}  </Box>

                                        <Box> 市场价: {item.price}数量: {item.num}  合计: {item.price}</Box>
                                    </Box>
                                })
                            }
                        },
                        { headerName: '备注', autoHeight: true, field: 'info.remarks' },
                        { headerName: '剩余信息', autoHeight: true, field: 'info.other_remarks', width: 100 },
                        { headerName: '操作', autoHeight: true, pinned: 'right', cellRendererFramework: ({ data }) => <Button onClick={() => myprint(data)} size="small">打印</Button> },

                    ]}
                    defaultColDef={{
                        // flex: 1,
                        sortable: true, // 开启排序
                        resizable: true,
                        // flex: 1,
                        filter: 'agTextColumnFilter', // 文本过滤器
                        floatingFilter: true, // 现在过滤器

                    }}
                    // onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    localeText={tanslations}
                />
            </Box>
        </Box>
    );
};

export default GetPrintInfo;
