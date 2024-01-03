import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal, Popconfirm, Table } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, TextField, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import translations from "../../utils/translations.json";
import axios from 'axios';



const ResidualAirRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [open, setopen] = useState(false)
    const [maindata, setmaindata] = useState(false)
    const api = useRef()
    const [attributiondepartment, setattributiondepartment] = useState([])
    const formapi = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>余气记录</Typography>
            <Form getFormApi={e => formapi.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.ResidualAirRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman),
                    department: e.department.length ? JSON.stringify(e.department) : ''
                })
                if (rew.data.info.length) {
                    for (let i = 0; i < rew.data.info.length; i++) {

                        for (let j = 0; j < rew.data.info[i].residualdetailed.length; j++) {
                            rew.data.info[i].residualdetailed[j].residual_air_price = rew.data.info[i].residual_air_price
                            rew.data.info[i].residualdetailed[j].payment = rew.data.info[i].payment

                        }
                        // { field: 'code', headerName: '钢瓶编码' },
                        // { field: 'weight', headerName: '重量' },
                        // { field: 'reason', headerName: '余气原因' },
                        // { headerName: '余气单价', valueGetter: ({ data }) => data.residual_air_price },
                        // { headerName: '余气合计', valueGetter: ({ data }) => (data.weight * data.residual_air_price).toFixed(2) },

                        // 合计residualdetailed
                        rew.data.info[i].residualdetailed.push({
                            payment: '合计',
                            weight: rew.data.info[i].residualdetailed.reduce((a, b) => a + b.weight, 0),
                            reason: '',
                            residual_air_price: parseFloat(rew.data.info[i].residual_air_price),
                        })
                    }
                }
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset" onChange={e => {
                const keywords = e.values?.keywords || ''
                api.current.api.setQuickFilter(
                    keywords
                );
            }}>
                <Form.Select field='type' label="类型" initValue={'销售余气'} style={{ width: 300 }}>
                    <Form.Select.Option value="销售余气">销售余气</Form.Select.Option>
                    <Form.Select.Option value="退瓶\存瓶余气">退瓶\存瓶余气</Form.Select.Option>
                </Form.Select>


                <Form.Select initValue={[loginuser.login_department]} clearIcon field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 300 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department.includes('商用')) ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select onChange={e => setattributiondepartment(e)} field='attributiondepartment' maxTagCount={1} multiple label="用户归属部门" filter style={{ width: 300 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='salesman' maxTagCount={1} multiple label="维护业务员" style={{ width: 300 }}>
                    {
                        initData.OperatorList.filter(item => {
                            if (attributiondepartment.length == 0) {
                                return true
                            }
                            return attributiondepartment.includes(item.department)
                        }).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='reason' showClear label="余气原因" style={{ width: 300 }}>
                    {initData.CompanyInfo.appversion.gas_causes.map(item =>

                        <Form.Select.Option value={item}>{item}</Form.Select.Option>
                    )}


                </Form.Select>


                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 300 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 300 }} />
                <Form.Input field='checkweight' initValue={0.5} label="大于等于数值" style={{ width: 300 }} />
                <Form.Input noLabel field='keywords' placeholder={'任意关键字查询'} style={{ width: 300 }} />
                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    alwaysShowHorizontalScroll={true}
                    alwaysShowVerticalScroll={true}
                    scrollbarWidth={10}
                    ref={api}
                    className="ag-theme-balham"
                    localeText={translations}
                    rowData={list}
                    columnDefs={[
                        { headerName: '商品', field: 'goodsname', cellRenderer: 'agGroupCellRenderer' },
                        { headerName: '部门', field: 'department', rowGroup: loginuser.login_department.includes('商用'), hide: loginuser.login_department.includes('商用') },


                        { headerName: '时间', field: 'addtime' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '交易数量', field: 'num' },
                        { headerName: '气价', field: 'price' },
                        { headerName: '余气单价', field: 'residual_air_price' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        { headerName: '业务员', field: 'salesman' },

                        { headerName: '配送员', field: 'deliveryman' },
                        {
                            headerName: '操作', width: 100, pinned: 'right', cellRendererFramework: ({ data }) => {
                                if (formapi.current.getValue('type') != '销售余气') {
                                    return <Button size='small' onClick={() => {
                                        console.log(data)
                                        let str = ''
                                        for (let i = 0; i < data.residualdetailed.length; i++) {
                                            if (data.residualdetailed[i].code == '合计') {
                                                continue
                                            }

                                            str += '瓶号: ' + data.residualdetailed[i].code + '  重量: ' + data.residualdetailed[i].weight + '  余气原因: ' + data.residualdetailed[i].reason + '\n' + '\n'

                                        }
                                        var jsonp = {
                                            title: "南宁三燃公司退余气单",
                                            time: moment().format('YYYY-MM-DD HH:mm:ss') + ' 订单号' + data.serial,
                                            Memo1: '姓名：' + data.username,
                                            Memo2: data.telephone,
                                            Memo3: '会员号: ' + data.memberid,
                                            Memo4: '地址: ' + data.address,
                                            Memo5: str + ',' + '合计金额：' + data.residual_air_total + '元',
                                            Memo6: '业务员' + data.salesman,
                                            Memo7: '用户签字：',
                                            Memo8: data.department,
                                            Memo9: '单位： ' + data.workplace,
                                            allinfo: data.recordinfo ? data.recordinfo : ''
                                        }
                                        var data_infop = {
                                            PrintData: jsonp,
                                            Print: true
                                        }
                                        axios.get('http://127.0.0.1:8000/api/print/order/10/?data=' + JSON.stringify(data_infop)).then(rew => {
                                            console.log(rew)
                                        })
                                    }}>打印</Button>
                                }
                                return ''
                            }
                        }

                    ]}
                    rowGroupPanelShow={loginuser.login_department.includes('商用') ? 'always' : 'never'}
                    masterDetail="true"
                    embedFullWidthRows="true"
                    // detailRowAutoHeight="true"
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        sortable: true,

                    }}
                    detailCellRendererParams={{
                        detailGridOptions: {
                            alwaysShowHorizontalScroll: true,
                            alwaysShowVerticalScroll: true,
                            columnDefs: [
                                { field: 'payment', headerName: '支付方式' },
                                { field: 'code', headerName: '钢瓶编码' },
                                { field: 'weight', headerName: '重量' },

                                { field: 'reason', headerName: '余气原因' },
                                { headerName: '余气单价', valueGetter: ({ data }) => data.residual_air_price },
                                { headerName: '余气合计', valueGetter: ({ data }) => (data.weight * data.residual_air_price).toFixed(2) },
                                {
                                    headerName: '操作', pinned: 'right', cellRendererFramework: ({ data }) => data.canupdate == 1 ? <Button onClick={() => {

                                        setmaindata(data)
                                        setopen(true)
                                    }} size={'small'} variant={'text'}>修改</Button> : ''
                                },
                            ],

                            defaultColDef: {
                                // flex: 1,
                                resizable: true,
                                sortable: true,
                            },
                        },
                        getDetailRowData: (params) => {
                            for (const paramsKey in params.data.residualdetailed) {
                                params.data.residualdetailed[paramsKey].userid = params.data.userid
                                params.data.residualdetailed[paramsKey].canupdate = params.data.canupdate
                            }
                            params.successCallback(params.data.residualdetailed);
                        },

                    }}
                />
            </Box>


            <Modal visible={open} onCancel={() => setopen(false)} footer={<></>}>
                <Box fontSize={18} mb={3}>修改余气</Box>
                <Form onSubmit={async (data) => {

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_BusinessProcessing_Handle.UpdateUserResidualGas',
                        materialid: maindata.id,
                        grant_serial: maindata.grant_serial,
                        code: maindata.code,
                        weight: data.weight,
                        userid: maindata.userid
                        // ...e,
                        // attributiondepartment: JSON.stringify(e.attributiondepartment),
                        // salesman: JSON.stringify(e.salesman),
                        // department: JSON.stringify(e.department)
                    })

                    //
                    // const rew = await request('post','/api/getInfo',{
                    //     url: 'Srapp.Web_BusinessProcessing_Handle.UpdateUserResidualGas',
                    //     materialid: maindata.id,
                    //     grant_serial: maindata.grant_serial,
                    //     code: maindata.code,
                    //     weight: data.weight,
                    //     userid: maindata.userid
                    // })
                    console.log(rew)
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('修改成功')
                        setopen(false)
                    } else {
                        toast.error('修改失败' + rew.data.tips)
                        setopen(false)
                    }

                    setmaindata('')

                }}>
                    <Box>条码: {maindata.code} 原余气重量: {maindata.weight}</Box>
                    <Form.Input initValue={maindata.weight} field={'weight'} label={'重量'} />
                    <Button variant={"contained"} type="submit">确认修改</Button>
                </Form>

            </Modal>


        </Box>
    );
};

export default ResidualAirRecord;
