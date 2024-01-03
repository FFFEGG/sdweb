import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal, Popconfirm } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";


const GetResidualGasToBeConfirmedRecord = () => {
    const [list, setlist] = useState([])
    const [data, setdata] = useState('')
    const [show, setshow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef(null)
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box mb={3} fontSize={18}>获取待确认退瓶存瓶余气记录</Box>
            <Form getFormApi={e => api.current = e} layout={"horizontal"} labelPosition={"inset"} onSubmit={async (e) => {
                console.log(e);
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetResidualGasOfStoreRefundRecord',
                    ...e
                })
                rew.data.map(item => {
                    item.residual_air_price_total = parseFloat(item.residualweight * item.residual_air_price).toFixed(2)
                })
                rew.data.push({
                    "receive_time": "合计",
                    residualweight: rew.data.reduce((a, b) => {
                        return a + parseFloat(b.residualweight)
                    }, 0).toFixed(4),
                    residual_air_price_total: rew.data.reduce((a, b) => {
                        return a + parseFloat(b.residual_air_price_total)
                    }, 0).toFixed(2)

                })
                setlist(rew.data)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field='type' label='类型' initValue={'待确认'}>
                    <Form.Select.Option value={'待确认'}>待确认</Form.Select.Option>
                    <Form.Select.Option value={'已确认'}>已确认</Form.Select.Option>
                </Form.Select>
                {/* 会员号查询 */}
                <Form.Input field={'memberid'} label={'会员号'} />
                <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>
            </Form>


            <Box height={'60vh'} overflow={"scroll"} mt={3}>
                <AgGridReact
                    rowData={list}
                    className="ag-theme-balham"
                    columnDefs={[

                        { field: 'receive_time', headerName: '收瓶时间' },
                        { field: 'code', headerName: '条码' },
                        { field: 'packingtype', headerName: '包装物' },
                        { field: 'saletime', headerName: '销售时间' },
                        { field: 'memberid', headerName: '会员号' },
                        { field: 'customertype', headerName: '用户类型' },
                        { field: 'attributiondepartment', headerName: '归属部门' },
                        { field: 'salesman', headerName: '业务员' },
                        { field: 'goodsname', headerName: '商品' },
                        { field: 'suttle', headerName: '净重' },
                        { field: 'price', headerName: '销售单价' },
                        { field: 'num', headerName: '销售数量' },
                        { field: 'residual_air_price', headerName: '余气单价' },
                        { field: 'residualweight', headerName: '余气重量' },
                        {
                            headerName: '余气总价', field: 'residual_air_price_total'

                        },
                        { field: 'grant_mode', headerName: '回收方式' },
                        { field: 'department', headerName: '部门' },
                        { field: 'deliveryman', headerName: '配送员' },

                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => api.current.getValue('type') == '待确认' &&
                                <Box>


                                    <Button onClick={() => {
                                        setshow(true)
                                        setdata(data)
                                        console.log(data)
                                    }}>确认余气</Button>

                                    <Button onClick={async () => {
                                        Modal.confirm({
                                            title: '提示',
                                            content: '是否确认销账处理',
                                            onOk: async () => {

                                                const rew = await request('post', '/api/getInfo', {

                                                    serial: data.serial,
                                                    materialid: data.materialid,
                                                    grant_serial: data.grant_serial,
                                                    userid: data.userid,
                                                    url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmUserRetreatResidualGas',
                                                    residualgastreatment: '销账处理'
                                                })
                                                if (rew.data.msg == 'SUCCESS') {
                                                    toast.success('成功')
                                                } else {
                                                    toast.error(`失败 ${rew.data.tips}`)
                                                }

                                                api.current.submitForm()
                                            }
                                        })

                                    }}>销账处理</Button>


                                </Box>
                        },
                    ]}
                    defaultColDef={{
                        //// flex: 1,
                        resizable: true,
                        sortable: true
                    }}
                />
            </Box>

            <Modal visible={show} onCancel={() => setshow(false)} footer={<></>} style={{ top: '20%' }}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        ...e,
                        serial: data.serial,
                        materialid: data.materialid,
                        grant_serial: data.grant_serial,
                        userid: data.userid,
                        url: 'Srapp.Web_BusinessProcessing_Handle.ConfirmUserRetreatResidualGas'
                    })
                    if (rew.data.msg == 'SUCCESS') {
                        toast.success('成功')
                    } else {
                        toast.error(`失败 ${rew.data.tips}`)
                    }
                    setshow(false)
                    setdata('')
                    api.current.submitForm()
                }}>
                    <Form.Select label={'余气款处理'} field={'residualgastreatment'}>
                        <Form.Select.Option value={'存入用户帐户'}>存入用户帐户</Form.Select.Option>
                        <Form.Select.Option value={'退现金'}>退现金</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field={'remarks'} label={'备注'} />
                    <Button variant={"contained"} type={"submit"}>确认</Button>
                </Form>
            </Modal>
        </Box>
    );
};

export default GetResidualGasToBeConfirmedRecord;
