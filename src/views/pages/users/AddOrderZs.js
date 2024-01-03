import React, { useEffect, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import {
    Autocomplete,
    Box,
    Button, FormControl,
    FormControlLabel,
    Grid,
    FormLabel,
    InputLabel, OutlinedInput,
    Radio,
    RadioGroup,
    TextField,
    Checkbox,
    Select,
    MenuItem,
    InputAdornment, FormGroup, Typography, Badge
} from "@mui/material";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'

import { useForm } from "react-hook-form";
import Addresslist from "./Addresslist"
import moment from 'moment';
import 'moment/locale/zh-cn';
import { toast } from 'react-toastify';
import initData from "../../initData";
import { Popconfirm, Table } from "@douyinfe/semi-ui";
import myprint from 'utils/myprint';

const AddOrderZs = ({ userinfo, setdepartment, department, tel }) => {

    const [GoodsList, setGoodsList] = useState([])
    const [DepartmentArr, setDepartmentArr] = useState([]);
    const [orderlist, setorderlist] = useState([]);
    const [appointmenttime, setappointmenttime] = useState(new Date())
    const [total, setTotal] = useState(0)
    const [cash, setCash] = useState(0)
    const [selfmention, setselfmention] = useState(false)
    const [packingtypechargelist, setpackingtypechargelist] = useState([])
    const [goodssalesmashuplist, setgoodssalesmashuplist] = useState([])
    const [goodswarehouselist, setgoodswarehouselist] = useState([])
    const [ServiceTypeid, setServiceTypeid] = useState(" ")
    const [address_info, setaddress_info] = useState('')
    const { register, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            payment: '现金支付',
            addressid: 0
        }
    });

    const [mode, setMode] = useState('维修')
    const [obj, setObj] = useState('灶具')
    const [wxremarks, setwxremarks] = useState('')
    // 现金支付
    const calculateOrderPriceByCash = () => {

        let totals = 0
        console.log(orderlist)
        for (let i = 0; i < orderlist.length; i += 1) {
            totals += (orderlist[i].price * orderlist[i].num)
        }
        console.log(totals)
        setTotal(parseFloat(totals).toFixed(2))
        setCash(parseFloat(totals).toFixed(2))
    }

    // 余额支付
    const calculateOrderPriceByBalance = () => {
        // 支付方式
        const payment = getValues('payment')

    }

    const calculateOrderPrice = () => {
        const payment = getValues('payment')
        if (payment === '现金支付') {
            calculateOrderPriceByCash()
        } else {
            calculateOrderPriceByBalance()
        }
    }

    useEffect(() => {
        const DepartmentList = JSON.parse(localStorage.getItem('initData')).DepartmentList
        const arr = []
        for (let i = 0; i < DepartmentList.length; i += 1) {
            arr.push({
                label: DepartmentList[i].name,
                value: DepartmentList[i].name,
            })
        }
        setDepartmentArr(arr)

        setValue('tel', tel)
        setValue('department', department)

    }, [userinfo, department, tel]);

    useEffect(() => {

        calculateOrderPrice()
    }, [orderlist])


    useEffect(async () => {
        if (!userinfo.userid) {
            return;
        }
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserGoodsDirectSalesInfo',
            userid: userinfo.userid,
            // customertype: userinfo.customertype,
            distributionstore: department
        })
        const goodslist = rew.data.goodslist
        // setGoodsList(rew.data.goodslist)

        for (let i = 0; i < goodslist.length; i += 1) {
            goodslist[i].payment = '现金支付'
            goodslist[i].mode = '商品直售'
        }
        setGoodsList(goodslist)
        setgoodswarehouselist(rew.data.goodswarehouselist)
        setorderlist([])
    }, [userinfo, department])


    // useEffect(() => {
    //     if (selfmention) {
    //         const arr = orderlist.map(item => {
    //             item.price = item.oldprice - item.servicefee
    //             return item
    //         })
    //         setorderlist([...arr])
    //     } else {
    //         const arr = orderlist.map(item => {
    //             item.price = item.oldprice
    //             return item
    //         })
    //         setorderlist([...arr])
    //     }
    //
    //
    // }, [selfmention])

    const [saleindex, setsaleindex] = useState(0)
    const initData = JSON.parse(localStorage.getItem('initData'))
    // console.log(initData)
    return (
        <Grid container sx={{
            mt: 2
        }}>
            <Grid item xs={12} md={6} sx={{
                paddingRight: { md: 2, xs: 0 },
                height: '80vh'
            }}>
                <Button size="small" color="secondary" sx={{ mr: 1, mb: 1 }} onClick={() => setsaleindex(0)}
                    variant={saleindex === 0 ? 'contained' : 'outlined'}>
                    商品直售
                </Button>

                <Button size="small" color="secondary" sx={{ mr: 1, mb: 1 }} onClick={() => setsaleindex(1)}
                    variant={saleindex === 1 ? 'contained' : 'outlined'}>
                    库存提货
                </Button>

                {
                    saleindex === 0 ? <Box marginTop={2} height="68vh" overflow={'scroll'}>
                        <AgGridReact
                            reactUi="true"
                            localeText={tanslations}
                            className="ag-theme-balham"
                            columnDefs={[
                                { field: 'name', headerName: '商品名' },
                                {
                                    field: 'marketprice',
                                    headerName: '市场价',
                                    valueGetter: (data) => parseFloat(data.data.marketprice).toFixed(2)
                                },
                                { field: 'price', headerName: '实际单价' },

                                { field: 'payment', headerName: '支付方式' },
                                {
                                    field: 'id', headerName: '操作', cellRendererFramework: (params) =>
                                        <div>
                                            <Button onClick={() => {
                                                const dataindex = orderlist.findIndex(item => (item.goodsid === params.data.goodsid && item.mode === '商品直售'))

                                                if (dataindex === -1) {
                                                    setorderlist(orderlist => [...orderlist, {
                                                        mode: params.data.mode,
                                                        relation: '',
                                                        goodsid: params.data.goodsid,
                                                        goodsname: params.data.name,
                                                        price: params.data.price,
                                                        servicefee: parseFloat(params.data.servicefee),
                                                        oldprice: params.data.price,
                                                        num: 1,
                                                        payment: params.data.payment
                                                    }])
                                                } else {
                                                    orderlist[dataindex].num = Number(orderlist[dataindex].num) + 1
                                                    setorderlist(orderlist => [...orderlist])
                                                }
                                                // 添加钢瓶费用
                                                for (let i = 0; i < packingtypechargelist.length; i += 1) {
                                                    for (let j = 0; j < packingtypechargelist[i].chargerecord.length; j += 1) {
                                                        // 判断是否存在
                                                        const gasbool = orderlist.findIndex(item => (item.mode === '费用缴纳' && item.goodsid === packingtypechargelist[i].chargerecord[j].id))
                                                        if (gasbool === -1) {
                                                            setorderlist(orderlist => [...orderlist, {
                                                                mode: '费用缴纳',
                                                                relation: '',
                                                                goodsname: packingtypechargelist[i].chargerecord[j].remarks + packingtypechargelist[i].chargerecord[j].project,
                                                                goodsid: packingtypechargelist[i].chargerecord[j].id,
                                                                price: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                oldprice: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                num: 1,
                                                                payment: params.data.payment
                                                            }])
                                                        }
                                                    }
                                                }


                                            }} size={"small"}>添加购物车</Button>
                                        </div>
                                }
                            ]}
                            defaultColDef={{
                                sortable: true, // 开启排序
                                resizable: true,
                                flex: 1,
                                filter: 'agTextColumnFilter',
                                floatingFilter: true,
                            }}
                            rowData={GoodsList}
                        />
                    </Box> : ''
                }
                {
                    saleindex === 1 ? <Box marginTop={2} height="80vh" overflow="scroll">
                        <AgGridReact
                            className="ag-theme-balham"
                            reactUi="true"
                            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                            rowData={goodswarehouselist}
                            columnDefs={[
                                { field: 'goodsname', headerName: '商品' },
                                {
                                    field: 'marketprice', headerName: '市场价格',
                                    valueGetter: data => data.data ? parseFloat(data.data.marketprice) : ''
                                },
                                {
                                    field: 'price', headerName: '实际单价',
                                    valueGetter: data => data.data ? parseFloat(data.data.price) : ''
                                },
                                { field: 'num', headerName: '数量' },
                                { field: 'paymentstatus', headerName: '支付状态' },

                                { field: 'salestype', headerName: '优惠方式' },
                                {
                                    field: 'goodsname',
                                    headerName: '操作',
                                    cellRendererFramework: (params) => <Button onClick={() => {
                                        const dataindex = orderlist.findIndex(item => (item.relation === params.data.id && item.mode === '库存提货直售'))

                                        if (dataindex === -1) {
                                            setorderlist(orderlist => [...orderlist, {
                                                mode: '库存提货直售',
                                                relation: parseInt(params.data.id),
                                                goodsid: params.data.goodsid,
                                                goodsname: params.data.goodsname,
                                                price: params.data.price,
                                                num: 1,
                                                payment: getValues('payment')
                                            }])
                                        } else {
                                            if (orderlist[dataindex].num < params.data.num) {
                                                orderlist[dataindex].num = Number(orderlist[dataindex].num) + 1
                                                setorderlist(orderlist => [...orderlist])
                                            }
                                            setorderlist(orderlist => [...orderlist])
                                        }
                                    }} size={"small"}>添加购物车</Button>
                                },
                            ]}
                            defaultColDef={{
                                resizable: true,
                                flex: 1
                            }}
                        />
                    </Box> : ''
                }
                {
                    saleindex === 2 ? <Box marginTop={2} height="80vh">{
                        goodssalesmashuplist.map(item =>
                            <Box marginBottom={2}>
                                <Box border={1} fontWeight="bold" fontSize={18} p={2} display="flex"
                                    justifyContent="space-between" alignItems="center">
                                    <span>{item.name} 合计 {parseFloat(item.price)}</span>
                                    <Button onClick={() => {
                                        const dataindex = orderlist.findIndex(items => (items.goodsid === item.id && items.mode === '预约办理商品捆绑销售方案'))

                                        if (dataindex === -1) {
                                            setorderlist(orderlist => [...orderlist, {
                                                mode: '预约办理商品捆绑销售方案',
                                                relation: '',
                                                goodsid: item.id,
                                                goodsname: item.name,
                                                price: item.price,
                                                num: 1,
                                                payment: getValues('payment')
                                            }])
                                        } else {
                                            orderlist[dataindex].num = Number(orderlist[dataindex].num) + 1
                                            setorderlist(orderlist => [...orderlist])
                                        }
                                    }}>添加购物车</Button>
                                </Box>
                                {
                                    item.detailed.map(
                                        items => <Box p={1} px={2} border={1} borderTop={0}>
                                            {items.goodsname} X {items.num} 小计 {items.price}
                                        </Box>
                                    )
                                }
                            </Box>
                        )
                    }</Box> : ''
                }
                {
                    saleindex === 3 ? (
                        <Box marginTop={2} height="80vh">
                            {
                                packingtypechargelist.map(item =>
                                    <Box>
                                        <Box p={2} border={1} borderColor="#ccc">
                                            <Box fontSize={16} fontWeight="bold">{item.name}</Box>
                                            <Box marginTop={1}
                                                color="#555">钢瓶类型: {item.packingtype} 办理时间: {item.addtime}</Box>
                                            <Box>使用时间: {moment(item.usetime).format('YYYY-MM-DD')} 计费时间: {moment(item.billingtime).format('YYYY-MM-DD')}</Box>
                                        </Box>
                                        {
                                            item.chargerecord.map((items, index) => (
                                                <Box p={1} px={2} borderBottom={1} borderLeft={1} borderRight={1}
                                                    borderColor="#ccc">{index + 1},
                                                    [{items.remarks}]  &nbsp;&nbsp;&nbsp;{items.project} &nbsp;&nbsp;&nbsp;{items.total} </Box>
                                            ))
                                        }

                                    </Box>
                                )
                            }
                        </Box>
                    ) : ''
                }
                {
                    saleindex === 4 ? <Box marginTop={2} height="80vh">
                        <Box p={2} border={1} marginBottom={2}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">模式</FormLabel>
                                <RadioGroup value={mode} onChange={(_, data) => {
                                    setMode(data)
                                }} row aria-label="gender" name="row-radio-buttons-group">
                                    <FormControlLabel value="维修" control={<Radio />} label="维修" />
                                    <FormControlLabel value="安检" control={<Radio />} label="安检" />
                                    <FormControlLabel value="预算" control={<Radio />} label="预算" />
                                    <FormControlLabel value="安装" control={<Radio />} label="安装" />
                                    <FormControlLabel value="验收" control={<Radio />} label="验收" />
                                    <FormControlLabel value="其他派工" control={<Radio />} label="其他派工" />
                                    <FormControlLabel value="热水器整改" control={<Radio />} label="热水器整改" />

                                </RadioGroup>
                            </FormControl>

                            <FormControl component="fieldset">
                                <FormLabel component="legend">对象</FormLabel>
                                <RadioGroup value={obj} onChange={(_, data) => {
                                    setObj(data)
                                }} row aria-label="gender" name="row-radio-buttons-group">
                                    <FormControlLabel value="灶具" control={<Radio />} label="灶具" />
                                    <FormControlLabel value="热水器" control={<Radio />} label="热水器" />
                                    <FormControlLabel value="钢瓶" control={<Radio />} label="钢瓶" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <TextField value={wxremarks} onChange={data => setwxremarks(data.target.value)} label="维修备注"
                            fullWidth sx={{ marginBottom: 2 }} />
                        <Button onClick={async () => {
                            const rew = await request('post', '/api/getInfo', {
                                url: ''
                            })
                        }} variant="contained">确认下单</Button>
                    </Box> : ''
                }
                {
                    saleindex === 5 ? <Box marginTop={2} height="80vh">
                        <Box padding={2} border={1} marginBottom={2}>
                            <FormControl sx={{ width: 0.5 }}>
                                <InputLabel id="demo-simple-select-label">方式 </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={ServiceTypeid}
                                    label="方式   "
                                    onChange={(_, data) => {

                                        setServiceTypeid(data.props.value)

                                    }}
                                >
                                    <MenuItem value=" ">请选择方式</MenuItem>
                                    {
                                        initData.ServiceTypeList.map(item => <MenuItem
                                            value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>

                            {/* <FormControl sx={{width: 0.5}}> */}
                            {/*    <InputLabel id="demo-simple-select-label">对象 </InputLabel> */}
                            {/*    <Select */}
                            {/*        labelId="demo-simple-select-label" */}
                            {/*        id="demo-simple-select" */}
                            {/*        value="钢瓶" */}
                            {/*        label="对象   " */}
                            {/*        onChange={() => { */}
                            {/*        }} */}
                            {/*    > */}
                            {/*        <MenuItem value="钢瓶">钢瓶</MenuItem> */}
                            {/*        <MenuItem value="用气环境">用气环境</MenuItem> */}
                            {/*        <MenuItem value="饮水机">饮水机</MenuItem> */}
                            {/*        <MenuItem value="水桶">水桶</MenuItem> */}
                            {/*    </Select> */}
                            {/* </FormControl> */}
                        </Box>
                        <TextField value={wxremarks} onChange={(data) => {
                            setwxremarks(data.target.value)
                        }} sx={{ marginBottom: 2 }} fullWidth label="门店业务备注" />
                        <Button onClick={async () => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.CreateUserOtherServicesOrder',
                                userid: userinfo.userid,
                                addressid: getValues('addressid'),
                                remarks: wxremarks,
                                appointmenttime: moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss'),
                                servicetypeid: ServiceTypeid,
                                department,
                                telephone: tel
                            })
                            if (rew.code === 200) {
                                toast.success('预约成功')
                            }
                        }} variant="contained">确认办理</Button>
                    </Box> : ''
                }

            </Grid>
            <Grid sx={{
                p: 2,
                border: "solid 1px #babfc7",
                verticalAlign: "baseline"
            }} item xs={12} md={6}
            >

                <Grid container>
                    <Grid item xs={12} sx={{
                        overflow: {
                            xs: "scroll",
                            md: "hidden"
                        }
                    }}>
                        <Table
                            pagination={false}
                            bordered
                            resizable
                            size="small"
                            columns={[
                                {
                                    title: '商品名称',
                                    dataIndex: 'goodsname'
                                },
                                {
                                    title: '数量',
                                    dataIndex: 'num',
                                    render: (text, record) => <input min="0" onChange={(e) => {
                                        if (record.mode === '库存提货直售') {
                                            return
                                        }
                                        const index = orderlist.findIndex(item => item === record)
                                        orderlist[index].num = e.target.value
                                        setorderlist([...orderlist])

                                    }} type="number" value={record.num} style={{ width: "50px" }} />

                                },
                                {
                                    title: '小计',
                                    dataIndex: 'total',
                                    render: (text, data) => data.num * data.price
                                },
                                {
                                    title: '支付方式',
                                    dataIndex: 'payment',
                                },
                                {
                                    title: '模式',
                                    dataIndex: 'mode',
                                },
                                {
                                    title: '操作',
                                    render(text, record) {
                                        return (
                                            <Button
                                                onClick={e => {
                                                    const index = orderlist.findIndex(item => item === record)
                                                    orderlist.splice(index, 1)
                                                    setorderlist([...orderlist])

                                                }}
                                                style={{
                                                    color: 'red'
                                                }}
                                                sx={{
                                                    p: 0
                                                }}
                                            >
                                                删除
                                            </Button>
                                        );
                                    }
                                },
                            ]} dataSource={orderlist} />
                        <Typography sx={{
                            bgcolor: 'lightgoldenrodyellow',
                            p: 2,
                            border: 'dashed 1px #ccc',
                            display: "flex"
                        }}>

                            合计 {total} 现金 {cash}

                            {/* <Typography color="red" marginLeft={2}>优惠券 -300</Typography> */}
                        </Typography>
                    </Grid>
                    <Grid container p={2} mt={1.3} sx={{
                        border: 'dashed 1px #ccc'
                    }}>


                        <Grid item xs={12} md={6}>
                            <p>支付方式</p>
                            <RadioGroup onChange={event => {
                                for (let i = 0; i < orderlist.length; i += 1) {
                                    if (orderlist[i].mode) {
                                        orderlist[i].payment = event.target.value
                                        setorderlist([...orderlist])
                                    }
                                }

                                for (let i = 0; i < GoodsList.length; i += 1) {
                                    GoodsList[i].payment = event.target.value
                                    setGoodsList([...GoodsList])
                                }


                            }} defaultValue="现金支付" row aria-label="gender" name="row-radio-buttons-group">
                                <FormControlLabel  {...register('payment')} value="现金支付" control={<Radio />}
                                    label="现金支付" />
                                <FormControlLabel  {...register('payment')} value="余额支付" control={<Radio />}
                                    label="余额支付" />
                            </RadioGroup>
                        </Grid>


                        <Grid item xs={12} mt={2}>
                            <Addresslist setaddress_info={setaddress_info} setdepartment={setdepartment} userinfo={userinfo} setValue={setValue} />
                        </Grid>

                        <Grid item xs={12} mt={2}>

                            <TextField
                                fullWidth
                                label="临时备注"
                                id="outlined-size-small"
                                size="small"
                                {...register('remarks')}

                            />
                        </Grid>
                        <Grid item xs={12} mt={2}>
                            <TextField
                                fullWidth
                                label="内部备注"
                                id="outlined-size-small"
                                size="small"
                                {...register('ope_remarks')}

                            />
                        </Grid>
                    </Grid>

                </Grid>
                <Popconfirm
                    title="提示"
                    content="确认操作？"
                    onConfirm={handleSubmit(async (data) => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_BusinessProcessing_Handle.GoodsDirectSales',
                            userid: userinfo.userid,
                            addressid: data.addressid,
                            remarks: data.remarks,
                            ope_remarks: data.ope_remarks,
                            goodsjson: JSON.stringify(orderlist),
                            total,
                        })
                        if (rew.data.msg === 'SUCCESS') {

                            toast.success('下单成功')
                            setorderlist([])
                            setselfmention(false)

                            if (rew.data.printinfo) {
                                myprint(rew.data.printinfo)
                            }
                        } else {
                            toast.error(`下单失败${rew.data.tips}`)
                        }
                        // console.log(rew)
                    })}>
                    <Button sx={{ mt: 2 }} variant="contained">确认下单</Button>
                </Popconfirm>


            </Grid>

        </Grid>
    );
};

export default AddOrderZs;
