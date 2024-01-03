import React, { useEffect, useState } from 'react';
import NavCard from "../../../ui-component/cards/NavCard";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    IconButton,
    Typography,
    Table,
    Stack,
    Skeleton, Paper
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Tabs from '@mui/material/Tabs';

import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles';
import { border, styled } from '@mui/system';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import request from "../../../utils/request";
import AddOrder from "./AddOrder";
import UserInfo from "./UserInfo";
import HistoryList from "./historyList";
import { connect } from "react-redux";
import UserPackingtypeWarehouse from "./UserPackingtypeWarehouse";
import UserOrderInfo from "./UserOrderInfo";
import UserHoldPackingtypeInfo from "./UserHoldPackingtypeInfo";
import UserAddress from "./address";
import UserCouponInfo from "./UserCouponInfo";
import UserGoodsSalesRecord from "./UserGoodsSalesRecord";
import UserPackingtypeChargeRecord from "./UserPackingtypeChargeRecord";
import UserPackingtypeChargeSalespromotion from "./UserPackingtypeChargeSalespromotion";
import UserPackingtypeSalespromotion from "./UserPackingtypeSalespromotion";
import UserGoodsSalespromotion from "./UserGoodsSalespromotion";
import UserGoodsWarehouse from "./UserGoodsWarehouse";
import AddOrderZs from "./AddOrderZs";
import { Col, Row } from '@douyinfe/semi-ui';
import UserAdjustQuotaList from './UserAdjustQuotaList';
import UserSalesSecurityCheckRecord from "./UserSalesSecurityCheckRecord";
import UserOtherServicesOrderInfo from "./UserOtherServicesOrderInfo";
import UserInvoiceInfo from "./UserInvoiceInfo";
import UserExclusiveSalesman from "./UserExclusiveSalesman";
import UserCurrentArrearsUnLockList from "./UserCurrentArrearsUnLockList";
import UserGoodsArrearsRecord from "./UserGoodsArrearsRecord";
import UserOrderResidualRecord from "./UserOrderResidualRecord";
import UserSnsBindingInfo from "./UserSnsBindingInfo";
import AdvancePaymentOrderList from "./AdvancePaymentOrderList";
import UserGoodsCollectionsRecord from './UserGoodsCollectionsRecord';
import UserInformationUpdateRecord from './UserInformationUpdateRecord';
import UserInvoiceRecord from './UserInvoiceRecord';
import UserRemarksRecord from './UserRemarksRecord';
import UserOtherDataListuser from "./UserOtherDataListuser";
// import {useParams} from "react-router-dom";

const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
};

const UserBasicInfo = ({ customization }) => {
    // console.log(customization)
    // console.log(33)
    // const theme = useTheme();
    // const [list, setlist] = useState([{
    //     goodsname: '商品1',
    //     price: 100,
    //     num: 1
    // }, {
    //     goodsname: '运费',
    //     price: 0.5,
    //     num: 2
    // }])
    // useEffect(() => {
    //     // 新增商品
    //     let newlist = [...list];
    //     newlist.push({
    //         goodsname: '商品2',
    //         price: 200,
    //         num: 1,
    //     });

    //     // 查找list中运费的下标
    //     let index = newlist.findIndex((item) => item.goodsname === '运费');
    //     // 删除下标为index的元素
    //     newlist.splice(index, 1);
    //     // 添加新商品的运费
    //     newlist.push({
    //         goodsname: '运费',
    //         price: 0.5,
    //         num: 8,
    //     });

    //     // 重新赋值
    //     setlist(newlist);
    // }, []);



    const [value, setValue] = React.useState('1');
    const [memberid, setmemberid] = React.useState('');
    const [userinfo, setuserinfo] = React.useState('');
    const [department, setdepartment] = useState('')
    const [transactiondetails, settransactiondetails] = useState([])
    const [tel, settel] = useState('')

    useEffect(() => {
        // console.log('customization.user',JSON.parse(customization.user.transactiondetails))
        setuserinfo(customization.user)
        setuserinfo(customization.user)
        // setdepartment(customization.user.department)
        settel(customization.user.telephone)
        if (customization.user.transactiondetails) {
            settransactiondetails(JSON.parse(customization.user.transactiondetails) || [])
        } else {
            settransactiondetails([])
        }
        const searchParams = new URLSearchParams(location.search);
        // console.log('searchParams',searchParams)
        const tab = searchParams.get('tab')
        if (tab == 1) {
            setValue(999)
        }
        // useParams 获取get路由参数
        // console.log('useParams',useParams())

    }, [customization])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const submit = async () => {
        const rew = await request('post', '/api/getInfo', {
            memberid,
            url: 'Srapp.Web_User_Infos.UserBasicInfo'
        })

    }



    return (
        <div>
            <NavCard title="会员查询" subtitle="用户业务办理" />
            <Card sx={{
                mt: 1,
                p: 2
            }}>

                {userinfo ?
                    <Grid container alignItems="stretch" sx={{ mt: 2 }}>
                        <Grid item md={8} xs={12}>
                            <Box className="paper" variant="outlined" sx={{ overflowX: "scroll", paddingBottom: 1 }}>
                                <UserInfo setdepartment={setdepartment} department={department} userinfo={userinfo} />
                            </Box>
                        </Grid>
                        <Grid sx={{
                            paddingLeft: {
                                md: 2,
                                xs: 0
                            },
                            paddingTop: {
                                md: 0,
                                xs: 2
                            },
                            paddingBottom: 1
                        }} item md={4} xs={12}>

                            <HistoryList setdepartment={setdepartment} settel={settel} transactiondetails={transactiondetails} />
                        </Grid>
                    </Grid>



                    : ''}


                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ bgcolor: "#f8f8f8", mt: 2 }}>
                            <Paper variant="outlined" sx={{ bgcolor: "#f8f8f8" }}>
                                <TabList

                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    onChange={handleChange}
                                >

                                    <Tab label="全部菜单" value="999" />
                                    <Tab label="预约下单" value="1" />
                                    <Tab label="商品直售" value="222" />
                                    <Tab label="用户修改资料记录" value="31" />
                                    <Tab label="地址信息" value="0" />

                                    <Tab label="收款信息" value="27" />
                                    <Tab label="销售信息" value="3" />
                                    <Tab label="订单信息" value="4" />
                                    <Tab label="抵押物收费信息" value="5" />
                                    <Tab label="抵押物费用优惠信息" value="6" />
                                    <Tab label="抵押物优惠信息" value="7" />
                                    <Tab label="抵押物库存信息" value="8" />
                                    <Tab label="各类价格优惠信息" value="9" />
                                    <Tab label="商品库存信息" value="10" />
                                    {/* <Tab label="残液信息" value="11" /> */}
                                    <Tab label="维修记录信息" value="12" />
                                    {/* <Tab label="退瓶（物资）信息" value="13" /> */}
                                    <Tab label="安检记录信息" value="14" />
                                    {/* <Tab label="SNS绑定信息" value="15" /> */}
                                    {/*<Tab label="用户欠款信息" value="16" />*/}
                                    {/* <Tab label="部门维修记录" value="17" /> */}
                                    <Tab label="发票信息" value="18" />
                                    <Tab label="用户开票资料信息" value="181" />
                                    <Tab label="用户未回空信息" value="19" />
                                    <Tab label="优惠券列表" value="20" />
                                    <Tab label="信用额度申请列表" value="21" />
                                    <Tab label="用户专属业务员信息" value="22" />
                                    <Tab label="现结欠款用户解锁记录" value="23" />
                                    <Tab label="获取用户欠款记录信息" value="24" />
                                    <Tab label="订单余气记录" value="25" />
                                    <Tab label="平台绑定信息" value="26" />
                                    <Tab label="用户备注信息" value="111" />
                                    <Tab label="获取用户其它数据列表" value="112" />

                                </TabList>
                            </Paper>
                        </Box>
                        <TabPanel sx={{ p: 0 }} value="999" >
                            <Row>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("111") }} variant="outlined">用户备注信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("1") }} variant="outlined">预约下单</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("31") }} variant="outlined">修改资料记录</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("0") }} variant="outlined">地址列表</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("27") }} variant="outlined">收款信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("3") }} variant="outlined">销售信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("4") }} variant="outlined">订单信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("5") }} variant="outlined">抵押物收费信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("6") }} variant="outlined">抵押物费用优惠信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("7") }} variant="outlined">抵押物优惠信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("8") }} variant="outlined">抵押物库存信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("9") }} variant="outlined">各类价格优惠信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("10") }} variant="outlined">商品库存信息</Box></Col>
                                {/* <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("11") }} variant="outlined">残液信息</Box></Col> */}
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("12") }} variant="outlined">维修记录信息</Box></Col>
                                {/* <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("13") }} variant="outlined">退瓶（物资）信息</Box></Col> */}
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("14") }} variant="outlined">安检记录信息</Box></Col>
                                {/* <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("15") }} variant="outlined">SNS绑定信息</Box></Col> */}
                                {/*<Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("16") }} variant="outlined">用户欠款信息</Box></Col>*/}
                                {/* <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("17") }} variant="outlined">部门维修记录</Box></Col> */}
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("18") }} variant="outlined">发票信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("181") }} variant="outlined">用户开票资料信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("19") }} variant="outlined">用户未回空信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("20") }} variant="outlined">优惠券列表</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("21") }} variant="outlined">信用额度申请列表</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("22") }} variant="outlined">用户专属业务员信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("23") }} variant="outlined">现结欠款用户解锁记录</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("24") }} variant="outlined">获取用户欠款记录信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("25") }} variant="outlined">订单余气记录</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("26") }} variant="outlined">平台绑定信息</Box></Col>
                                <Col span={6}>  <Box sx={{ cursor: 'pointer' }} p={2} m={1} border={1} fontSize={20} fullWidth onClick={() => { setValue("112") }} variant="outlined">获取用户其它数据列表</Box></Col>
                            </Row>


                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value="111">
                            {/* <AddOrder setdepartment={setdepartment} tel={tel} department={department} userinfo={userinfo} /> */}
                            <UserRemarksRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value="1">
                            <AddOrder setdepartment={setdepartment} tel={tel} department={department} userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value="222">
                            <AddOrderZs setdepartment={setdepartment} tel={tel} department={department} userinfo={userinfo} />
                        </TabPanel>

                        <TabPanel sx={{ p: 0 }} value="31">
                            <UserInformationUpdateRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="0" sx={{ p: 0, py: 1 }}>
                            <UserAddress userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="27" sx={{ p: 0, py: 1 }}>
                            <UserGoodsCollectionsRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="3" sx={{ p: 0, py: 1 }}>
                            <UserGoodsSalesRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel sx={{ p: 0 }} value="4">
                            <UserOrderInfo userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="5" sx={{ p: 0, py: 1 }}>
                            <UserPackingtypeChargeRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="6" sx={{ p: 0, py: 1 }}>
                            <UserPackingtypeChargeSalespromotion userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="7" sx={{ p: 0, py: 1 }}>
                            <UserPackingtypeSalespromotion userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="8" sx={{ p: 0, py: 1 }}>
                            <UserPackingtypeWarehouse userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="9" sx={{ p: 0, py: 1 }}>
                            <UserGoodsSalespromotion userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="10" sx={{ p: 0, py: 1 }}>
                            <UserGoodsWarehouse userinfo={userinfo} />
                        </TabPanel>
                        {/* <TabPanel value="11">残液信息</TabPanel> */}
                        <TabPanel value="12" sx={{ p: 0, py: 1 }}>
                            <UserOtherServicesOrderInfo userinfo={userinfo} />
                        </TabPanel>
                        {/* <TabPanel value="13">退瓶（物资）信息</TabPanel> */}
                        <TabPanel value="14" sx={{ p: 0, py: 1 }}>
                            <UserSalesSecurityCheckRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="15">SNS绑定信息</TabPanel>
                        <TabPanel value="16">用户欠款信息</TabPanel>
                        {/* <TabPanel value="17">部门维修记录</TabPanel> */}
                        <TabPanel value="18" sx={{ p: 0, py: 1 }}>
                            <UserInvoiceRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="181" sx={{ p: 0, py: 1 }}>

                            <UserInvoiceInfo userinfo={userinfo} />

                        </TabPanel>
                        <TabPanel value="19" sx={{ p: 0, py: 1 }}>
                            <UserHoldPackingtypeInfo userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="20" sx={{ p: 0, py: 1 }}>
                            <UserCouponInfo userinfo={userinfo} />
                        </TabPanel>

                        <TabPanel value="21" sx={{ p: 0, py: 1 }}>
                            <UserAdjustQuotaList userinfo={userinfo} />
                        </TabPanel>


                        <TabPanel value="22" sx={{ p: 0, py: 1 }}>
                            <UserExclusiveSalesman userinfo={userinfo} />
                        </TabPanel>

                        <TabPanel value="23" sx={{ p: 0, py: 1 }}>
                            <UserCurrentArrearsUnLockList userinfo={userinfo} />
                        </TabPanel>


                        <TabPanel value="24" sx={{ p: 0, py: 1 }}>
                            <UserGoodsArrearsRecord userinfo={userinfo} />
                        </TabPanel>

                        <TabPanel value="25" sx={{ p: 0, py: 1 }}>
                            <UserOrderResidualRecord userinfo={userinfo} />
                        </TabPanel>
                        <TabPanel value="26" sx={{ p: 0, py: 1 }}>
                            <UserSnsBindingInfo userinfo={userinfo} />
                        </TabPanel>

                        <TabPanel value="112" sx={{ p: 0, py: 1 }}>
                            <UserOtherDataListuser userinfo={userinfo} />
                        </TabPanel>

                    </TabContext>
                </Box>

            </Card>

        </div>
    );
};
const mapStateToProps = (state) => {
    console.log('会员中心', state)
    return state
}

export default connect(mapStateToProps)(UserBasicInfo);
