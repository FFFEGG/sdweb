import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import {
    Button,
    Box,
    Typography,
    Grid,
    IconButton,
    TextField,
    Autocomplete, ToggleButtonGroup, ToggleButton, DialogActions, Select
} from "@mui/material";
import request from "../../../utils/request";
import moment from "moment";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CachedIcon from '@mui/icons-material/Cached';
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import DetailCellRenderer from "./DetailCellRenderer";
import { Form, Modal, Popconfirm, Select as Selects } from "@douyinfe/semi-ui";
import * as assert from "assert";
import Table from 'rc-table';
import { getCode } from "../../../utils/getCode";
import translations from "../../../utils/translations";
import myprint from 'utils/myprint';
import { green } from '@mui/material/colors';
import {Link} from "react-router-dom";
// import {useHistory} from "react-router-dom";


const OrderList = (props) => {
    const AGgridRef = useRef()
    const { customization } = props
    const { register, handleSubmit, getValues } = useForm({
        defaultValues: {
            begintime: customization.begintime,
            endtime: customization.endtime,
        }
    })
    const [List, setList] = useState(customization.orderlist.list)
    const [DepdeliverymanList, setDepdeliverymanList] = useState(JSON.parse(localStorage.getItem('deliveryman')) || [])
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
    const floorapi = useRef()
    const [stateList,setstateList] = useState([])

    const getorderlist = async (data) => {
        const rews = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Other_Infos.GetSignInRecord',
            begintime: moment().format('YYYY-MM-DD'),
            endtime: moment().format('YYYY-MM-DD'),
            department: JSON.stringify([loginuser.login_department]),
        })
        rews.data.map(item => {
            var now = new Date() / 1000
            var t = new Date(item.addtime) / 1000
            item.color = (now - t < 20 * 60) ? 'green' : 'gray'

            return item
        })
        rews.data.sort((a, b) => {
            return new Date(b.addtime) - new Date(a.addtime)
        })

        setSignInRecord(rews.data)

        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Order_Infos.OrderList',
            distributionstore: JSON.stringify([JSON.parse(localStorage.getItem('userinfo')).login_department]),

            ...data,
            state: JSON.stringify(state)
        })

        rew.data.forEach((item) => {
            item.suborder.sort((a, b) => {
                // 检查每个商品名称是否包含"液化气"
                let aContainsGas = a.goodsname.includes("液化气");
                let bContainsGas = b.goodsname.includes("液化气");

                // 如果 a 和 b 都包含或者都不包含"液化气"，则它们的顺序不变
                if ((aContainsGas && bContainsGas) || (!aContainsGas && !bContainsGas)) {
                    return 0;
                }
                // 如果 a 包含"液化气"而 b 不包含，那么 a 应该排在前面，所以我们返回 -1
                else if (aContainsGas) {
                    return -1;
                }
                // 否则，b 应该排在前面，我们返回 1
                else {
                    return 1;
                }
            });
        });
        setList(rew.data)
        // rew.data 按照 item.suborder[0].state 分组 合计数量
        let arrs = {};
        rew.data.forEach(item => {
            let states = item.suborder[0].state;
            if (arrs[states]) {
                arrs[states].num += 1;
            } else {
                arrs[states] = { state: states, num: 1 };  // 先初始化 arrs[states] 为一个对象
            }
        });
        // console.log('arrs', arrs)

        setstateList(Object.values(arrs))


        let arr = new Set()
        rew.data.forEach(item => {
            if (item.suborder[0].deliveryman) {
                arr.add({
                    name: item.suborder[0].deliveryman,
                    opeid: item.suborder[0].deliveryman_opeid
                })
            }

        })
        setplsj(Array.from(arr))

        props.searchorder(data.begintime, data.endtime, state, rew.data)
    }

    // const defaultColDef = useMemo(() => ({
    //
    //     flex: 1
    // }), []);
    const scanhk = async (e) => {
        //去空格e.target.value
        let strs = e.target.value.replace(/\s*/g, "");

        const str = await getCode(strs)
        console.log('--------getCode-------', str)

        if (e.keyCode === 13) {

            codelist.push(`空-${str.code}`)
            parameter[indexs].recovery.push({
                code: str.code,
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
        // console.log('安排订单扫描',e)
        if (e.keyCode === 13) {
            let strs = e.target.value.replace(/\s*/g, "");
            const str = await getCode(strs)
            console.log('--------getCode-------', str)


            const arr = codelist?.filter(item => item === str.code)
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
    const [plshow, setplshow] = useState(false)
    const [plcodes, setplcodes] = useState([])
    const [plsj, setplsj] = useState([])
    const [nouescode, setnouescode] = useState([])
    const [plorderinfo, setplorderinfo] = useState([])
    //配送员订单列表
    const [deliverymanorderlist, setdeliverymanorderlist] = useState([])
    const plapi = useRef()
    const [isprint, setisprint] = useState(localStorage.getItem('isprint') || '打印订单')

    const plscan = async (e) => {
        if (e.keyCode === 13) {
            let strs = e.target.value.replace(/\s*/g, "");
            const str = await getCode(strs)
            console.log('--------getCode-------', str)
            setplcodes([...plcodes, str.code])
            plapi.current.setValue('plcode', '')
            setplcode('')
        }
    }
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
    const [canplhz, setcanplhz] = useState([])
    const plgridRef = useRef()
    const onSelectionChanged = useCallback(() => {
        const selectedRows = plgridRef.current.api.getSelectedRows();
        // console.log(selectedRows);
        setcanplhz(selectedRows)
    }, []);

    const [SignInRecord, setSignInRecord] = useState([])
    const [showSignInRecord, setShowSignInRecord] = useState(false)

    useEffect(async () => {

        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Other_Infos.GetSignInRecord',
            begintime: moment().format('YYYY-MM-DD'),
            endtime: moment().format('YYYY-MM-DD'),
            department: JSON.stringify([loginuser.login_department]),
        })
        rew.data.map(item => {
            var now = new Date() / 1000
            var t = new Date(item.addtime) / 1000
            item.color = (now - t < 20 * 60) ? 'green' : 'gray'
            return item
        })
        // 按照时间倒序排列
        rew.data.sort((a, b) => {
            return new Date(b.addtime) - new Date(a.addtime)
        })
        setSignInRecord(rew.data)
        // setShowSignInRecord(true)
    }, [])
    const [plcode,setplcode] = useState('')
    // const history = useHistory();
    return (
        <Box height="85vh" overflow={'scroll'}>
            {
                SignInRecord.map(item => <Box display={'inline-block'} color={'white'} padding={1} borderRadius={1} mr={1} mb={1} bgcolor={item.color}>{item.name}[{moment(item.addtime).format('HH:mm')}]</Box>)
            }
            <Box display="flex" alignItems="center" mb={2}>
                <div style={{width:0,height:0,overflow:"hidden",position:'fixed',top:0}}>
                    <input name="username" type="text"/>
                    <input name="password" type="password"/>
                </div>

                <TextField size="small" {...register('begintime')} type="date" />
                <TextField size="small" {...register('endtime')} type="date" />
                <Autocomplete
                    size="small"
                    multiple
                    id="multiple-limit-tags"
                    limitTags={2}
                    style={{ width: 300 }}
                    options={["正常", "已安排", "已接单", "已送达", "已收瓶"]}
                    // getOptionLabel={(item) => item.name}
                    defaultValue={state}
                    onChange={(_, data) => {
                        console.log(data)
                        if (data.length) {
                            // const arr = data.map(item=>item.opeid)
                            setstate(data)
                        }
                    }}
                    sx={{ width: '500px' }}
                    renderInput={(params) => <TextField {...params} label="订单状态" />}
                />
                <Button variant="outlined" size="small" onClick={handleSubmit(getorderlist)}
                        sx={{ ml: 2, p: 0.8 }}>刷新</Button>

                <Button variant="outlined" size="small" onClick={() => {
                    if (List.length === 0) {
                        toast.error('请先搜索订单')
                        return
                    }

                    setplshow(true)
                }}
                        sx={{ ml: 2, p: 0.8 }}>批量汇总</Button>
                {
                    stateList.length > 0 ?
                        <Box display={'flex'} ml={1} border={1} p={1} borderRadius={1} borderColor={'#eee'} bgcolor={'#fff'} >
                            {
                                stateList.map(item=>

                                    <Box>{item.state}:{item.num}</Box>
                                )
                            }
                        </Box>: ''
                }

                <Link to="/report/UnconfirmedCollectionRecord">
                    <Button variant="outlined" size="small" onClick={()=>{
                        // navigator('/report/UnconfirmedCollectionRecord')
                        // history.push('/report/UnconfirmedCollectionRecord')
                    }}
                            sx={{ ml: 2, p: 0.8 }}>未确认回款</Button>
                </Link>


                {/*
                <Button sx={{ ml: 2, p: 0.8 }} variant="outlined" size="small" onClick={async () => {
                    // Srapp.Web_Other_Infos.GetSignInRecord
                    // 获取手动签到记录
                    // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Other_Infos.GetSignInRecord
                    // POST
                    // 接口描述：

                    // 接口参数
                    // 参数名字	类型	是否必须	默认值	其他	说明
                    // begintime	日期	必须			开始时间
                    // endtime	日期	必须			结束时间
                    // department	字符串	可选			涉及部门(不传默认全部) JSON ["二区店","二桥店"]
                    // token	字符串	必须			token
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Other_Infos.GetSignInRecord',
                        begintime: moment().format('YYYY-MM-DD'),
                        endtime: moment().format('YYYY-MM-DD'),
                        department: JSON.stringify([loginuser.login_department]),
                    })
                    setSignInRecord(rew.data)
                    setShowSignInRecord(true)
                }}>获取签到记录</Button> */}
            </Box>
            <Modal title="签到记录" size="medium" visible={showSignInRecord} onCancel={() => setShowSignInRecord(false)} footer={<></>}>
                <Box height="40vh" overflow="scroll">
                    <AgGridReact
                        rowData={SignInRecord}
                        className='ag-theme-balham'
                        columnDefs={[
                            // {
                            //     "addtime": "2023-08-07 15:40:01.750",
                            //     "department": "鲤湾店",
                            //     "name": "邓洪武",

                            // }
                            { field: 'name', headerName: '姓名', flex: 1 },
                            { field: 'department', headerName: '部门', flex: 1 },
                            { field: 'addtime', headerName: '签到时间', flex: 1 },
                        ]}
                    />
                </Box>
            </Modal>
            <Modal size="full-width" title="批量汇总" visible={plshow} onCancel={() => {
                setCodes([])

                setnouescode([])
                setplcodes([])
                setplorderinfo([])
                setplshow(false)
                setplcodes([])
                setnouescode([])
                setplorderinfo([])
            }} footer={<></>}>
                <Box display={'flex'} height={'75vh'}>
                    <Box p={1} border={1} borderColor={'#ccc'} style={{ width: '40%' }}>
                        <Form getFormApi={e => plapi.current = e} labelPosition="inset">
                            <Form.Select onChange={e => {
                                setCodes([])
                                console.log(e);
                                setnouescode([])
                                setplcodes([])
                                setplorderinfo([])
                                //找到 订单列表中配送员opeid 与 选择的opeid相同的订单
                                const arr = List.filter(item => item.suborder[0].deliveryman_opeid === e)
                                console.log('对应的订单', arr)
                                setdeliverymanorderlist(arr)
                            }} rules={[
                                {
                                    required: true,
                                    message: '请选择配送员',
                                },
                            ]} label="请选择配送员" style={{ width: '100%' }} field="deliverymanopeid">
                                {
                                    plsj.map(item =>
                                        <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                                    )
                                }
                            </Form.Select>
                            <Form.Input helpText={'输入字符'+ plcode}  label="票据号或钢瓶码" field='plcode' onChange={e=>setplcode(e)}  type={'password'} name={'keycode3'} autocomplete="off" onKeyDown={(e) => plscan(e)} />

                            <Box height={'20vh'} overflow={'scroll'}>
                                <AgGridReact
                                    className='ag-theme-balham my-custom-cell-class'
                                    rowData={plcodes}
                                    columnDefs={[
                                        { headerName: '类型', valueGetter: ({ data }) => (data.length >= 16 && !isNaN(data)) ? '票据号' : '钢瓶码' },
                                        { headerName: '条码', valueGetter: ({ data }) => data },
                                        {
                                            headerName: '状态', valueGetter: ({ data }) => {
                                                let arr = []
                                                plorderinfo.forEach(item => {
                                                    arr.push(...item.usecode)
                                                })
                                                // console.log('arr', arr)
                                                if (arr.includes(data)) {
                                                    return '验证成功'
                                                }
                                                let arrs = Object.values(nouescode)
                                                return arrs?.includes(data) ? '验证失败' : '待验证'
                                            },
                                            cellStyle: (params) => params.value == '验证失败' ? { color: 'red' } : params.value == '验证成功' ? { color: 'green' } : { color: 'black' },

                                        },
                                        {
                                            headerName: '操作', cellRendererFramework: (data) => <Button onClick={() => {

                                                const newPlcodes = plcodes.filter((_, index) => index !== data.rowIndex);
                                                setplcodes(newPlcodes);
                                                setplorderinfo([])

                                            }} size="small" sx={{ padding: 0, margin: 0 }} variant="text">删除</Button>
                                        },
                                    ]}
                                    defaultColDef={{
                                        flex: 1
                                    }}

                                />
                            </Box>
                            <Box mb={1} height={'30vh'} overflow={'scroll'}>
                                <AgGridReact
                                    ref={plgridRef}
                                    className='ag-theme-balham my-custom-cell-class'
                                    rowData={plorderinfo}
                                    rowSelection="multiple"

                                    onSelectionChanged={onSelectionChanged}
                                    columnDefs={[
                                        {
                                            headerName: '可汇总订单', children: [
                                                { headerName: '类型', field: 'memberid', checkboxSelection: true, headerCheckboxSelection: true },
                                                { headerName: '姓名', field: 'name' },
                                                { headerName: '地址', field: 'address' },
                                                { headerName: '收现', field: 'pay_cash' },
                                                { headerName: '商品', field: 'goodsname' },
                                                { headerName: '数量', field: 'num' },

                                            ]
                                        },

                                    ]}
                                    defaultColDef={{
                                        flex: 1
                                    }}

                                />
                            </Box>

                            <Button onClick={async () => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Order_Infos.BatchCompleteTestInfo',
                                    deliverymanopeid: plapi.current.getValue('deliverymanopeid'),
                                    codes: JSON.stringify(plcodes),
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('汇总成功')
                                    // setplcodes([])
                                    // setplshow(false)
                                    handleSubmit(getorderlist)
                                } else {
                                    // toast.error(`操作失败 票据号或者钢瓶码${rew.data?.nouescode?.map(item => item).join(',')} 无法使用`)
                                    setnouescode(rew.data?.nouescode)
                                }
                                setplorderinfo(rew.data?.orderinfo)


                            }} type='button' variant="contained">验证条码</Button>

                            {
                                plorderinfo.length > 0 &&
                                <Button onClick={async () => {
                                    if (canplhz.length === 0) {
                                        return toast.error('请选择订单')
                                    }
                                    // [{"id":3,"payment":"现金支付","grant":[{"code":"1211"},{"code":"121121"}],"recovery":[{"code":"1211","weight":0,"reason":"余气原因：灶具问题"}]},{"id":4,"payment":"现金支付","grant":"","recovery":[{"code":"1211","weight":0,"reason":"灶具问题"}]}]
                                    const arr = canplhz.map(item => {
                                        return {
                                            id: item.id,
                                            payment: item.payment,
                                            grant: [],
                                            recovery: item.usecode.map(item => {
                                                return {
                                                    code: item,
                                                    weight: 0,
                                                    reason: ''
                                                }
                                            }),
                                        }
                                    })
                                    console.log('arr', arr)


                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Order_Handle.SalesClerkCompleteUserOrder',
                                        parameter: JSON.stringify(arr)
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('汇总成功')
                                        setplcodes([])
                                        setplshow(false)
                                        handleSubmit(getorderlist)

                                    } else {
                                        toast.error(`汇总失败 ${rew.data.tips}`)
                                        // window.location.reload()
                                    }

                                }} type='button' sx={{ ml: 3 }} variant="contained">确认汇总</Button>
                            }
                        </Form>
                    </Box>
                    <Box flex={1} ml={1}>

                        <Box height={'50%'} overflow={'scroll'}>
                            <AgGridReact
                                className='ag-theme-balham my-custom-cell-class'
                                rowData={deliverymanorderlist}
                                columnDefs={[

                                    {
                                        field: 'name', headerName: '配送员订单', children: [
                                            { field: 'addtime', headerName: '下单时间', },
                                            { field: 'name', headerName: '姓名', },
                                            { field: 'memberid', headerName: '卡号', },
                                            { field: 'address', headerName: '地址', },
                                            { field: 'telephone', headerName: '电话', },
                                            {
                                                field: 'goodsname', headerName: '商品', valueGetter: (params) => {
                                                    let str = ''
                                                    if (params.data) {
                                                        for (let i = 0; i < params.data.suborder.length; i += 1) {
                                                            str += (`${params.data.suborder[i].num}  * ${params.data.suborder[i].goodsname}`)

                                                        }
                                                    }
                                                    return str
                                                },
                                            }
                                        ]
                                    },

                                ]}
                                defaultColDef={{
                                    flex: 1,
                                    resizable: true
                                }}

                                onCellClicked={async e => {
                                    const arrs = e.data.suborder?.filter(item => item.state === '已安排')
                                    const rews = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Order_Infos.OrderDetails',
                                        serial_sale: e.data.suborder[0].serial_sale,
                                        ids: JSON.stringify(e.data.suborder.map(item => item.id)),
                                        state: '正常'
                                    })
                                    const OrderDetails = rews.data.suborder
                                    let arrcodes = []
                                    for (const i in OrderDetails) {
                                        if (Object.hasOwnProperty.call(OrderDetails, i)) {
                                            const element = OrderDetails[i];
                                            console.log('element.codes', element.codes)
                                            arrcodes.push(...element.codes)
                                            // arrcodes.push([...element.codes])
                                        }
                                    }
                                    console.log('arrcodes', arrcodes)
                                    setCodes(arrcodes)
                                }}

                            />
                        </Box>

                        <Box item sx={6} height={'50%'} overflow={'scroll'}>



                            <AgGridReact
                                className='ag-theme-balham my-custom-cell-class'
                                rowData={codes}
                                columnDefs={[
                                    {
                                        headerName: '用户票据号', children: [
                                            { field: 'department', headerName: '办理部门', width: 100 },
                                            { field: 'attribute', headerName: '属性', width: 100 },
                                            { field: 'code', headerName: '票号', width: 100 },
                                            { field: 'mode', headerName: '方式', width: 100 },
                                            { field: 'salesmethods', headerName: '模式', width: 100 },
                                            { field: 'num', headerName: '数量', width: 100 },
                                            // { field: 'state', headerName: '状态', width: 100 },
                                        ]
                                    },

                                ]}
                                defaultColDef={{
                                    flex: 1,
                                    resizable: true,
                                    sortable: true,
                                }}

                            />



                        </Box>

                    </Box>

                </Box>

            </Modal>

            <AgGridReact

                style={{ fontSize: '17px !important' }}
                ref={AGgridRef}
                defaultColDef={{
                    sortable: true, // 开启排序
                    resizable: true,
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                }}
                className="ag-theme-balham my-custom-cell-class"
                getRowStyle={params => {
                    if (params.data && params.data.suborder[0].state === '已安排') {
                        return { color: "red" }
                    }
                    if (params.data && params.data.suborder[0].state === '已送达') {
                        return { color: "blue" }
                    }

                    if (params.data && params.data.suborder[0].state === '已接单') {
                        return { color: "green" }
                    }

                    // 开户时间  params.data.suborder[0].accountopeningtime 2021-01-01 00:00:00 当天开户 显示橙色
                    if (params.data && params.data.suborder[0].accountopeningtime) {
                        const accountopeningtime = moment(params.data.suborder[0].accountopeningtime).format('YYYY-MM-DD')
                        const addtime = moment(params.data.suborder[0].addtime).format('YYYY-MM-DD')
                        if (accountopeningtime === addtime) {

                            return { color: "orange" }

                        }
                    }

                    return { color: "black" }
                }}

                columnDefs={[
                    {
                        field: 'addtime', headerName: '日期', enableRowGroup: true, hide: true,sortable:false,
                        valueGetter: data => data.data ? moment(data.data.addtime).format('MM-DD') : '',
                        width: 50

                    },
                    {
                        field: 'addtime', headerName: '下单时间', enableRowGroup: true,sortable:false,
                        valueGetter: data => data.data ? moment(data.data.addtime).format('MM-DD HH:mm') : '',
                        cellRenderer: 'agGroupCellRenderer',
                        width: 155
                    },
                    { field: 'remarks', headerName: '备注', enableRowGroup: true, width: 100 },
                    { field: 'ope_remarks', headerName: '内部备注', enableRowGroup: true, width: 100 },


                    {
                        field: 'appointmenttime', headerName: '预约上门时间', enableRowGroup: true,sortable:false,
                        valueGetter: data => data.data ? moment(data.data.appointmenttime).format('HH:mm') : '',
                        width: 80
                    },
                    {
                        field: 'arrangetime', headerName: '打印时间', enableRowGroup: true,sortable:false,
                        valueGetter: data => data.data ? moment(data.data.suborder[0].arrangetime).format('HH:mm') : '',
                        width: 80

                    },
                    {
                        field: 'id', headerName: '商品',
                        enableRowGroup: true,
                        valueGetter: (params) => {
                            let str = ''
                            if (params.data) {
                                for (let i = 0; i < params.data.suborder.length; i += 1) {
                                    let goodsname = ''
                                    if (params.data.suborder[i].goodsname.includes('液化气')) {
                                        goodsname = params.data.suborder[i].goodsname.substr(0,2)
                                    }
                                    else if (params.data.suborder[i].goodstype.includes('水')) {
                                        goodsname = params.data.suborder[i].goodsname
                                    }
                                    else if (params.data.suborder[i].goodstype != '液化气') {
                                        goodsname = params.data.suborder[i].goodstype
                                    }
                                    else {
                                        goodsname = '其他'
                                    }

                                    str += (`${params.data.suborder[i].num}X${goodsname} `)

                                }
                            }
                            return str.substring(0, str.length - 1)
                        },
                        width: 100
                    },
                    { field: 'memberid', headerName: '会员号', enableRowGroup: true, width: 120 },
                    { field: 'name', headerName: '联系人', enableRowGroup: true, width: 75 },
                    { field: 'telephone', headerName: '联系人电话', enableRowGroup: true, width: 120 },
                    { field: 'address', headerName: '地址', enableRowGroup: true, width: 150 },

                    {
                        field: 'deliveryman', headerName: '配送员', filter:'agSetColumnFilter', enableRowGroup: true,
                        valueGetter: params => params.data ? params.data.suborder[0].deliveryman : '',
                        width: 75
                    },
                    { field: 'booking_operator', headerName: '预约人', filter:'agSetColumnFilter', enableRowGroup: true, width: 75 },
                    { field: 'floor', headerName: '楼层', enableRowGroup: true, width: 40 },
                    {
                        field: 'payment',
                        headerName: '支付方式',
                        enableRowGroup: true,
                        valueGetter: params => params.data ? params.data.suborder[0].payment : '',
                        width: 110

                    },
                    {
                        field: 'suborder', enableRowGroup: true, headerName: '状态', valueGetter: (params) => {
                            if (params.data) {
                                return params.data.suborder[0].state
                            }
                            return ''
                        },
                        width: 100
                    },

                ]}
                masterDetail="true"
                // embedFullWidthRows="true"
                // detailRowAutoHeight="true"

                detailCellRendererParams={{
                    detailGridOptions: {
                        columnDefs: [
                            { field: 'distributionmode', headerName: '派单模式' },
                            { field: 'goodsname', headerName: '商品名称' },
                            { field: 'num', headerName: '数量' },
                            { field: 'total', headerName: '小计' },
                            { field: 'mode', headerName: '模式' },
                            { field: 'state', headerName: '子订单状态' },
                            {
                                headerName: '操作',
                                pinned: 'left',
                                cellRendererFramework: (data) => <Box>

                                    {
                                        data.data.state === '正常' ? <Button size="small" onClick={() => {

                                                const arrss = AGgridRef.current.props.rowData?.filter(item => item.serial_main === data.data.serial_sale)

                                                setorderData([data.data])
                                                setappointmenttime(arrss[0].appointmenttime)
                                                setmainorder(arrss[0])
                                                setopen(true)

                                                const datas = {
                                                    id: data.data.id,
                                                    grant: [],
                                                    recovery: [],
                                                }
                                                setparameter([datas])
                                            }}>安排</Button>
                                            : ''
                                    }
                                    {
                                        data.data.state !== '正常' && <Popconfirm style={{ width: 300 }} title="提示" content="确认操作?" onConfirm={async () => {

                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Order_Handle.ResetUserOrder',
                                                ids: JSON.stringify([data.data.id])
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('重置成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            getorderlist({
                                                begintime: customization.begintime,
                                                endtime: customization.endtime,
                                            })

                                            // handleSubmit(getorderlist)
                                        }}>
                                            <Button>重置订单</Button>
                                        </Popconfirm>
                                    }




                                </Box>
                            },
                        ],
                        defaultColDef: {
                            // flex: 1,
                            resizable: true,
                            fontsize: 20
                        },
                    },
                    getDetailRowData: (params) => {
                        console.log(AGgridRef)
                        params.successCallback(params.data.suborder);
                    },

                }}


                rowData={List}

                localeText={translations}
                rowGroupPanelShow="always"

                onCellClicked={async (params) => {
                    console.log('订单信息', params)
                    //获取用户抵押物信息
                    const rew = await request('post', '/api/getInfo', {
                        "begintime": "1999-01-01",
                        "endtime": moment().format('YYYY-MM-DD'),
                        "userid": params.data.userid,
                        "url": "Srapp.Web_User_Infos.UserPackingtypeWarehouse"
                    })
                    setCodes(rew.data)




                    const hzmode = params.data.suborder?.filter(item => item.distributionmode != '营业员派单')
                    if (hzmode.length !== 0 && hzmode[0].state === '已安排') {
                        toast.error('该订单不支持单条汇总,请检查派单模式')
                        return
                    }

                    if (params.colDef.headerName == '楼层') {
                        Modal.confirm({
                            title: '提示',
                            content: <Form getFormApi={e => floorapi.current = e} onSubmit={async edata => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Order_Handle.ChangeOrderInfo',
                                    floor: edata.floor,
                                    id: params.data.suborder[0].id
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('修改成功')
                                }
                                else {
                                    toast.error(`修改失败 ${rew.data.tips}`)
                                }
                                getorderlist({
                                    begintime: customization.begintime,
                                    endtime: customization.endtime,
                                })

                            }}>
                                <Form.Input label="楼层" field='floor' initValue={params.value} />
                            </Form>,
                            onOk: async () => {
                                floorapi.current.submitForm()
                                // const rew = await request('post', '/api/getInfo', {
                                //     url: 'Srapp.Web_Order_Handle.UpdateUserOrder',
                                //     id: params.data.id,
                                //     floor: params.value
                                // })
                                // if (rew.data.msg === 'SUCCESS') {
                                //     toast.success('修改成功')
                                // } else {
                                //     toast.error(`修改失败 ${rew.data.tips}`)
                                // }
                                // getorderlist({
                                //     begintime: customization.begintime,
                                //     endtime: customization.endtime,
                                // })
                            }
                        })

                        return
                    }

                    let orderlistap = params.data.suborder

                    if (!params.data) {
                        return;
                    }
                    const arr = params.data.suborder?.filter(item => item.state === '正常')
                    if (arr.length !== 0) {
                        setorderData(orderlistap)
                        setappointmenttime(params.data.appointmenttime)
                        setmainorder(params.data)
                        setopen(true)
                        if (params.data.suborder[0].salesmethods) {
                            setsalesmethods(params.data.suborder[0].salesmethods)
                        }

                        for (let i = 0; i < params.data.suborder.length; i += 1) {
                            parameter.push({
                                id: params.data.suborder[i].id,
                                grant: [],
                                recovery: [],
                            })
                            setparameter([...parameter])
                        }
                        return;
                    }

                    // 汇总
                    const arrs = params.data.suborder?.filter(item => item.state === '已安排')
                    const rews = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Order_Infos.OrderDetails',
                        serial_sale: params.data.suborder[0].serial_sale,
                        ids: JSON.stringify(params.data.suborder.map(item => item.id)),
                        state: '正常'
                    })
                    const OrderDetails = rews.data.suborder
                    let arrcodes = []
                    for (const i in OrderDetails) {
                        if (Object.hasOwnProperty.call(OrderDetails, i)) {
                            const element = OrderDetails[i];
                            console.log('element.codes', element.codes)
                            arrcodes.push(...element.codes)
                            // arrcodes.push([...element.codes])
                        }
                    }
                    console.log('arrcodes', arrcodes)
                    setCodes(arrcodes)
                    if (arrs.length !== 0) {
                        setorderData(orderlistap)
                        setappointmenttime(params.data.appointmenttime)
                        setmainorder(params.data)
                        sethzopen(true)

                        for (let i = 0; i < params.data.suborder.length; i += 1) {
                            parameter.push({
                                id: params.data.suborder[i].id,
                                payment: params.data.suborder[i].payment,
                                grant: [],
                                recovery: [],
                            })
                            setparameter([...parameter])
                        }
                        const initialValue = 0;
                        const sum = (params.data.suborder).reduce(
                            (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.pay_cash),
                            initialValue
                        )
                        setcash(sum)
                    }
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
                    <Box minWidth="75vw">
                        <Typography fontSize={20} fontWeight="bold">汇总订单</Typography>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid item xs={6}>
                                <Box border={2} borderRadius={2} borderColor="#ccc" p={2}>
                                    {

                                        moment(appointmenttime).isBefore(moment()) ?
                                            <Typography color="red" fontSize={18}> 预约上门时间
                                                : {moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss')} </Typography>
                                            :
                                            <Typography color="green" fontSize={18}> 预约上门时间
                                                : {moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss')} </Typography>

                                    }
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
                                <TextField type={'password'} name={'keycode4'} autocomplete="off" value={code} fullWidth onChange={event => setcode(event.target.value)}
                                           onKeyDown={(e) => scan(e)} size="small" label="钢瓶条码或者票据号" />
                                {code}
                                {



                                    codelist2.map((item, k) => <Box p={1} border={1} display={"flex"} justifyContent={"space-between"} borderColor="#ccc" marginTop={1}
                                                                    borderRadius={1}><Box>{item.code}</Box>

                                        {
                                            orderData[indexs].sellbykilogram == 1 ?
                                                <>

                                                    <input type="text" onChange={e => {
                                                        const weight = e.target.value
                                                        const index = item.k
                                                        parameter[index].recovery[k].weight = parseFloat(weight).toFixed(3)
                                                        setparameter(parameter)
                                                    }} placeholder="余气重量" />

                                                    <select placeholder={'余气原因'} onChange={e => {
                                                        const reason = e.target.value
                                                        const index = item.k
                                                        parameter[index].recovery[k].reason = reason
                                                        setparameter(parameter)
                                                    }}>
                                                        {
                                                            initData.CompanyInfo.appversion.gas_causes.map(item => <option value={item}>{item}</option>)
                                                        }
                                                    </select>
                                                </>




                                                : ''
                                        }

                                    </Box>)
                                }
                            </Grid>
                            <Grid item sx={6} height={'30vh'} width={'50%'} overflow={'scroll'}>



                                <AgGridReact
                                    className='ag-theme-balham'
                                    // rowData={codes.filter(item=>item.attribute != '包装物品')}
                                    rowData={codes}
                                    columnDefs={[
                                        { field: 'department', headerName: '办理部门', width: 100 },
                                        { field: 'attribute', headerName: '属性', width: 100 },
                                        { field: 'code', headerName: '票号', width: 100 },
                                        { field: 'mode', headerName: '方式', width: 100 },
                                        { field: 'salesmethods', headerName: '模式', width: 100 },
                                        { field: 'num', headerName: '数量', width: 100 },
                                    ]}
                                    defaultColDef={{
                                        flex: 1,
                                        resizable: true,
                                        sortable: true,
                                    }}

                                />



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
                                {

                                    moment(appointmenttime).isBefore(moment()) ?
                                        <Typography color="red" fontSize={18}> 预约上门时间
                                            : {moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss')} </Typography>
                                        :
                                        <Typography color="green" fontSize={18}> 预约上门时间
                                            : {moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss')} </Typography>

                                }
                                {/*<Typography color="red" fontSize={18}> 预约上门时间*/}
                                {/*    : {moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss')} </Typography>*/}
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

                                <TextField type="password" name={'keycode1'} autocomplete="off" value={code} fullWidth onChange={event => setcode(event.target.value)}
                                           onKeyDown={(e) => scan(e)} size="small" label="钢瓶条码" />

                                <div style={{borderBottom: 1}}>{code}</div>
                                {
                                    orderData[indexs]?.selfmention === '1' ?

                                        <div>
                                            <TextField type={'password'} name={'keycode2'} sx={{ mt: 1 }} autocomplete="off" value={hkcode} fullWidth onChange={event => sethkcode(event.target.value)}
                                                       onKeyDown={(e) => scanhk(e)} size="small" label="回空条码" />
                                            {hkcode}
                                            <Grid item sx={6} height={'30vh'} mt={3} width={'100%'} overflow={'scroll'}>



                                                <AgGridReact
                                                    className='ag-theme-balham'
                                                    rowData={codes}
                                                    columnDefs={[
                                                        { field: 'department', headerName: '办理部门', width: 100 },
                                                        { field: 'verificationmethod', headerName: '属性', width: 100 },
                                                        { field: 'billno', headerName: '票号', width: 100 },
                                                        { field: 'mode', headerName: '方式', width: 100 },
                                                        // { field: 'salesmethods', headerName: '模式', width: 100 },
                                                        { field: 'num', headerName: '数量', width: 100 },
                                                    ]}
                                                    defaultColDef={{
                                                        flex: 1,
                                                        resizable: true,
                                                        sortable: true,
                                                    }}

                                                />



                                            </Grid>
                                        </div>


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
                                <Box display="flex" alignItems="center" mt={1}>
                                    {/* <Autocomplete
                                        fullWidth
                                        disablePortal
                                        id="combo-box-demo"
                                        options={DepdeliverymanList}
                                        getOptionLabel={option => option?.name}
                                        size="small"
                                        onChange={(e, data) => {
                                            if (data) {
                                                setdeliverymanopeid(data?.opeid)
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
                                        setDepdeliverymanList([...rew.data.info])
                                        localStorage.setItem('deliveryman', JSON.stringify(rew.data.info))
                                    }} p={1} sx={{ marginTop: 1 }}>
                                        <CachedIcon />
                                    </IconButton> */}

                                    <Selects
                                        onChange={e => {
                                            console.log(e)
                                            setdeliverymanopeid(e)
                                        }}
                                        style={{ width: '100%', marginRight: 10, flex: 1, border: '1px solid #ccc' }} label="选择配送员" prefix="选择配送员" >
                                        {
                                            DepdeliverymanList.map(item =>
                                                <Selects.Option value={item.opeid}>{item.name}</Selects.Option>
                                            )
                                        }
                                    </Selects>
                                    <Box flex={1}>
                                        <Button onClick={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_SystemInfo.GetWorkDepdeliverymanList'
                                            })
                                            setDepdeliverymanList([...rew.data.info])
                                            localStorage.setItem('deliveryman', JSON.stringify(rew.data.info))
                                        }} variant="outlined">刷新配送员</Button>
                                    </Box>


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
                                <Box marginTop={1}>
                                    <ToggleButtonGroup
                                        color="primary"
                                        exclusive
                                        size="small"
                                        value={isprint}
                                        onChange={(e, data) => {
                                            // console.log(data)
                                            // setsalesmethods(data)
                                            // 记录是否打印 本地
                                            localStorage.setItem('isprint', data)
                                            setisprint(data)
                                        }}
                                    >
                                        <ToggleButton value="打印订单">打印订单</ToggleButton>
                                        <ToggleButton value="不打印">不打印</ToggleButton>

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

                                            if (isprint === '打印订单') {
                                                myprint(rew.data.printinfo)
                                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);

// export default OrderList;


