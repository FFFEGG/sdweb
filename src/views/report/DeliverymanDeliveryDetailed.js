import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import translations from "../../utils/translations";
import { toast } from 'react-toastify';

const DeliverymanDeliveryDetailed = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef()
    const api2 = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>工商用气调进出钢瓶明细表</Box>

            <Form getFormApi={e => api2.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.DeliverymanDeliveryDetailed',
                    ...e,
                    deliveryman: JSON.stringify(e.deliveryman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                {/* begintime	日期	必须			起始时间
                endtime	日期	必须			结束时间
                deliveryman	字符串	可选			配送员(不传默认全部) JSON ["张山","李四"]
                department	字符串	可选			服务部门(不传默认全部) JSON ["二区店","二桥店"]
                salesmethods	枚举类型	必须		范围：周转销售(扫描)/快消品销售	流转方式 */}
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field='deliveryman' label='配送员' multiple filter >
                    {
                        initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>

                <Form.Select field='salesmethods' label='流转方式' initValue={'周转销售(扫描)'} filter >
                    <Form.Select.Option value={'周转销售(扫描)'}>周转销售(扫描)</Form.Select.Option>
                    <Form.Select.Option value={'快消品销售'}>快消品销售</Form.Select.Option>
                </Form.Select>
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={[
                        // {
                        //     "id": "8055",
                        //     "addtime": "2023-07-13 00:00:00.000",
                        //     "serial": "800220230713155131333186555",
                        //     "department": "运输公司",
                        //     "deliveryman": "梁朝凯",
                        //     "memberid": "007007",
                        //     "salesman": "SY0011",
                        //     "workplace": "海边",
                        //     "address": "中山路119号",
                        //     "goodsname": "45KG液化气",
                        //     "num": "1.0",
                        //     "return_num": "0",
                        //     "billnum": "1.0",
                        //     "residual_air_weight": "0.0",
                        //     "residual_air_price": "8.2220"
                        // }
                        { headerName: '时间', field: 'addtime', },
                        // { headerName: '单号', field: 'serial', },
                        { headerName: '部门', field: 'department', },
                        { headerName: '配送员', field: 'deliveryman', },
                        { headerName: '会员号', field: 'memberid', },
                        { headerName: '业务员', field: 'salesman', },
                        { headerName: '单位', field: 'workplace', },
                        { headerName: '地址', field: 'address', },
                        { headerName: '商品名称', field: 'goodsname', },
                        { headerName: '数量', field: 'num', },
                        { headerName: '空瓶', field: 'return_num', cellStyle: { color: 'blue' } },
                        { headerName: '票据', field: 'billnum', },
                        { headerName: '余气量', field: 'residual_air_weight', },
                        { headerName: '余气量金额', field: 'residual_air_price', },


                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onCellDoubleClicked={async e => {
                        if (e.colDef.headerName != '空瓶' || api2.current.getValue('salesmethods') != '快消品销售') {
                            return
                        }
                        Modal.confirm({
                            title: '修改回空数量' + e.data.return_num,
                            content:

                                <Form getFormApi={es => api.current = es} onSubmit={async row => {
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_BusinessProcessing_Handle.UpdateFMCGUserSalesReturnNum',
                                        id: e.data.id,
                                        serial: e.data.serial,
                                        num: row.num
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('修改成功')

                                    } else {
                                        toast.error('修改失败' + rew.data.tips)
                                    }
                                }}>
                                    <Form.Input field={'num'} label={'回空数量'} type={'number'} initValue={e.data.return_num} />
                                </Form>,
                            onOk: async (e) => {
                                api.current.submitForm()
                            }
                        })

                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default DeliverymanDeliveryDetailed;
