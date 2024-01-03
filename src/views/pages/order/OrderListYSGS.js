import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import {
    Button,
    Box,
    Typography,
    Grid,
    IconButton,
    TextField,
    Autocomplete, ToggleButtonGroup, ToggleButton, DialogActions
} from "@mui/material";
import request from "../../../utils/request";
import moment from "moment";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CachedIcon from '@mui/icons-material/Cached';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import DetailCellRenderer from "./DetailCellRenderer";
import {Collapse, Form, Modal, Notification, Popconfirm, Select, Toast, ToastFactory} from "@douyinfe/semi-ui";
import * as assert from "assert";
import Table from 'rc-table';
import { getCode } from "../../../utils/getCode";
import translations from "../../../utils/translations";
import './index.css'
import zIndex from '@mui/material/styles/zIndex';
import myprint from 'utils/myprint';

const OrderListYSGS = (props) => {
    const gridRef = useRef()
    const { customization } = props
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: customization.begintime,
            endtime: customization.endtime,
        }
    })

    const [List, setList] = useState(customization.orderlist.list)
    const [DepdeliverymanList, setDepdeliverymanList] = useState(JSON.parse(localStorage.getItem('deliveryman')))
    const [orderData, setorderData] = useState([])
    const [parameter, setparameter] = useState([])
    const [codelist, setCodeList] = useState([])
    const [codelist2, setCodeList2] = useState([])
    const [codes, setCodes] = useState([])
    const [appointmenttime, setappointmenttime] = useState('')
    const [mainorder, setmainorder] = useState('')
    const [indexs, setIndex] = useState(0)
    const [cash, setcash] = useState(0)
    const [code, setcode] = useState('')
    const [hkcode, sethkcode] = useState('')
    const [opens, setopen] = useState(false)
    const [state, setstate] = useState(customization.orderlist.state)

    const getorderlist = async (data) => {

        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Order_Infos.OrderList',
            distributionstore: JSON.stringify([JSON.parse(localStorage.getItem('userinfo')).login_department]),

            ...data,
            state: JSON.stringify(state)
        })

        let arr = rew.data
        let order_arr = [];
        for (let i = 0; i < arr.length; i++) {
            const order = arr[i];
            // let mainorder = array[i];
            let mainorder = JSON.parse(JSON.stringify(arr[i]));
            delete mainorder.suborder

            for (let j = 0; j < order.suborder.length; j++) {
                let suborder = order.suborder[j];
                suborder.mainorder = mainorder;
                order_arr.push(suborder)
            }

        }

        // console.log('--------getorderlist-------', order_arr)

        setList(order_arr)
        props.searchorder(data.begintime, data.endtime, state, order_arr)
    }

    const defaultColDef = useMemo(() => ({
        sortable: true, // 开启排序
        resizable: true,
        // filter: 'agTextColumnFilter',
        // floatingFilter: true,
        // flex: 1
    }), []);
    const scanhk = async (e) => {
        const str = await getCode(e.target.value)
        console.log('--------getCode-------', str)

        if (e.keyCode === 13) {

            codelist.push(`空-${str.code}`)
            parameter[indexs].recovery.push({
                code: e.target.value,
                weight: 0,
                reason: ''
            })
            setparameter([...parameter])
            setCodeList([...codelist])
            setCodeList2([...codelist])
            sethkcode('')
        }
    }

    const scan = async (e) => {
        if (e.keyCode === 13) {
            const str = await getCode(e.target.value)
            console.log('--------getCode-------', str)


            const arr = codelist.filter(item => item === str.code)
            console.log(parameter)
            let num = 0
            for (let i = 0; i < orderData.length; i += 1) {
                console.log(JSON.parse(orderData[i].salesmethods_mode).indexOf('周转销售(扫描)'))
                if (JSON.parse(orderData[i].salesmethods_mode).indexOf('周转销售(扫描)') !== -1 || JSON.parse(orderData[i].salesmethods_mode).indexOf('周转销售(不扫描)') !== -1) {
                    num += Number(orderData[i].num)
                }
            }

            if (arr.length === 0 && str.code !== '' && codelist.length < num) {
                codelist.push(str.code)
                codelist2.push({
                    k: indexs,
                    code: str.code
                })
                if (opens) {
                    parameter[indexs].grant.push({
                        code: str.code
                    })
                } else {
                    parameter[indexs].recovery.push({
                        code: str.code,
                        weight: 0,
                        reason: ''
                    })
                }
                setparameter([...parameter])
                setCodeList([...codelist])
                setcode('')
            } else {
                setcode('')
            }

        }
    }

    const [hzopen, sethzopen] = useState(false)

    const [distributionmode, setdistributionmode] = useState('营业员派单')
    const [salesmethods, setsalesmethods] = useState('周转销售(扫描)')
    const [deliverymanopeid, setdeliverymanopeid] = useState('')
    const [billnos, setbillnos] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [RowList, setRowlist] = useState([])

    useEffect(() => {
        if (!opens) {
            console.log(parameter)

            setparameter(parameter => {
                parameter.length = 0
                return parameter
            })
        } else {
            console.log(parameter)
        }
    }, [opens])

    useEffect(() => {
        if (!hzopen) {
            setCodeList([])
            setCodeList2([])
            setIndex(0)
            setparameter([])
        }
    }, [hzopen])


    const api = useRef(null);
    const orderapi = useRef(null);
    const serviceapi = useRef(null);

    const selectFilteredRows = () => {
        const gridApi = gridRef.current.api;

        // 获取过滤后的行节点
        const filteredNodes = [];



        gridApi.forEachNodeAfterFilter((node) => {
            filteredNodes.push(node);
        });

        // 选择过滤后的行节点
        filteredNodes.forEach((node) => {
            node.setSelected(!node.isSelected());
        });
    };


    const [show, setShow] = useState(false)
    const [serviceareaShow, setServiceareaShow] = useState(false)
    const [activeKey, setActiveKey] = useState('0')
    const [type, setType] = useState('')

    return (
        <Box height="85vh" overflow="scroll" p={2} borderRadius={1} bgcolor={'#fff'}>
            <Form getFormApi={e => api.current = e} labelPosition="left" style={{ marginBottom: 10 }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Order_Infos.OrderList',
                    distributionstore: JSON.stringify(['运输公司']),
                    ...e,
                    state: JSON.stringify(e.state)
                })

                let arr = rew.data
                let order_arr = [];
                if (e.customtype != '全部') {
                    if (e.customtype == '商业用户') {
                        arr = arr.filter(item => item.customertype_main.includes('商'))
                    } else {
                        arr = arr.filter(item => item.customertype_main === e.customtype)
                    }
                }


                for (let i = 0; i < arr.length; i++) {
                    const order = arr[i];
                    // let mainorder = array[i];
                    let mainorder = JSON.parse(JSON.stringify(arr[i]));
                    delete mainorder.suborder

                    for (let j = 0; j < order.suborder.length; j++) {
                        let suborder = order.suborder[j];
                        suborder.mainorder = mainorder;
                        order_arr.push(suborder)
                    }

                }

                // console.log('--------getorderlist-------', order_arr)

                setList(order_arr)
                props.searchorder(e.begintime, e.endtime, e.state, order_arr)
            }} onChange={e => {
                // console.log(e)
                const gridApi = gridRef.current.api;

                gridApi.deselectAll(); // 取消选择所有行
                const keywords = e.values?.keywords || '';

                gridRef.current.api.setQuickFilter(
                    keywords
                );
            }}>
                <Form.CheckboxGroup field='state' label="状态" direction='horizontal' initValue={['正常', '已安排']}  >
                    <Form.Checkbox value="正常">正常</Form.Checkbox>
                    <Form.Checkbox value="已安排">已安排</Form.Checkbox>
                    <Form.Checkbox value="已接单">已接单</Form.Checkbox>
                    <Form.Checkbox value="已送达">已送达</Form.Checkbox>
                    <Form.Checkbox value="已收瓶">已收瓶</Form.Checkbox>
                    <Form.Checkbox value="取消">取消</Form.Checkbox>
                </Form.CheckboxGroup>
                <Form.RadioGroup field='customtype' label="用户类型" initValue={'全部'}>
                    <Form.Radio value="全部">全部</Form.Radio>
                    <Form.Radio value="商业用户">商业用户</Form.Radio>
                    <Form.Radio value="代销用户">代销用户</Form.Radio>
                </Form.RadioGroup>
                <Box display="flex" >
                    <Button color="primary" type="submit" size="small" variant="outlined" sx={{ mr: 1 }}>刷新/搜索</Button>
                    <Button color="error" onClick={async () => {
                        if (RowList.length == 0) {
                            toast.error('请先选择订单')
                            return
                        }

                        setShow(true)
                        // console.log(RowList)
                    }} size="small" sx={{ mr: 1 }} variant="outlined">批量安排</Button>

                    <Button color="error" onClick={async () => {
                        if (RowList.length == 0) {
                            toast.error('请先选择订单')
                            return
                        }

                        setServiceareaShow(true)
                        // console.log(RowList)
                    }} size="small" sx={{ mr: 1 }} variant="outlined">修改线路/排班/预排司机</Button>

                    <Button color="error" onClick={async () => {
                        if (RowList.length == 0) {
                            toast.error('请先选择订单')
                            return
                        }

                        Modal.confirm({
                            title: '提示',
                            content: '确定要重置订单吗？',
                            onOk: async () => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Order_Handle.ResetUserOrder',
                                    ids: JSON.stringify(RowList.map(item => item.id))
                                })

                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('重置一条成功')
                                } else {
                                    toast.error(`重置失败 ${rew.data.tips}`)
                                }
                                api.current.submitForm()
                                if (i === RowList.length - 1) {
                                    toast.success('重置完成')
                                    api.current.submitForm()
                                }

                            }

                        })

                        // console.log(RowList)
                    }} size="small" sx={{ mr: 1 }} variant="outlined">重置订单</Button>

                    <Button color="primary" onClick={selectFilteredRows} size="small" sx={{ mr: 1 }} variant="outlined">全选</Button>

                    <Form.Input noLabel type="date" field='begintime' initValue={customization.begintime} />
                    <Form.Input noLabel type="date" field='endtime' initValue={customization.endtime} />
                    <Form.Input noLabel type="text" field='keywords' placeholder="任意关键词搜索" />

                </Box>
            </Form>


            <Modal title="修改线路/排班/预排司机" visible={serviceareaShow} onOk={() => serviceapi.current.submitForm()} onCancel={() => setServiceareaShow(false)}>
                <Form getFormApi={e => serviceapi.current = e} onSubmit={async e => {


                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Order_Handle.ChangeOrderOtherInfo',
                        ids: JSON.stringify(RowList.map(item => item.id)),
                        ...e,
                        type: e.type == '线路自定义' ? '线路' : e.type
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        // console.log('修改成功')
                        toast.success('修改成功')
                        // Notification.success({
                        //     title: '修改成功',
                        // })
                    } else {
                        // console.log('修改失败')
                        toast.error(`修改失败 ${rew.data.tips}`)
                        // Notification.error({
                        //     title: '修改失败',
                        //     description: rew.data.tips
                        // })
                    }
                    setServiceareaShow(false)
                    api.current.submitForm()

                }}>
                    <Form.Select field='type' label="类型" rules={[
                        { required: true, message: '必填' }
                    ]} filter style={{ width: '100%', marginBottom: 10 }} onChange={e => {
                        setType(e)
                        serviceapi.current.setValue('value', '')
                    }}>
                        <Form.Select.Option value="上下午区分">上下午区分</Form.Select.Option>
                        <Form.Select.Option value="线路">线路</Form.Select.Option>
                        <Form.Select.Option value="线路自定义">线路自定义</Form.Select.Option>
                        <Form.Select.Option value="预排配送">预排配送</Form.Select.Option>
                    </Form.Select>

                    {
                        type === '上下午区分' &&
                        <Form.Select field='value' rules={[
                            { required: true, message: '必填' }
                        ]} label="上下午区分" filter style={{ width: '100%' }}>

                            <Form.Select.Option value="上午">上午</Form.Select.Option>
                            <Form.Select.Option value="下午">下午</Form.Select.Option>
                            <Form.Select.Option value="顶班">顶班</Form.Select.Option>
                        </Form.Select>

                    }
                    {
                        type === '线路自定义' &&
                        <Box>

                            <Form.Input field='value' rules={[
                                { required: true, message: '必填' }
                            ]} label="线路" filter style={{ width: '100%' }} />
                        </Box>
                    }
                    {
                        type === '线路' &&
                        <Box>
                            <Form.Select label="线路" style={{ width: '100%' }} filter field='value' >

                                <Form.Select.Option value="A1">A1</Form.Select.Option>
                                <Form.Select.Option value="A3">A3</Form.Select.Option>
                                <Form.Select.Option value="B1">B1</Form.Select.Option>
                                <Form.Select.Option value="B2">B2</Form.Select.Option>
                                <Form.Select.Option value="B3">B3</Form.Select.Option>
                                <Form.Select.Option value="B4">B4</Form.Select.Option>
                                <Form.Select.Option value="C1">C1</Form.Select.Option>
                                <Form.Select.Option value="C2">C2</Form.Select.Option>
                                <Form.Select.Option value="C3">C3</Form.Select.Option>
                                <Form.Select.Option value="C5">C5</Form.Select.Option>
                                <Form.Select.Option value="C6">C6</Form.Select.Option>
                                <Form.Select.Option value="E1">E1</Form.Select.Option>
                                <Form.Select.Option value="E3">E3</Form.Select.Option>
                                <Form.Select.Option value="E4">E4</Form.Select.Option>
                                <Form.Select.Option value="E5">E5</Form.Select.Option>
                                <Form.Select.Option value="D1">D1</Form.Select.Option>
                                <Form.Select.Option value="D2">D2</Form.Select.Option>
                                <Form.Select.Option value="D3">D3</Form.Select.Option>
                                <Form.Select.Option value="D4">D4</Form.Select.Option>
                                <Form.Select.Option value="坛洛">坛洛</Form.Select.Option>
                                <Form.Select.Option value="沙井">沙井</Form.Select.Option>
                                <Form.Select.Option value="明阳">明阳</Form.Select.Option>
                                <Form.Select.Option value="长塘">长塘</Form.Select.Option>
                                <Form.Select.Option value="三塘">三塘</Form.Select.Option>
                                <Form.Select.Option value="接驳">接驳</Form.Select.Option>

                            </Form.Select>

                        </Box>
                    }
                    {
                        type === '预排配送' &&
                        <Form.Select field='value' rules={[
                            { required: true, message: '必填' }
                        ]} label="预排配送" filter style={{ width: '100%' }}>
                            {
                                initData.OperatorList.filter(item => item.department == loginuser.login_department).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>
                    }
                </Form>
            </Modal>


            <Modal
                size="large"
                title="批量安排/修改司机"
                visible={show}
                onCancel={() => {
                    setShow(false)
                    setActiveKey('0')
                }}
                mask={false}
                maskClosable={false}
                okText='确认安排/修改'
                onOk={async () => {
                    orderapi.current.submitForm()
                }}

            >
                <Collapse accordion activeKey={activeKey}>
                    {
                        RowList.map((item, index) =>
                            <Collapse.Panel onClick={() => {
                                // console.log(k, e)
                                setActiveKey(index.toString())
                            }} key={item.id} header={`${item.goodsname} 数量:${item.num} 单价:${parseFloat(item.price).toFixed(2)} 小计:${parseFloat(item.total).toFixed(2)}`} itemKey={index.toString()}>
                                <p>会员号：{item.mainorder.memberid}</p>
                                <p>姓名：{item.mainorder.name} 电话：{item.mainorder.telephone}</p>
                                <p>地址：{item.mainorder.address}</p>
                                <p>备注：{item.mainorder.remarks}</p>
                                <p>内部备注：{item.mainorder.ope_remarks}</p>
                                <p>状态：{item.state}</p>
                            </Collapse.Panel>
                        )

                    }

                </Collapse>

                <Form
                    getFormApi={e => orderapi.current = e}
                    labelPosition="inset"
                    layout="horizontal"
                    style={{ marginTop: 10 }}
                    onSubmit={async e => {
                        console.log(e)
                        for (let i = 0; i < RowList.length; i++) {
                            const order = RowList[i];
                            setTimeout(async () => {
                                // const rew = await request('post', '/api/getInfo', {
                                //     url: 'Srapp.Web_Order.UpdateOrder',
                                //     data: {
                                //         id: order.id,
                                //         driver: e.driver,
                                //         print: e.print
                                //     }
                                // })
                                // console.log(rew)

                                if (order.state === '已安排') {
                                    // 重置订单
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Order_Handle.ResetUserOrder',
                                        ids: JSON.stringify([order.id])
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        // 安排订单
                                        const res = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_Order_Handle.ArrangeUserOrder',
                                            serial: order.mainorder.serial_main,
                                            parameter: JSON.stringify([
                                                {
                                                    id: order.id,
                                                    grant: [],
                                                    recovery: []
                                                }
                                            ]),
                                            distributionmode: '配送员接单',
                                            salesmethods: '周转销售(扫描)',
                                            deliverymanopeid: e.driver,
                                            userid: order.mainorder.userid
                                        })
                                        // toast.success('重置成功')
                                        if (res.data.msg === 'SUCCESS') {
                                            Notification.success({ content: `订单${order.id}安排成功`, zIndex: 9999999 })
                                        }

                                    }
                                } else {
                                    // 安排订单
                                    const res = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Order_Handle.ArrangeUserOrder',
                                        serial: order.mainorder.serial_main,
                                        parameter: JSON.stringify([
                                            {
                                                id: order.id,
                                                grant: [],
                                                recovery: []
                                            }
                                        ]),
                                        distributionmode: '配送员接单',
                                        salesmethods: '周转销售(扫描)',
                                        deliverymanopeid: e.driver,
                                        userid: order.mainorder.userid
                                    })
                                    // toast.success('重置成功')
                                    if (res.data.msg === 'SUCCESS') {
                                        Notification.success({ content: `订单${order.id}安排成功`, zIndex: 9999999 })
                                    } else {
                                        Notification.error({ content: `安排失败${res.data.tips}`, zIndex: 9999999 })
                                    }

                                    if (res.data.printinfo && orderapi.current.getValue('print').includes('打印机打印')) {
                                        myprint(res.data.printinfo)
                                    }
                                }





                                setActiveKey((i).toString())
                                if (i === RowList.length - 1) {
                                    setShow(false)

                                    api.current.submitForm()
                                }

                            }, i * 4000)

                        }

                    }}
                >
                    <Form.Select
                        trigger='blur'
                        field='driver'
                        size="large"
                        filter
                        label="司机"
                        style={{ width: 200 }}
                        rules={[
                            { required: true, message: '请选择司机' },
                        ]}
                    >
                        {
                            DepdeliverymanList?.map(item => <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.CheckboxGroup size="small" type="card" direction="horizontal" label="打印" field='print' initValue={['打印机打印']}>
                        <Form.Checkbox value="打印机打印">打印机打印</Form.Checkbox>
                        <Form.Checkbox value="飞鹅打印">飞鹅打印</Form.Checkbox>
                    </Form.CheckboxGroup>

                    <Button color="error" sx={{ height: 36 }} variant="outlined" onClick={async () => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemInfo.GetWorkDepdeliverymanList'
                        })
                        setDepdeliverymanList([...rew.data.info])
                        localStorage.setItem('deliveryman', JSON.stringify(rew.data.info))
                    }}>刷新司机列表</Button>
                </Form>

            </Modal>


            <AgGridReact
                ref={gridRef}
                defaultColDef={defaultColDef}
                className="ag-theme-balham"
                // enableCellTextSelection={true}
                // ensureDomOrder={true}
                // enableRangeSelection="true"
                // suppressMultiRangeSelection="true"
                isRowSelectable={data => data.data.state === '正常' || data.data.state === '已安排' || data.data.state === '已接单' || data.data.state === '已送达'}
                getRowStyle={params => {
                    // 获取明天00:00时间戳
                    const tomorrow = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
                    if (params.data && params.data.state === '正常' && (new Date(params.data.mainorder.appointmenttime).getTime() >= tomorrow)) {
                        return { color: "green" }
                    }

                    if (params.data && params.data.state === '正常' && params.data.notice == 1) {
                        return { color: "#8442f9" }
                    }

                    if (params.data && params.data.state === '已安排') {
                        return { color: "red" }
                    }
                    if (params.data && params.data.state === '已送达') {
                        return { color: "blue" }
                    }

                    if (params.data && params.data.state === '已接单') {
                        return { color: "darkorange" }
                    }


                    if (params.data && params.data.state === '取消') {
                        return { color: "pink" }
                    }
                    return { color: "black" }
                }}
                onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                columnDefs={[


                    {
                        field: 'mainorder.memberid', headerName: '会员号', enableRowGroup: true,
                        checkboxSelection: true,
                        // headerCheckboxSelection: true,
                    },
                    { field: 'mainorder.customertype_main', headerName: '用户类型', enableRowGroup: true },
                    {
                        field: 'mainorder.addtime', headerName: '送气日期', enableRowGroup: true,
                        valueGetter: data => data.data ? moment(data.data.mainorder.appointmenttime).format('YYYY-MM-DD') : '',

                    },

                    {
                        field: 'mainorder.appointmenttime', headerName: '时间', enableRowGroup: true,
                        valueGetter: data => data.data ? moment(data.data.mainorder.appointmenttime).format('HH:mm') : ''
                    },
                    { field: 'goodsname', headerName: '规格', enableRowGroup: true },
                    { field: 'num', headerName: '数量', enableRowGroup: true },

                    { field: 'mainorder.name', headerName: '姓名', enableRowGroup: true },
                    { field: 'pay_cash', headerName: '现金支付', enableRowGroup: true },
                    { field: 'mainorder.workplace', headerName: '单位', enableRowGroup: true },
                    { field: 'mainorder.address', headerName: '地址', enableRowGroup: true },

                    { field: 'mainorder.remarks', headerName: '送气备注', enableRowGroup: true },
                    { field: 'mainorder.ope_remarks', headerName: '内部备注', enableRowGroup: true },
                    { field: 'line', headerName: '线路', enableRowGroup: true },
                    { field: 'timedivision', headerName: '排班时间', enableRowGroup: true },
                    {
                        field: 'mainorder.deliveryman', headerName: '司机',filter:'agSetColumnFilter', enableRowGroup: true,
                        valueGetter: params => params.data ? params.data.deliveryman : ''
                    },
                    {
                        field: 'accepttime', headerName: '接单时间', enableRowGroup: true, hide: true,
                        valueGetter: data => data.data.accepttime ? moment(data.data.accepttime).format('HH:mm') : ''
                    },
                    { field: 'operator', headerName: '打印人', enableRowGroup: true },
                    {
                        field: 'arrangetime', headerName: '打印时间', enableRowGroup: true,
                        valueGetter: data => data.data.arrangetime ? moment(data.data.arrangetime).format('HH:mm') : ''
                    },
                    { field: 'state', headerName: '状态', enableRowGroup: true },
                    { field: 'mainorder.booking_operator', headerName: '预约员',filter:'agSetColumnFilter', enableRowGroup: true },
                    { field: 'mainorder.source', headerName: '类型', enableRowGroup: true },
                    { field: 'cancel_remarks', headerName: '取消原因', enableRowGroup: true },

                ]}
                rowSelection="multiple"
                embedFullWidthRows="true"
                detailRowAutoHeight="true"
                onCellDoubleClicked={e => {
                    console.log(e)
                }}
                // excludeHiddenColumnsFromQuickFilter="true"
                rowData={List}
                localeText={translations}
                onSelectionChanged={(data) => {
                    // console.log(data.api.getSelectedRows())
                    setRowlist(data.api.getSelectedRows())
                }}


            />



            { /* 汇总订单 */}
            <Dialog
                open={hzopen}
                onClose={() => {
                    sethzopen(false)
                }}
                maxWidth="none"
            >
                <DialogContent p={2}>
                    <Box minWidth="60vw">
                        <Typography fontSize={20} fontWeight="bold">汇总订单</Typography>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid item xs={6}>
                                <Box border={2} borderRadius={2} borderColor="#ccc" p={2}>
                                    <Typography marginTop={1}
                                    > 会员号：{mainorder.memberid} 姓名：{mainorder.name} </Typography>
                                    <Typography marginTop={1}> 电话：{mainorder.telephone}</Typography>
                                    <Typography marginTop={1}> 地址：{mainorder.address}</Typography>
                                    <Typography marginTop={1}> 备注：{mainorder.remarks}</Typography>
                                    <Typography marginTop={1}> 内部备注：{mainorder.ope_remarks}</Typography>
                                    <Typography marginTop={1} fontWeight="bold" color="red" fontSize={20}> 合计收现金：{cash}</Typography>

                                </Box>
                                <Box>
                                    {
                                        orderData.map((item, index) => <Button
                                            onClick={() => {
                                                setIndex(index)
                                            }}
                                            sx={{
                                                mt: 1,
                                                justifyContent: 'left',
                                                borderColor: '#ccc',
                                                color: index === indexs ? '#f8f8f8' : '#444'
                                            }} fullWidth
                                            variant={index === indexs ? 'contained' : 'outlined'}>
                                            {item.goodsname} 数量:{item.num} 单价:{parseFloat(item.price)} 小计:{parseFloat(item.total)}
                                        </Button>
                                        )
                                    }
                                </Box>
                            </Grid>
                            <Grid item xs={6}>

                                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between"
                                    p={1} border={1}
                                    borderColor="#ccc" borderRadius={1} marginBottom={1}>
                                    <Box>合计数量: {codelist.length}</Box>
                                    <Button onClick={() => {
                                        setCodeList([])
                                        setCodeList2([])
                                        for (let i = 0; i < parameter.length; i += 1) {
                                            parameter[i].grant = []
                                            parameter[i].recovery = []
                                        }
                                        setparameter([...parameter])
                                    }} variant="outlined" size="small">清空</Button>
                                </Box>
                                <TextField value={code} fullWidth onChange={event => setcode(event.target.value)}
                                    onKeyDown={(e) => scan(e)} size="small" label="钢瓶条码或者票据号" />
                                {



                                    codelist2.map((item, k) => <Box p={1} border={1} display={"flex"} justifyContent={"space-between"} borderColor="#ccc" marginTop={1}
                                        borderRadius={1}><Box>{item.code}</Box>

                                        {
                                            orderData[indexs].sellbykilogram == 1 ?
                                                <input type="text" onChange={e => {
                                                    const weight = e.target.value
                                                    const index = item.k
                                                    parameter[index].recovery[k].weight = parseFloat(weight).toFixed(3)
                                                    setparameter(parameter)
                                                }} placeholder="余气重量" />
                                                : ''
                                        }

                                    </Box>)
                                }
                            </Grid>
                            <Grid item sx={6} >

                                <table >
                                    <tr>
                                        <td style={{ width: '100px' }}>可回空</td>
                                        <td style={{ width: '100px' }}>方式</td>
                                        <td style={{ width: '100px' }}>属性</td>
                                        <td style={{ width: '100px' }}>数量</td>
                                        {/*<td style={{width: '100px'}}>操作</td>*/}
                                    </tr>
                                    {
                                        codes.map(item => <tr >
                                            <td style={{ width: '100px' }}>{item.code}</td>
                                            <td style={{ width: '100px' }}>{item.mode}</td>
                                            <td style={{ width: '100px' }}>{item.salesmethods}</td>
                                            <td style={{ width: '100px' }}>{item.num}</td>
                                            {/*<td style={{width: '100px'}}>xxx</td>*/}
                                        </tr>)
                                    }

                                </table>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={async () => {
                        // console.log(parameter)
                        // return
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Order_Handle.SalesClerkCompleteUserOrder',
                            parameter: JSON.stringify(parameter)
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('汇总成功')
                        } else {
                            toast.error(`汇总失败 ${rew.data.tips}`)
                            // window.location.reload()
                        }
                        sethzopen(false)
                        setCodeList([])
                        setCodeList2([])
                        setIndex(0)
                        setparameter([])
                        console.log(rew)
                    }}>确认汇总</Button>

                </DialogActions>

            </Dialog>

            { /* 安排订单 */}
            <Dialog
                open={opens}
                onClose={() => {
                    setopen(false)
                    setparameter([])
                    setCodeList([])
                    setCodeList2([])
                    setIndex(0)
                    setsalesmethods('周转销售(扫描)')
                    setdistributionmode('营业员派单')
                }}
                p={3}
                maxWidth="none"
            >
                <DialogContent p={2}>
                    <Box minWidth="60vw">
                        <Typography fontWeight="bold" fontSize={20} color="black" marginBottom={3}>安排订单</Typography>
                        <Grid container>
                            <Grid item p={1} border={1} borderRadius={1} borderColor="#ccc" xs={6}>
                                <Typography color="red" fontSize={18}> 预约上门时间
                                    : {moment(appointmenttime).format('YYYY-MM-DD hh:mm:ss')} </Typography>
                                <Typography marginTop={1}
                                > 会员号：{mainorder.memberid} 姓名：{mainorder.name} </Typography>
                                <Typography marginTop={1}> 电话：{mainorder.telephone}</Typography>
                                <Typography marginTop={1}> 地址：{mainorder.address}</Typography>
                                <Typography marginTop={1}> 备注：{mainorder.remarks}</Typography>
                                <Typography marginTop={1}> 内部备注：{mainorder.ope_remarks}</Typography>

                            </Grid>
                            <Grid item paddingLeft={1} xs={6}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" p={1} border={1}
                                    borderColor="#ccc" borderRadius={1} marginBottom={1}>
                                    <Box>合计数量: {codelist.length}</Box>
                                    <Button onClick={() => {
                                        setCodeList([])
                                        setCodeList2([])
                                        for (let i = 0; i < parameter.length; i += 1) {
                                            parameter[i].grant = []
                                            parameter[i].recovery = []
                                        }
                                        setparameter([...parameter])
                                    }} variant="outlined" size="small">清空</Button>
                                </Box>
                                <TextField value={code} fullWidth onChange={event => setcode(event.target.value)}
                                    onKeyDown={(e) => scan(e)} size="small" label="钢瓶条码" />
                                {
                                    orderData[indexs]?.selfmention === '1' ? <TextField sx={{ mt: 1 }} value={hkcode} fullWidth onChange={event => sethkcode(event.target.value)}
                                        onKeyDown={(e) => scanhk(e)} size="small" label="回空条码" />
                                        : ''
                                }

                                {
                                    codelist.map(item => <Box p={1} border={1} borderColor="#ccc" marginTop={1}
                                        borderRadius={1}>{item}</Box>)
                                }

                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                {
                                    orderData.map((item, index) => <Button
                                        onClick={() => {
                                            setIndex(index)
                                        }}
                                        sx={{
                                            mt: 1,
                                            justifyContent: 'left',
                                            borderColor: '#ccc',
                                            color: index === indexs ? '#f8f8f8' : '#444'
                                        }} fullWidth
                                        variant={index === indexs ? 'contained' : 'outlined'}>
                                        {item.selfmention === '1' ? '[自提]' : ''}
                                        {item.goodsname} 数量:{item.num} 单价:{parseFloat(item.price)} 小计:{parseFloat(item.total)}
                                    </Button>
                                    )
                                }
                                <Box display="flex" alignItems="center">
                                    <Autocomplete
                                        fullWidth
                                        disablePortal
                                        id="combo-box-demo"
                                        options={DepdeliverymanList}
                                        getOptionLabel={option => option.name}
                                        size="small"
                                        onChange={(e, data) => {
                                            if (data) {
                                                setdeliverymanopeid(data.opeid)
                                            }
                                        }}
                                        sx={{ marginTop: 1 }}
                                        renderInput={
                                            (params) =>
                                                <TextField
                                                    {...params}
                                                    label="请选择配送员"
                                                />
                                        }

                                    />
                                    <IconButton onClick={async () => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_SystemInfo.GetWorkDepdeliverymanList'
                                        })
                                        setDepdeliverymanList([...rew.data.info, {
                                            name: '自提',
                                            opeid: '自提'
                                        }])
                                    }} p={1} sx={{ marginTop: 1 }}>
                                        <CachedIcon />
                                    </IconButton>

                                </Box>
                                <Box marginTop={1}>
                                    <ToggleButtonGroup
                                        color="primary"
                                        exclusive
                                        size="small"
                                        value={distributionmode}
                                        onChange={(e, data) => {
                                            // console.log(data)
                                            setdistributionmode(data)
                                        }}
                                    >
                                        <ToggleButton value="配送员接单">配送员接单</ToggleButton>
                                        <ToggleButton value="配送员抢单">配送员抢单</ToggleButton>
                                        <ToggleButton value="营业员派单">营业员派单</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Box marginTop={1}>
                                    <ToggleButtonGroup
                                        color="primary"
                                        exclusive
                                        size="small"
                                        value={salesmethods}
                                        onChange={(e, data) => {
                                            // console.log(data)
                                            setsalesmethods(data)
                                        }}
                                    >
                                        <ToggleButton value="周转销售(扫描)">周转销售(扫描)</ToggleButton>
                                        <ToggleButton value="周转销售(不扫描)">周转销售(不扫描)</ToggleButton>
                                        <ToggleButton value="代充销售">代充销售</ToggleButton>
                                        <ToggleButton value="快消品销售">快消品销售</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Box marginTop={3}>
                                    <Button onClick={async () => {
                                        // console.log(mainorder);
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_Order_Handle.ArrangeUserOrder',
                                            serial: mainorder.serial_main,
                                            parameter: JSON.stringify(parameter),
                                            distributionmode,
                                            salesmethods,
                                            deliverymanopeid,
                                            userid: mainorder.userid
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('安排成功')
                                            setopen(false)
                                            getorderlist({
                                                begintime: customization.begintime,
                                                endtime: customization.endtime,
                                            })
                                        } else {
                                            toast.error(rew.data.tips)
                                            setopen(false)
                                            getorderlist({
                                                begintime: customization.begintime,
                                                endtime: customization.endtime,
                                            })
                                        }
                                        setCodeList([])
                                        setCodeList2([])
                                        setIndex(0)
                                        setparameter([])
                                        console.log(rew);
                                    }} variant="contained">确认安排</Button>
                                </Box>
                            </Grid>

                        </Grid>


                    </Box>
                </DialogContent>

            </Dialog>


        </Box>

    );
};
const mapDispatchToProps = (dispatch) => {
    console.log('orderlist', dispatch)
    return {
        searchorder: (begintime, endtime, state, list) => dispatch({
            type: 'searchorder',
            begintime,
            endtime,
            orderlist: {
                state,
                list
            }
        })
    }
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps, mapDispatchToProps)(OrderListYSGS);

// export default OrderList;


