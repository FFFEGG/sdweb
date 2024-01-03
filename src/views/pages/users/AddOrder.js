import React, { useEffect, useRef, useState } from 'react';
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

    TextField,
    Checkbox,
    Select,
    MenuItem,
    InputAdornment, FormGroup, Typography, Badge
} from "@mui/material";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import { set, useForm } from "react-hook-form";
import Addresslist from "./Addresslist"
import moment from 'moment';
import 'moment/locale/zh-cn';
import { toast } from 'react-toastify';
import initData from "../../initData";
import { Popconfirm, DatePicker, Table, Form, Modal, RadioGroup, Radio as Radios } from "@douyinfe/semi-ui";
import order from 'menu-items/order';
import copy from "copy-to-clipboard";
import DepartmentUserOrderInfo from 'views/department/DepartmentUserOrderInfo';

const AddOrder = ({ userinfo, setdepartment, department, tel }) => {

    const [GoodsList, setGoodsList] = useState([])
    const [DepartmentArr, setDepartmentArr] = useState([]);
    const [orderlist, setorderlist] = useState([]);
    const [appointmenttime, setappointmenttime] = useState(new Date(new Date().getTime() + 10 * 60000))
    const [total, setTotal] = useState(0)
    const [cash, setCash] = useState(0)
    const [balance, setbalance] = useState(0)
    const [quota, setquota] = useState(0)
    const [selfmention, setselfmention] = useState(false)
    const [packingtypechargelist, setpackingtypechargelist] = useState([])
    const [goodssalesmashuplist, setgoodssalesmashuplist] = useState([])
    const [goodswarehouselist, setgoodswarehouselist] = useState([])
    const [couponlist, setcouponlist] = useState([])
    const [ServiceTypeid, setServiceTypeid] = useState(" ")
    const [couponinfo, setsetcouponinfo] = useState('')
    const [paymentmode, setpaymentmode] = useState('现金支付')
    const [usecoupon, setusecoupon] = useState(false)
    const [orderdata, setorderdata] = useState('')
    const [address_info, setaddress_info] = useState('')
    const [senmsg, setsenmsg] = useState(false)
    const api = useRef()
    const [keywoeds, setkeywoeds] = useState('')
    const [updateaddress, setupdateaddress] = useState(false)
    const [bagenum, setbagenum] = useState(0)
    const [visible, _setVisible] = useState(false);
    const setVisible = visible => _setVisible(visible);

    const { register, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            payment: '现金支付',
            addressid: 0,
            tel: ''
        }
    });

    const [mode, setMode] = useState('维修')
    const [obj, setObj] = useState('灶具')
    const [wxremarks, setwxremarks] = useState('')
    // 现金支付
    const calculateOrderPriceByCash = () => {

        let totals = 0
        let cash = 0
        let balance = 0
        console.log(orderlist)
        for (let i = 0; i < orderlist.length; i += 1) {
            if (orderlist[i]?.paymentstatus === '已支付') {
                totals += 0
            } else {
                totals += (orderlist[i].price * orderlist[i].num)
            }
            if (orderlist[i].payment === '现金支付' && orderlist[i]?.paymentstatus !== '已支付') {
                cash += (orderlist[i].price * orderlist[i].num)
                setCash(parseFloat(cash).toFixed(2))
            }
            if (orderlist[i].payment === '余额支付') {

                balance += (orderlist[i].price * orderlist[i].num)
                if (balance > parseFloat(userinfo.balance)) {
                    // 超出余额部分
                    let more = balance - parseFloat(userinfo.balance)
                    // 如果信用额度大于超出部分 则使用超出部分 
                    if (parseFloat(userinfo.quota) > more) {
                        setquota(more)
                    } else {
                        setquota(parseFloat(userinfo.quota))
                        // 剩余部分使用现金
                        setCash(more - parseFloat(userinfo.quota))
                    }

                    setbalance(parseFloat(userinfo.balance))
                } else {
                    setbalance(balance)

                }
            }



        }
        // console.log(totals)x
        setTotal(parseFloat(totals).toFixed(2))

    }

    // 余额支付
    const calculateOrderPriceByBalance = () => {

        let totals = 0
        let balance = 0
        let cash = 0
        console.log('余额支付', userinfo)
        for (let i = 0; i < orderlist.length; i += 1) {
            if (orderlist[i]?.paymentstatus === '已支付') {
                totals += 0
            } else {
                totals += (orderlist[i].price * orderlist[i].num)
            }
            if (orderlist[i].payment === '余额支付' && orderlist[i]?.paymentstatus !== '已支付') {
                balance += (orderlist[i].price * orderlist[i].num)
            }

        }
        if (parseFloat(userinfo.balance) > balance) {
            setbalance(balance)
        } else {
            if (userinfo.quota >= balance) {
                setquota(balance)
            }

            if (parseFloat(userinfo.balance) > 0) {
                setbalance(parseFloat(userinfo.balance))
                setCash(balance - parseFloat(userinfo.balance))
            } else {
                setCash(balance)
            }
        }


        // console.log(totals)x
        setTotal(parseFloat(totals).toFixed(2))

    }

    const calculateOrderPrice = () => {
        setCash(0)
        setbalance(0)
        setquota(0)
        setTotal(0)
        const payment = getValues('payment')
        console.log('订单数量改变', payment)
        if (payment === '现金支付') {
            calculateOrderPriceByCash()
        } else {
            calculateOrderPriceByBalance()
        }
    }

    useEffect(() => {
        const DepartmentList = JSON.parse(localStorage.getItem('initData')).DepartmentList.filter(item => item.type === '业务门店')
        const arr = []
        for (let i = 0; i < DepartmentList.length; i += 1) {
            arr.push({
                label: DepartmentList[i].label,
                value: DepartmentList[i].name,
            })
        }
        setDepartmentArr(arr)

        setValue('tel', tel)
        setValue('department', department)
        setValue('ope_remarks', userinfo.ope_remarks)
        setValue('remarks', userinfo.remarks)
        setappointmenttime(new Date(new Date().getTime() + 10 * 60000))
    }, [userinfo, department, tel]);

    useEffect(() => {
        // let arr = [...couponlist]
        // for (const i in orderlist) {
        //     console.log(i,orderlist[i])
        //     if (orderlist[i].goodsname) {
        //
        //     }
        // }
        calculateOrderPrice()
        setsetcouponinfo('')
    }, [orderlist, paymentmode])

    //
    // useEffect(()=> {
    //     const arr = [...couponlist]
    //     for (const i in orderlist) {
    //         console.log(orderlist[i])
    //     }
    // },orderlist)



    useEffect(async () => {
        if (!userinfo.userid || !department) {
            return;
        }
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserAdvanceOrderInfo',
            userid: userinfo.userid,
            // customertype: userinfo.customertype,
            attributiondepartmentid: userinfo.attributiondepartmentid,
            customertypeid: userinfo.customertypeid,
            distributionstore: department,
            selfmention: !selfmention ? '否' : '是'
        })


        // 查找最近其他下单记录

        const other = await request('post', '/api/getInfo', {
            "url": "Srapp.Web_User_Infos.UserOtherServicesOrderInfo",
            "userid": userinfo.userid,
            "endtime": moment().format('YYYY-MM-DD'),
            //开始时间 三天前
            "begintime": moment().subtract(3, 'days').format('YYYY-MM-DD'),
            "state": "[\"正常\",\"已安排\",\"已接单\"]"
        })





        const goodslist = rew.data.goodslist
        // setGoodsList(rew.data.goodslist)
        rew.data.couponlist.forEach(item => item.is_use = false)

        setcouponlist(rew.data.couponlist.filter(item => item.state == '正常'))

        for (let i = 0; i < goodslist.length; i += 1) {
            goodslist[i].payment = goodslist[i].paymode || '现金支付'
            goodslist[i].mode = '商品销售'
            goodslist[i].price = parseFloat(goodslist[i].price).toFixed(1)
        }
        setGoodsList(goodslist)
        setpackingtypechargelist(rew.data.packingtypechargelist)



        setgoodssalesmashuplist(rew.data.goodssalesmashuplist)
        setgoodswarehouselist(rew.data.goodswarehouselist)
        setorderlist([])


        let sum = 0
        rew.data.packingtypechargelist.forEach(item=>{
            sum += item.chargerecord.length
        })
        setbagenum(sum)

        const todayorder = rew.data.todayorder
        if (todayorder.length || other.data.length) {
            Modal.info({
                title: '最近下单信息', content:
                    <>

                        {
                            todayorder.map(item =>
                                <Box>{item.addtime.substr(0, 16)},{item.goodsname},{item.department
                                },{item.mode},{item.state}
                                </Box>)
                        }


                        {
                            other.data.map(item =>
                                <Box>{item.addtime.substr(0, 16)},{item.servicetype},{item.remarks
                                },{item.state}
                                </Box>)
                        }
                    </>


            });
        }
        // todayorder.length &&



    }, [userinfo, department, selfmention])


    const [saleindex, setsaleindex] = useState(0)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const getCouponTotal = () => {
        let sum = 0
        couponlist.forEach(item => {
            if (item.is_use) {
                sum += parseFloat(item.price)
            }
        })
        return sum.toFixed(2)
    }
    // const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [own, setown] = useState(false)
    // console.log(initData)
    const goodsref = useRef()
    const [type, setType] = useState('全部')

    useEffect(() => {
        const typeword = type == '全部' ? '' : type
        goodsref.current.api.setQuickFilter(typeword)
    }, [type])

    const removeItem = (index) => {
        setItems(items.filter((item, i) => i !== index));
    };
    const isToday = (dateString) => {
        const appointmentDate = new Date(dateString);
        const today = new Date();

        return appointmentDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    };
    const addyf = (list) => {
        //找到GoodsList对应下标并删除
        let newlist = [...list]
        const additionalservices = address_info.additionalservices ? JSON.parse(address_info.additionalservices) : []
        let yf_index_arr = []
        let yf_arr = []
        for (let i = 0; i < newlist.length; i++) {
            const element = newlist[i];
            console.log('element', element);
            console.log('additionalservices', additionalservices);
            const index = additionalservices.findIndex(item => item.goodsId == element.goodsid)
            if (index == -1) {
                continue
            }


            const yfdata = additionalservices[index]
            console.log('yfdata', yfdata);
            // 记录运费下标
            const yf_i = newlist.findIndex(item => item.goodsid == yfdata.freightId)
            console.log('yf_i', yf_i);
            if (yf_i > -1) {
                if (yf_index_arr.findIndex(item => item == yf_i) === -1) {
                    yf_index_arr.push(yf_i)
                }
            }


            // 判断newlist中是否有运费
            const YF_index = GoodsList.findIndex(item => item.goodsid == yfdata.freightId)
            if (YF_index == -1) {
                continue
            }
            console.log('YF_index', GoodsList[YF_index]);
            if (yf_arr.findIndex(item => item.goodsid == GoodsList[YF_index].goodsid) === -1) {
                yf_arr.push({
                    mode: GoodsList[YF_index].mode,
                    relation: '',
                    goodsid: GoodsList[YF_index].goodsid,
                    goodsname: GoodsList[YF_index].name,
                    price: GoodsList[YF_index].price,
                    servicefee: parseFloat(GoodsList[YF_index].servicefee),
                    oldprice: GoodsList[YF_index].price,
                    num: element['num'] * yfdata['freightNum'],
                    payment: GoodsList[YF_index].payment
                })
            } else {
                yf_arr[yf_arr.findIndex(item => item.goodsid == GoodsList[YF_index].goodsid)].num += element['num'] * yfdata['freightNum']  //运费数量  *  商品数量     

            }

            // if (index) {

            // }
            // if (index > -1) {
            //     // 删除费用
            //     newlist.splice(i, 1)
            //     // 增加费用
            //     const yfdata = additionalservices[index]
            //     const YF_index = GoodsList.findIndex(item => item.goodsid == yfdata.goodsId)
            //     newlist.push({
            //         mode: '商品销售',
            //         relation: '',
            //         goodsid: GoodsList[YF_index].goodsid,
            //         goodsname: GoodsList[YF_index].name,
            //         price: GoodsList[YF_index].price,
            //         servicefee: parseFloat(GoodsList[YF_index].servicefee),
            //         oldprice: GoodsList[YF_index].price,
            //         num: element['num'] * yfdata['freightNum'],
            //         payment: GoodsList[YF_index].payment

            //     })
            // }
        }
        console.log('yf_index_arr', yf_index_arr);

        for (let i = 0; i < yf_index_arr.length; i++) {
            const element = yf_index_arr[i];
            newlist.splice(element, 1)
        }
        if (yf_index_arr.length == 0) {
            // 查找newlist所有运费
            let indexarr = []
            for (let i = 0; i < newlist.length; i++) {
                const element = newlist[i];
                if (element.goodsname.includes('运费')) {
                    indexarr.push(i)
                }
            }
            for (let i = 0; i < indexarr.length; i++) {
                const element = indexarr[i];
                newlist.splice(element, 1)
            }
        }


        newlist = [...newlist, ...yf_arr]

        // console.log('newlist', newlist);
        // if (newlist.length) {
        //     // const orderlistarr = JSON.parse(JSON.stringify(orderlist));
        //     const index = newlist.findIndex(item => item.goodsid == yfdata.goodsid && item.mode === '商品销售')
        //     // console.log('index', index);
        //     if (index > -1) {
        //         newlist.splice(index, 1)
        //     }
        // }
        //查找含有运费的商品

        // if (goodsnum > 0) {
        //     // setorderlist(orderlist => [...orderlist, {
        //     //     mode: yfdata.mode,
        //     //     relation: '',
        //     //     goodsid: yfdata.goodsid,
        //     //     goodsname: yfdata.name,
        //     //     price: yfdata.price,
        //     //     servicefee: parseFloat(yfdata.servicefee),
        //     //     oldprice: yfdata.price,
        //     //     num: goodsnum * num,
        //     //     payment: yfdata.payment
        //     // }])
        //     newlist.push(
        //         {
        //             mode: yfdata.mode,
        //             relation: '',
        //             goodsid: yfdata.goodsid,
        //             goodsname: yfdata.name,
        //             price: yfdata.price,
        //             servicefee: parseFloat(yfdata.servicefee),
        //             oldprice: yfdata.price,
        //             num: goodsnum * num,
        //             payment: yfdata.payment
        //         }
        //     )
        // }
        return newlist

    }


    const getqjandfyandfw = () => {
        // console.log('orderlist2222222------------', orderlist);
        let data = {
            qj: 0,
            fy: 0,
            fw: 0,
            zlf: 0,
            njf: 0,
            whf: 0,
            jcf: 0,
        }

        for (let i = 0; i < orderlist.length; i++) {
            const element = orderlist[i];
            if (element.mode === '商品销售' && element.goodsname.includes('液化气')) {
                data.qj += element.num * element.price
            } else if (element.mode === '费用缴纳') {
                data.fy += element.num * element.price
                if (element.goodsname.includes('租赁费')) {
                    data.zlf += element.num * element.price
                }
                if (element.goodsname.includes('年检费')) {
                    data.njf += element.num * element.price
                }
                if (element.goodsname.includes('维护费')) {
                    data.whf += element.num * element.price
                }
                if (element.goodsname.includes('检测费')) {
                    data.jcf += element.num * element.price
                }


            }
        }
        return data

    }


    return (
        <Grid container sx={{
            mt: 2
        }}>
            <Grid item xs={12} md={6} sx={{
                paddingRight: { md: 2, xs: 0 },
                height: '80vh'
            }}>
                <Box p={1} pt={2} border={1} borderColor="#babfc7" >
                    <Modal visible={own} footer={<></>} onOk={() => setown(false)} fullScreen onCancel={() => setown(false)} title="订单监控">
                        <DepartmentUserOrderInfo />
                    </Modal>
                    <Button size="small" color="secondary" sx={{ mr: 1, mb: 1 }} onClick={() => setsaleindex(0)}
                        variant={saleindex === 0 ? 'contained' : 'outlined'}>
                        商品销售
                    </Button>
                    <Badge size="small" sx={{ mr: 1, mb: 1 }} badgeContent={goodswarehouselist.length} color="error"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        <Button size="small" color="secondary" onClick={() => setsaleindex(1)}
                            variant={saleindex === 1 ? 'contained' : 'outlined'}>
                            库存提货
                        </Button>
                    </Badge>
                    <Button size="small" color="secondary" sx={{ mr: 1, mb: 1 }} onClick={() => setsaleindex(2)}
                        variant={saleindex === 2 ? 'contained' : 'outlined'}>
                        促销方案
                    </Button>
                    <Badge size="small" sx={{ mr: 1, mb: 1 }} badgeContent={bagenum} color="error"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        <Button size="small" color="secondary" onClick={() => setsaleindex(3)}
                            variant={saleindex === 3 ? 'contained' : 'outlined'}>
                            钢瓶费用
                        </Button>
                    </Badge>
                    <Button sx={{ mr: 1, mb: 1 }} size="small" color="secondary" onClick={() => setsaleindex(4)}
                        variant={saleindex === 4 ? 'contained' : 'outlined'}>
                        客服中心维修
                    </Button>
                    <Button sx={{ mr: 1, mb: 1 }} size="small" color="secondary" onClick={() => setsaleindex(5)}
                        variant={saleindex === 5 ? 'contained' : 'outlined'}>
                        门店业务
                    </Button>

                    <Button sx={{ mr: 1, mb: 1 }} size="small" color="secondary" onClick={() => {
                        // setown(true)
                        // 新窗口打开
                        window.open('/department/DepartmentUserOrderInfo')
                    }}
                        variant={'outlined'}>
                        本人预约
                    </Button>
                </Box>

                {
                    saleindex === 0 ? <Box marginTop={2} height="62vh" overflow={'scroll'}>
                        <Box display={'flex'} mb={2}>
                            <Box onClick={() => setType('全部')} sx={{ px: 1, border: 1, mr: 1, borderColor: (type === '全部' ? 'red' : '#ccc'), cursor: 'pointer' }}>全部</Box>
                            <Box onClick={() => setType('液化气')} sx={{ px: 1, border: 1, mr: 1, borderColor: (type === '液化气' ? 'red' : '#ccc'), cursor: 'pointer' }}>液化气</Box>
                            <Box onClick={() => setType('桶装水')} sx={{ px: 1, border: 1, mr: 1, borderColor: (type === '桶装水' ? 'red' : '#ccc'), cursor: 'pointer' }}>桶装水</Box>
                            <Box onClick={() => setType('服务')} sx={{ px: 1, border: 1, mr: 1, borderColor: (type === '服务' ? 'red' : '#ccc'), cursor: 'pointer' }}>服务</Box>
                        </Box>
                        <AgGridReact
                            ref={goodsref}
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
                                { field: 'type', headerName: '类型', hide: true },
                                { field: 'payment', headerName: '支付方式' },
                                {
                                    field: 'id', headerName: '操作', cellRendererFramework: (params) =>
                                        <div>
                                            <Button size={"small"} onClick={async () => {

                                                // const rew = await request('post', '/api/getInfo', {
                                                //     url: 'Srapp.Web_User_Infos.UserAdvanceOrderInfoForGoodsid',
                                                //     userid: userinfo.userid,
                                                //     goodsid: params.data.goodsid,
                                                //     distributionstore: department,
                                                //     selfmention: selfmention ? '是' : '否'
                                                // })



                                                const dataindex = orderlist.findIndex(item => (item.goodsid === params.data.goodsid && item.mode === '商品销售'))
                                                let neworderlist = [...orderlist]
                                                if (dataindex === -1) {
                                                    let paymentadd = params.data.payment
                                                    if (params.data.payment == '现金支付' && parseFloat(userinfo.balance) > 0) {
                                                        paymentadd = '余额支付'
                                                    }
                                                    neworderlist.push({
                                                        mode: params.data.mode,
                                                        relation: '',
                                                        goodsid: params.data.goodsid,
                                                        goodsname: params.data.name,
                                                        price: params.data.price,
                                                        servicefee: parseFloat(params.data.servicefee),
                                                        oldprice: params.data.price,
                                                        num: 1,
                                                        payment: paymentadd
                                                    })

                                                    // setorderlist([...orderlist, {
                                                    //     mode: params.data.mode,
                                                    //     relation: '',
                                                    //     goodsid: params.data.goodsid,
                                                    //     goodsname: params.data.name,
                                                    //     price: params.data.price,
                                                    //     servicefee: parseFloat(params.data.servicefee),
                                                    //     oldprice: params.data.price,
                                                    //     num: 1,
                                                    //     payment: params.data.payment
                                                    // }])
                                                } else {
                                                    neworderlist[dataindex].num = Number(neworderlist[dataindex].num) + 1
                                                    // setorderlist(orderlist => [...orderlist])
                                                    // neworderlist[]
                                                }
                                                console.log('recoverypackingtype', params.data);
                                                if (params.data.type == '液化气') {
                                                    // 添加钢瓶费用
                                                    for (let i = 0; i < packingtypechargelist.length; i += 1) {
                                                        for (let j = 0; j < packingtypechargelist[i].chargerecord.length; j += 1) {
                                                            // 判断是否存在
                                                            const gasbool = orderlist.findIndex(item => (item.mode === '费用缴纳' && item.goodsid === packingtypechargelist[i].chargerecord[j].id))
                                                            if (gasbool === -1) {
                                                                // let goods_package = params.data.recoverypackingtype
                                                                // let gas_package = JSON.parse(packingtypechargelist[i].chargerecord[j].packingtype)
                                                                // 判断两个数组是否有交集
                                                                // let intersection = goods_package.filter(v => gas_package.includes(v))
                                                                // if (intersection.length) {
                                                                let paymentadd = params.data.payment
                                                                if (params.data.payment == '现金支付' && parseFloat(userinfo.balance) > 0) {
                                                                    paymentadd = '余额支付'
                                                                }
                                                                neworderlist.push({
                                                                    mode: '费用缴纳',
                                                                    relation: '',
                                                                    goodsname: packingtypechargelist[i].chargerecord[j].remarks + packingtypechargelist[i].chargerecord[j].project,
                                                                    goodsid: packingtypechargelist[i].chargerecord[j].id,
                                                                    price: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                    oldprice: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                    num: 1,
                                                                    payment: paymentadd
                                                                })
                                                                // }
                                                            }
                                                        }
                                                    }
                                                }



                                                // // 添加运费
                                                // console.log('商品', params.data);
                                                // console.log('地址信息', address_info);
                                                // const additionalservices = JSON.parse(address_info.additionalservices)
                                                // const YFList = additionalservices.filter(item => item.goodsId == params.data.goodsid)
                                                // if (!YFList.length) {
                                                //     setorderlist([...neworderlist])
                                                //     return
                                                // }
                                                // // 找到运费下表在GoodsList
                                                // const YF_index = GoodsList.findIndex(item => item.goodsid == YFList[0].freightId)
                                                // const num = dataindex ? 1 : Number(neworderlist[dataindex].num)

                                                const rew = addyf(neworderlist)
                                                setorderlist([...rew])




                                            }}>添加购物车</Button>
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
                                    field: 'actualprice', headerName: '实际单价',
                                    valueGetter: data => data.data ? parseFloat(data.data.actualprice) : ''
                                },
                                { field: 'num', headerName: '数量' },
                                { field: 'paymentstatus', headerName: '支付状态' },
                                { field: 'givetype', headerName: '是否赠品' },

                                { field: 'salestype', headerName: '优惠方式' },
                                {
                                    field: 'goodsname',
                                    headerName: '操作',
                                    cellRendererFramework: (params) =>
                                        params.data.canuse === 1 ? <Button size={"small"} onClick={() => {
                                            // console.log(orderlist)
                                            const dataindex = orderlist.findIndex(item => (item.relation == params.data.id && item.mode === '库存提货'))
                                            if (dataindex === -1) {

                                                setorderlist(orderlist => [...orderlist, {
                                                    mode: '库存提货',
                                                    relation: parseInt(params.data.id),
                                                    goodsid: params.data.goodsid,
                                                    goodsname: params.data.goodsname,
                                                    price: params.data.actualprice,
                                                    paymentstatus: params.data.paymentstatus,
                                                    num: 1,
                                                    payment: getValues('payment')
                                                }])

                                                if (params.data.type == '液化气') {
                                                    // 添加钢瓶费用
                                                    for (let i = 0; i < packingtypechargelist.length; i += 1) {
                                                        for (let j = 0; j < packingtypechargelist[i].chargerecord.length; j += 1) {
                                                            // 判断是否存在
                                                            const gasbool = orderlist.findIndex(item => (item.mode === '费用缴纳' && item.goodsid === packingtypechargelist[i].chargerecord[j].id))
                                                            if (gasbool === -1) {
                                                                // let goods_package = params.data.recoverypackingtype
                                                                // let gas_package = JSON.parse(packingtypechargelist[i].chargerecord[j].packingtype)
                                                                // 判断两个数组是否有交集
                                                                // let intersection = goods_package.filter(v => gas_package.includes(v))
                                                                // if (intersection.length) {
                                                                //   setorderlist({
                                                                //         mode: '费用缴纳',
                                                                //         relation: '',
                                                                //         goodsname: packingtypechargelist[i].chargerecord[j].remarks + packingtypechargelist[i].chargerecord[j].project,
                                                                //         goodsid: packingtypechargelist[i].chargerecord[j].id,
                                                                //         price: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                //         oldprice: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                //         num: 1,
                                                                //         payment: params.data.payment
                                                                //     })

                                                                // }
                                                                setorderlist(orderlist => [...orderlist, {
                                                                    mode: '费用缴纳',
                                                                    relation: '',
                                                                    goodsname: packingtypechargelist[i].chargerecord[j].remarks + packingtypechargelist[i].chargerecord[j].project,
                                                                    goodsid: packingtypechargelist[i].chargerecord[j].id,
                                                                    price: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                    oldprice: parseFloat(packingtypechargelist[i].chargerecord[j].total),
                                                                    num: 1,
                                                                    payment: params.data.paymentstatus == '未支付' ? '现金支付' : '余额支付'
                                                                }])
                                                                // }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (orderlist[dataindex].num < params.data.num) {
                                                    orderlist[dataindex].num = Number(orderlist[dataindex].num) + 1
                                                    setorderlist(orderlist => [...orderlist])
                                                }
                                                setorderlist(orderlist => [...orderlist])
                                            }
                                        }}>添加购物车</Button> : ''

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
                    saleindex === 2 ? <Box marginTop={2} height="80vh">
                        {/* 搜索 goodssalesmashuplist ->name */}
                        <Box display="flex" mb={3} justifyContent="space-between" alignItems="center">
                            <Form layout="horizontal" labelPosition="inset">
                                <Form.Input label="关键字" name="name" onChange={e => setkeywoeds(e)} />
                            </Form>

                        </Box>
                        <Box height={'50vh'} overflow="scroll">
                            {
                                goodssalesmashuplist.filter(item => {
                                    if (keywoeds == '') {
                                        return true
                                    }
                                    if (item.name.indexOf(keywoeds) !== -1) {
                                        return true
                                    }
                                    return false
                                }).map(item =>
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
                                                    {items.goodsname} X {items.num} 小计 {(items.num * items.price).toFixed(2)}
                                                </Box>
                                            )
                                        }
                                    </Box>
                                )
                            }    </Box></Box> : ''
                }
                {
                    saleindex === 3 ? (
                        <Box marginTop={2} height="59.5vh" overflow={'scroll'}>
                            {
                                packingtypechargelist.map(item =>
                                    <Box mb={3}>
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
                                        initData.ServiceTypeList.filter(item => item.type == 2).map(item => <MenuItem
                                            value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>

                        </Box>
                        <TextField value={wxremarks} onChange={(data) => {
                            setwxremarks(data.target.value)
                        }} sx={{ marginBottom: 2 }} fullWidth label="门店业务备注" />
                        <Button onClick={async () => {
                            if (getValues('tel').length > 11) {
                                toast.error('电话号码有误')
                                return false
                            }

                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.CreateUserOtherServicesOrder',
                                userid: userinfo.userid,
                                addressid: getValues('addressid'),
                                remarks: wxremarks,
                                appointmenttime: moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss'),
                                servicetypeid: ServiceTypeid,
                                department: '客服中心',
                                telephone: getValues('tel')
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('预约成功')
                            } else {
                                toast.error(rew.data.tips)
                            }
                        }} variant="contained">确认办理</Button>
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
                                        initData.ServiceTypeList.filter(item => item.type == 1).map(item => <MenuItem
                                            value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>

                        </Box>
                        <TextField value={wxremarks} onChange={(data) => {
                            setwxremarks(data.target.value)
                        }} sx={{ marginBottom: 2 }} fullWidth label="门店业务备注" />
                        <Button onClick={async () => {
                            if (getValues('tel').length > 11) {
                                toast.error('电话号码有误')
                                return false
                            }
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.CreateUserOtherServicesOrder',
                                userid: userinfo.userid,
                                addressid: getValues('addressid'),
                                remarks: wxremarks,
                                appointmenttime: moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss'),
                                servicetypeid: ServiceTypeid,
                                department,
                                telephone: getValues('tel')
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

                    <Modal style={{ top: '10%' }} visible={usecoupon} footer={<></>} onCancel={() => setusecoupon(false)} >
                        <Box fontSize={18} mb={3}>优惠券列表</Box>

                        {
                            couponlist.map((item, k) => {
                                // if ((k + 1) <= orderlist[orderdata]?.num) {
                                if (!orderlist[orderdata]) {
                                    return ''
                                }
                                if (item?.goodsnames.indexOf(orderlist[orderdata].goodsname) !== -1) {



                                    return <Box sx={{ cursor: 'pointer' }} bgcolor={'#eee'} mb={3} onClick={() => {
                                        //计算已使用优惠券的数量
                                        let num = 0
                                        for (let i = 0; i < couponlist.length; i++) {
                                            if (couponlist[i].is_use) {
                                                num++
                                            }
                                        }
                                        if (num >= orderlist[orderdata].num) {
                                            toast.error('优惠券数量已达上限')
                                            return
                                        }


                                        couponlist[k].is_use = !couponlist[k].is_use
                                        setcouponlist([...couponlist])
                                        // console.log(orderdata)


                                        if (couponlist[k].is_use) {

                                            if (orderlist[orderdata].couponinfo) {
                                                orderlist[orderdata].couponinfo.push(item)
                                            } else {
                                                orderlist[orderdata].couponinfo = []
                                                orderlist[orderdata].couponinfo.push(item)
                                            }

                                        } else {
                                            const index = orderlist[orderdata].couponinfo.findIndex(data => data.id == item.id)
                                            orderlist[orderdata].couponinfo.splice(index, 1)
                                        }

                                        setorderlist([...orderlist])
                                        console.log('orderlist', orderlist[orderdata])
                                    }} p={2} border={item.is_use ? '3px solid red' : '2px solid #ccc'} borderRadius={2}>
                                        <Box fontSize={18} fontWeight={"bold"}>¥{parseFloat(item.price)} {item.remarks}</Box>
                                        <Box mt={1}>有效期{item.begin_termofvalidity.substring(0, 10)}-{item.end_termofvalidity.substring(0, 10)}</Box>
                                    </Box>
                                } else {
                                    return <Box sx={{ cursor: 'pointer' }} bgcolor={'#eee'} color={'#ccc'} mb={3} p={2} border={item.is_use ? '3px solid red' : '2px solid #ccc'} borderRadius={2}>
                                        <Box fontSize={18} fontWeight={"bold"}>¥{parseFloat(item.price)} {item.remarks}</Box>
                                        <Box mt={1}>有效期{item.begin_termofvalidity.substring(0, 10)}-{item.end_termofvalidity.substring(0, 10)}</Box>
                                    </Box>
                                }
                            })
                        }
                    </Modal>
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
                                    dataIndex: 'goodsname',
                                    render: (text, data) => {
                                        for (let i = 0; i < couponlist.length; i++) {
                                            if (JSON.parse(couponlist[i].goodsnames).indexOf(text) !== -1 && data.payment !== '月结支付') {
                                                return <Box alignItems={'center'} display={"flex"}><Box>{text}</Box><Box onClick={() => {
                                                    couponlist.map(item => item.is_use = false)
                                                    setcouponlist([...couponlist])
                                                    setusecoupon(true)

                                                    const index = orderlist.findIndex(item => item === data)
                                                    setorderdata(index)


                                                    if (orderlist[index].couponinfo && orderlist[index].couponinfo.length !== 0) {
                                                        if (orderlist[index].couponinfo.length > orderlist[index].num) {
                                                            orderlist[index].couponinfo.length = orderlist[index].num
                                                        }
                                                    }
                                                    setorderlist([...orderlist])
                                                    console.log(orderlist)

                                                    couponlist.sort((a, b) => {
                                                        if (!orderlist[orderdata]) {
                                                            return -1
                                                        }
                                                        if (a.goodsnames.indexOf(orderlist[orderdata].goodsname) !== -1) {
                                                            return -1
                                                        } else {
                                                            return 1
                                                        }
                                                    })

                                                    setcouponlist([...couponlist])

                                                }} sx={{ cursor: 'pointer', ml: 1 }} fontSize={10} color={'blue'}>用券</Box></Box>
                                                break;
                                            }
                                        }
                                        return text
                                    }
                                },
                                {
                                    title: '数量',
                                    dataIndex: 'num',
                                    render: (text, record) => <input min="0" onChange={(e) => {
                                        if (record.mode === '库存提货') {
                                            return
                                        }
                                        const index = orderlist.findIndex(item => item === record)
                                        orderlist[index].num = e.target.value
                                        if (orderlist[index].couponinfo && orderlist[index].couponinfo.length !== 0) {
                                            // if (orderlist[index].couponinfo.length > orderlist[index].num) {
                                            //     orderlist[index].couponinfo.length = orderlist[index].num
                                            // }

                                            orderlist[index].couponinfo.length = 0
                                            for (let i = 0; i < couponlist.length; i++) {
                                                couponlist[i].is_use = false
                                            }


                                        }
                                        let neworderlist = [...orderlist]
                                        const rew = addyf(neworderlist)
                                        setorderlist([...rew])
                                        // setorderlist([...orderlist])
                                        setcouponlist([...couponlist])

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
                                                    let neworderlist = [...orderlist]

                                                    neworderlist.splice(index, 1)
                                                    const rew = addyf(neworderlist)

                                                    setorderlist([...rew])
                                                    calculateOrderPrice()


                                                    orderlist[index].num = e.target.value
                                                    if (orderlist[index].couponinfo && orderlist[index].couponinfo.length !== 0) {
                                                        // if (orderlist[index].couponinfo.length > orderlist[index].num) {
                                                        //     orderlist[index].couponinfo.length = orderlist[index].num
                                                        // }

                                                        orderlist[index].couponinfo.length = 0
                                                        for (let i = 0; i < couponlist.length; i++) {
                                                            couponlist[i].is_use = false
                                                        }


                                                    }

                                                    // setorderlist([...orderlist])
                                                    setcouponlist([...couponlist])
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

                            {/* 合计 {total - (getCouponTotal())} 现金{cash}

                            余额 {balance}

                            扣除信用额度 {quota}

                            使用优惠券 -{getCouponTotal()}

                            {
                                couponinfo.price ? <Typography color="red" marginLeft={2}>优惠券 - {parseFloat(couponinfo.price) || 0}</Typography> : ''
                            }
                            <br />
                            气价 {getqjandfyandfw().qj} 元 钢瓶费用 {getqjandfyandfw().fy} 元
                            租赁费 {getqjandfyandfw().zlf} 元
                            年检费 {getqjandfyandfw().njf} 元
                            维护费 {getqjandfyandfw().whf} 元
                            检测费  {getqjandfyandfw().jcf} 元 修改 价格加粗 红色*/}
                            <Box display={'flex'} flexWrap={'wrap'}>
                                <Box>合计 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{total - (getCouponTotal())} </span> 现金<span style={{ color: 'red', fontWeight: 'bold', marginRight: 5 }}>￥{cash}   </span>   </Box>
                                <Box mr={1}> 余额 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{balance} </span></Box>
                                <Box mr={1}> 扣除信用额度 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{quota} </span></Box>
                                <Box> 使用优惠券 -<span style={{ color: 'red', fontWeight: 'bold' }}>￥{getCouponTotal()} </span></Box>
                                {
                                    couponinfo.price ? <Typography color="red" marginLeft={2}>优惠券 - <span style={{ color: 'red', fontWeight: 'bold' }}>￥{parseFloat(couponinfo.price) || 0} </span></Typography> : ''
                                }
                                {/* <Box>气价 {getqjandfyandfw().qj} 元 钢瓶费用 {getqjandfyandfw().fy} 元</Box> */}
                                <Box mr={1}>租赁费 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{getqjandfyandfw().zlf}  </span>元</Box>
                                <Box mr={1}>年检费 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{getqjandfyandfw().njf} </span> 元</Box>
                                <Box mr={1}>维护费 <span style={{ color: 'red', fontWeight: 'bold' }}>￥{getqjandfyandfw().whf} </span> 元</Box>
                                <Box ml={1}>检测费  <span style={{ color: 'red', fontWeight: 'bold' }}>￥{getqjandfyandfw().jcf}  </span>元</Box>
                                <Box ml={1}>下单后余额  <span style={{ color: 'red', fontWeight: 'bold' }}>￥{parseFloat(userinfo.balance - balance).toFixed(2)}  </span>元</Box>

                            </Box>




                        </Typography>
                    </Grid>
                    <Grid container p={2} mt={1.3} sx={{
                        border: 'dashed 1px #ccc'
                    }}>
                        <Grid item xs={12} md={6}>
                            <p>预约上门时间</p>
                            <Box sx={{
                                mt: 1
                            }}>



                                <DatePicker
                                    value={appointmenttime}
                                    onChange={e => setappointmenttime(e)}
                                    type="dateTime"
                                    // style={{
                                    //     // 判断是不是当天
                                    //     ...(isToday(appointmenttime) ? {} : {
                                    //
                                    //         color: 'red',
                                    //         fontSize: 'larger',
                                    //     }),
                                    // }}
                                />

                            </Box>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* <p>支付方式</p>
                            <RadioGroup onChange={event => {

                                setpaymentmode(event.target.value)
                                for (let i = 0; i < orderlist.length; i += 1) {
                                    if (orderlist[i].mode) {
                                        orderlist[i].payment = orderlist[i].payment === '月结支付' ? '月结支付' : event.target.value
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
                            </RadioGroup> */}
                            <p>支付方式</p>
                            <RadioGroup label="支付方式" initValue={getValues('payment')} onChange={event => {
                                // console.log(e)
                                // setpaymentmode(e)
                                // for (let i = 0; i < orderlist.length; i += 1) {
                                //     if (orderlist[i].mode) {
                                //         orderlist[i].payment = orderlist[i].payment === '月结支付' ? '月结支付' : e
                                //         setorderlist([...orderlist])
                                //     }
                                // }

                                // for (let i = 0; i < GoodsList.length; i += 1) {
                                //     GoodsList[i].payment = e
                                //     setGoodsList([...GoodsList])
                                // }
                                setpaymentmode(event.target.value)
                                setValue('payment', event.target.value)
                                for (let i = 0; i < orderlist.length; i += 1) {
                                    if (orderlist[i].mode) {
                                        orderlist[i].payment = orderlist[i].payment === '月结支付' ? '月结支付' : event.target.value
                                        setorderlist([...orderlist])
                                    }
                                }

                                for (let i = 0; i < GoodsList.length; i += 1) {
                                    GoodsList[i].payment = event.target.value
                                    setGoodsList([...GoodsList])
                                }

                            }}>
                                <Radios value={'现金支付'}>现金支付</Radios>
                                <Radios value={'余额支付'}>余额支付</Radios>
                            </RadioGroup>

                        </Grid>
                        <Grid item xs={12} md={4} mt={2}>
                            <Autocomplete
                                freeSolo
                                {...register('department')}
                                id="combo-box-demo"
                                size="small"
                                options={DepartmentArr}
                                sx={{ width: '90%' }}
                                onChange={
                                    (e, options) => {
                                        console.log(options)
                                        if (options) {
                                            setValue('department', options.value)
                                            setdepartment(options.value)
                                        } else {
                                            setValue('department', '')
                                            setdepartment('')
                                        }
                                    }
                                }
                                renderInput={value =>
                                    <TextField
                                        {...value}

                                        name="department"
                                        label="选择门店"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                }
                                value={department}
                            />


                        </Grid>
                        <Grid item xs={12} md={4} mt={2}>
                            <TextField
                                InputLabelProps={{ shrink: true,maxLength: 11 }}
                                inputProps={{ maxLength: 11 }}
                                type={'text'}
                                label="用户下单电话"

                                {...register('tel')}
                                size="small"
                                sx={{ width: '90%' }}
                            />

                        </Grid>

                        <Grid item xs={12} md={4} mt={2}>
                            {/* <FormGroup sx={{ display: "flex" }}
                                onChange={event => setselfmention(event.target.checked)}>
                                <FormControlLabel control={<Checkbox checked={selfmention} />} label="自提" />
                            </FormGroup> */}
                            {
                                loginuser?.login_department === '预约中心' ? <button onClick={()=>setValue('tel',localStorage.getItem('ldtel'))}>填充</button> : ''
                            }

                            <Checkbox checked={selfmention} onChange={event => setselfmention(event.target.checked)} />

                            <span>自提</span>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                            <Addresslist setaddress_info={setaddress_info} setdepartment={setdepartment} userinfo={userinfo} setValue={setValue} />
                        </Grid>
                        {/*<Grid item xs={12} mt={2}>*/}

                        {/*    <Form labelPosition={"inset"} >*/}
                        {/*        <Form.Select maxTagCount={2} label={'优惠券'} style={{width: '100%',padding:'5px 0',border: '1px solid #ccc'}} multiple onChange={e=> console.log(e)}>*/}
                        {/*            {*/}
                        {/*                couponlist.map((item,k)=>*/}
                        {/*                    <Form.Select.Option  value={item}>{item.id}-{item.goodsnames}</Form.Select.Option>*/}
                        {/*                )*/}
                        {/*            }*/}

                        {/*        </Form.Select>*/}
                        {/*    </Form>*/}

                        {/*</Grid>*/}
                        <Grid item xs={12} mt={2}>

                            <TextField
                                fullWidth
                                label="临时备注"
                                id="outlined-size-small"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                {...register('remarks')}

                            />
                        </Grid>
                        <Grid item xs={12} mt={2}>
                            <TextField
                                fullWidth
                                label="内部备注"
                                id="outlined-size-small"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                {...register('ope_remarks')}

                            />
                        </Grid>
                    </Grid>

                </Grid>
                <Popconfirm
                    style={{
                        zIndex: 999999999999999
                    }}
                    visible={visible}
                    onVisibleChange={setVisible}
                    position="top"
                    title="提示"
                    cancelText=""
                    closeOnEsc={false}
                    content={isToday(appointmenttime) ? "确认用户下单操作？" : <Box fontSize={18} color={'red'}>选择的日期不是今天，请确认是否继续下单？</Box>}
                    onConfirm={handleSubmit(async (data) => {
                        console.log('goodsjson', orderlist)
                        if (new Date().getTime() > new Date(appointmenttime).getTime()) {
                            return
                        }
                        if (data.tel.length > 11) {
                            toast.error('电话号码有误')
                            return false
                        }
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Order_Handle.CreateUserGoodsSalesOrder',
                            userid: userinfo.userid,
                            addressid: data.addressid,
                            distributionstore: data.department,
                            remarks: data.remarks,
                            ope_remarks: data.ope_remarks,
                            appointmenttime: moment(appointmenttime).format('YYYY-MM-DD HH:mm:ss'),
                            goodsjson: JSON.stringify(orderlist),
                            ordertotal: total - (getCouponTotal()),
                            selfmention: selfmention ? '是' : '否',
                            telephone: data.tel,
                            couponinfo: couponinfo ? JSON.stringify(couponinfo) : ''
                        })
                        if (rew.code === 200) {
                            if (rew.data.msg === 'ERROR') {
                                toast.error(`下单失败${rew.data.tips}`)
                                let data = ''
                                setsetcouponinfo(data)
                                return
                            }
                            toast.success('下单成功')
                            // localStorage.removeItem('ldtel')
                            // localStorage.removeItem('ldtime')
                            _setVisible(false)
                            //下单成功 删除orderlist传参的费用缴纳
                            for (let i = 0; i < orderlist.length; i++) {
                                if (orderlist[i].mode === '费用缴纳') {
                                    // orderlist.splice(i, 1)
                                    setpackingtypechargelist([])
                                    break
                                }
                            }


                            setselfmention(false)
                            setorderlist([])
                            // 重置下单时间
                            setappointmenttime(new Date(new Date().getTime() + 10 * 60000))
                            // for (let i = 0; i < couponlist.length; i++) {
                            //     if (couponlist[i].is_use) {
                            //         couponlist.splice(i,1)
                            //     }
                            // }
                            const arr = couponlist.filter(item => !item.is_use)


                            setcouponlist(arr)
                        } else {
                            toast.error('下单失败')

                        }
                        // console.log(rew)

                    })}>
                    <Button onClick={()=>_setVisible(true)} sx={{ mt: 2 }} variant="contained">确认下单</Button>

                </Popconfirm>
                <Button onClick={() => {
                    // 复制地址
                    // console.log(address_info)
                    copy(address_info.city + address_info.area + address_info.town + address_info.address)

                }} sx={{ mt: 2, ml: 1 }} variant="outlined">复制地址</Button>
                {
                    loginuser.login_department == '预约中心' && <Button onClick={() => {
                        setsenmsg(true)

                    }} sx={{ mt: 2, ml: 1 }} variant="outlined">发送短信</Button>
                }

                <Button onClick={() => {

                    setupdateaddress(true)

                }} sx={{ mt: 2, ml: 1 }} variant="outlined">修改楼层</Button>


                <Modal title="修改楼层" visible={updateaddress} onCancel={() => setupdateaddress(false)} footer={<></>}>
                    <Form onSubmit={async e => {
                        // action	枚举类型	必须		范围：ADD/UPDATE	状态（ADD,UPDATE）
                        // id	整型	可选	0		地址id
                        // userid	整型	必须			userid
                        // memberid	字符串	必须			会员号
                        // name	字符串	必须		最大：75	用户姓名
                        // telephone	字符串	必须		最大：75	电话
                        // workplace	字符串	可选		最大：75	工作单位
                        // province	字符串	必须			省
                        // city	字符串	必须			市
                        // area	字符串	必须			区/县
                        // town	字符串	必须			镇/街道办
                        // address	字符串	必须			地址
                        // floor	整型	必须			楼层
                        // serviceareaid	整型	可选	0		服务区域ID
                        // housingpropertyid	整型	必须			住所类型ID
                        // remarks	字符串	可选		最大：150	备注
                        // ope_remarks	字符串	可选		最大：75	内部备注
                        // departmentid	整型	必须			配送部门ID
                        // defaults	枚举类型	必须		范围：是/否	状态（是,否）
                        // additionalservices	字符串	可选			附加服务商品
                        // state	枚举类型	必须		范围：正常/取消	状态（正常,取消）
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_User_EditInfo.UpdateUserAddressOfFloor',

                            id: address_info.id,
                            userid: address_info.userid,

                            floor: e.floor * 1,

                            state: address_info.state,
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('修改成功,重新搜索更新楼层')
                            setupdateaddress(false)
                        } else {
                            toast.error('修改失败' + rew.data.tips)
                        }

                    }}>
                        {/* <Form.Input label="姓名" field='name' initValue={address_info.name} />
                        <Form.Input label="电话" field='telephone' initValue={address_info.telephone} /> */}
                        <Form.Input label="楼层" field='floor' type='number' min={1} initValue={address_info.floor} />
                        <Button variant="contained" type="submit">确认修改</Button>
                    </Form>
                </Modal>


                <Modal visible={senmsg} onCancel={() => setsenmsg(false)} onOk={() => {
                    api.current.submitForm()
                }}>
                    <Form getFormApi={e => api.current = e} onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemSetting.SendMobilePhoneMsg',
                            ...e
                        })
                        // console.log(rew)
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('发送成功')
                        } else {
                            toast.error('发送失败')
                        }
                        setsenmsg(false)
                    }}>
                        <Form.Input label="手机号" field='mobile' initValue={tel} />
                        <Form.Input label="内容" field='content' />

                    </Form>
                </Modal>

            </Grid>

        </Grid >
    );
};

export default AddOrder;
