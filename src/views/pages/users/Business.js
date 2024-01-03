import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Button, FormControl, MenuItem, InputLabel, Select, TextField } from "@mui/material";

import UserInfo from "./UserInfo";
import { connect } from "react-redux";
import { useEffect, useRef, useState } from "react";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import moment from "moment";

import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import { Modal } from "@douyinfe/semi-ui";
import myprint from 'utils/myprint';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {

    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}




const Business = ({ customization }) => {
    const gridRef1 = useRef();
    const gridRef2 = useRef();
    const [value, setValue] = React.useState(0);
    const [bill, setbill] = React.useState('');
    const [serial, setserial] = React.useState('');
    const [userinfo, setuserinfo] = useState('')
    const [UserCollectPackingtypeMaterialRecord, setUserCollectPackingtypeMaterialRecord] = useState([])
    const [GridRowsProp, setGridRowsProp] = useState([])
    const [GridRowsProp2, setGridRowsProp2] = useState([])
    const [GridRowsProp1, setGridRowsProp1] = useState([])
    const [GridRowsProp3, setGridRowsProp3] = useState([])
    const [dpinfo, setdpinfop] = useState('')
    const [remarks, setremarks] = useState('')
    const [URecord, setURecord] = useState('')
    const [num, setnum] = useState(1)
    const [payment, setpayment] = useState('现金支付')
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const setbillstr = () => {
        // 随机生成票据号 16位数字
        let str = ''
        for (let i = 0; i < 16; i++) {
            str += Math.floor(Math.random() * 10)
        }
        setbill(str)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    const getwuinfo = async () => {
        // 获取物资信息
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserCollectPackingtypeMaterialRecord',
            userid: userinfo.userid,
            begintime: moment().month(-2).format('YYYY-MM-DD'),
            endtime: moment().format('YYYY-MM-DD')
        })
        if (rew.code === 200) {
            const arr = rew.data.filter(item => (item.state === '正常'))
            // const arr = rew.data.filter(item => (item.state === '正常' || item.state === '冻结'))
            setUserCollectPackingtypeMaterialRecord(arr)
        }

    }


    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>


            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="带瓶入户" {...a11yProps(0)} />
                    <Tab label="抵押物押金" {...a11yProps(1)} />
                    <Tab label="抵押物销售" {...a11yProps(2)} />
                    <Tab label="抵押物借用" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

                <Button onClick={async () => {
                    console.log(userinfo)
                    // 获取物资信息
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserPackingtypeModeList',
                        userid: userinfo.userid,
                        customertypeid: userinfo.customertypeid,
                    })
                    if (rew.code === 200) {
                        const arr = (rew.data).filter(item => item.mode === '带入')
                        setGridRowsProp(arr)
                    }

                }} variant="outlined" sx={{ marginBottom: 1 }}>获取带瓶信息</Button>

                <Box overflow="scroll" height="40vh">
                    <AgGridReact
                        ref={gridRef1}
                        localeText={tanslations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'mode', headerName: '办理方式', },
                            { field: 'name', headerName: '商品名称', },
                            { field: 'packingtype', headerName: '包装物', },
                            { field: 'billingmode', headerName: '计费方式', },
                            { field: 'price', headerName: '价格', },
                        ]}

                        rowSelection="single"
                        onRowClicked={(data) => {
                            setdpinfop(data.data)
                        }}
                        rowClass="my-row"
                        rowData={GridRowsProp}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                            filter: 'agTextColumnFilter', // 文本过滤器
                            floatingFilter: true, // 现在过滤器
                        }}
                    />
                </Box>

                <Button onClick={getwuinfo} variant="outlined" sx={{ my: 1 }}>获取物资信息</Button>

                <Box overflow="scroll" height="40vh">

                    <AgGridReact
                        ref={gridRef2}
                        localeText={tanslations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'serial', headerName: '订单号', },
                            { field: 'addtime', headerName: '添加时间', },
                            { field: 'code', headerName: '识别码', },
                            { field: 'num', headerName: '数量', },
                            { field: 'packingtype', headerName: '类型', },
                            { field: 'department', headerName: '办理门店', },
                            { field: 'operator', headerName: '办理人', },
                            { field: 'remarks', headerName: '备注', },
                        ]}

                        rowClass="my-row"
                        rowSelection="single"
                        onRowClicked={(data) => {
                            setURecord(data.data)
                        }}

                        rowData={UserCollectPackingtypeMaterialRecord}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                            filter: 'agTextColumnFilter', // 文本过滤器
                            floatingFilter: true, // 现在过滤器
                        }}
                    />
                </Box>


                <TextField required value={remarks} onChange={(e) => {
                    setremarks(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="备注" fullWidth sx={{ marginTop: 1 }} />

                <TextField value={num} onChange={(e) => {
                    setnum(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="数量" fullWidth sx={{ marginTop: 1 }} />

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-label">支付方式</InputLabel>
                    <Select
                        inputProps={{ shrink: true }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="支付方式"
                        value={payment}
                        onChange={(data) => {
                            console.log(data)
                            setpayment(data.target.value)
                        }}
                    >
                        <MenuItem value="现金支付">现金支付</MenuItem>
                        <MenuItem value="余额支付">余额支付</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={async () => {
                    // if (remarks === '') {
                    //     toast.error('请输入备注')
                    //     return
                    // }

                    Modal.confirm({
                        title: '提示',
                        content: '确认办理？',
                        style: {
                            top: '30%'
                        },
                        onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                userid: userinfo.userid,
                                packingtypemodeid: dpinfo.id,
                                code: URecord.code,
                                serial: URecord.serial,
                                price: dpinfo.price,
                                remarks,
                                num,
                                payment,
                                url: 'Srapp.Web_BusinessProcessing_Handle.BringInUserPackingtypeWarehouse'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('办理成功')
                                gridRef1.current.api.deselectAll()
                                gridRef2.current.api.deselectAll()
                                setURecord('')
                                setdpinfop('')
                                getwuinfo()
                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.error('办理失败' + rew.data.tips)
                            }
                        }
                    })

                }} variant="outlined" sx={{ marginTop: 1 }}>确认办理</Button>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Button onClick={async () => {
                    console.log(userinfo)
                    // 获取物资信息
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserPackingtypeModeList',
                        userid: userinfo.userid,
                        customertypeid: userinfo.customertypeid,
                    })
                    if (rew.code === 200) {
                        const arr = (rew.data).filter(item => item.mode === '押金')
                        setGridRowsProp1(arr)

                        // 随机生成票据号 16位数字
                        setbillstr()


                    }

                }} variant="outlined" sx={{ marginBottom: 1 }}>获取抵押物押金信息</Button>

                <Box overflow="scroll" height="40vh">
                    <AgGridReact
                        ref={gridRef2}
                        localeText={tanslations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'mode', headerName: '办理方式', },
                            { field: 'name', headerName: '商品名称', },
                            { field: 'packingtype', headerName: '包装物', },
                            { field: 'billingmode', headerName: '计费方式', },
                            { field: 'price', headerName: '价格', },
                        ]}

                        rowSelection="single"
                        onRowClicked={(data) => {
                            setdpinfop(data.data)
                            setbillstr()
                        }}
                        rowClass="my-row"
                        rowData={GridRowsProp1}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                            filter: 'agTextColumnFilter', // 文本过滤器
                            floatingFilter: true, // 现在过滤器
                        }}
                    />
                </Box>


                <TextField value={bill} onChange={(e) => {
                    setbill(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="票据号" fullWidth sx={{ marginTop: 1 }} />

                <TextField value={num} onChange={(e) => {
                    // if (e.target.value > 5) {
                    //     setnum(5)
                    //     return
                    // }
                    setnum(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="数量" fullWidth sx={{ marginTop: 1 }} />

                <TextField required value={remarks} onChange={(e) => {
                    setremarks(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="备注" fullWidth sx={{ marginTop: 1 }} />

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-label">支付方式</InputLabel>
                    <Select
                        inputProps={{ shrink: true }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="支付方式"
                        value={payment}
                        onChange={(data) => {
                            console.log(data)
                            setpayment(data.target.value)
                        }}
                    >
                        <MenuItem value="现金支付">现金支付</MenuItem>
                        <MenuItem value="余额支付">余额支付</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={async () => {
                    // if (remarks === '') {
                    //     toast.error('请输入备注')
                    //     return
                    // }
                    Modal.confirm({
                        title: '提示',
                        content: '确认办理？',
                        style: {
                            top: '30%'
                        },
                        onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                userid: userinfo.userid,
                                packingtypemodeid: dpinfo.id,
                                billno: bill,
                                price: dpinfo.price,
                                remarks,
                                num,
                                payment,
                                url: 'Srapp.Web_BusinessProcessing_Handle.CreateUserPackingtypeWarehouse'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('办理成功')
                                gridRef2.current.api.deselectAll()
                                setdpinfop('')
                                getwuinfo()
                                setbillstr()
                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.success('办理失败')
                            }
                        }
                    })

                }} variant="outlined" sx={{ marginTop: 1 }}>确认办理</Button>

            </TabPanel>
            <TabPanel value={value} index={2}>
                <Button onClick={async () => {
                    console.log(userinfo)
                    // 获取物资信息
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserPackingtypeModeList',
                        userid: userinfo.userid,
                        customertypeid: userinfo.customertypeid,
                    })
                    if (rew.code === 200) {
                        const arr = (rew.data).filter(item => item.mode === '销售')
                        setGridRowsProp2(arr)
                    }

                }} variant="outlined" sx={{ marginBottom: 1 }}>获取抵押物销售信息</Button>

                <Box overflow="scroll" height="40vh">
                    <AgGridReact
                        ref={gridRef1}
                        localeText={tanslations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'mode', headerName: '办理方式', },
                            { field: 'name', headerName: '商品名称', },
                            { field: 'packingtype', headerName: '包装物', },
                            { field: 'billingmode', headerName: '计费方式', },
                            { field: 'price', headerName: '价格', },
                        ]}

                        rowSelection="single"
                        onRowClicked={(data) => {
                            setdpinfop(data.data)
                            setbillstr()
                        }}
                        rowClass="my-row"
                        rowData={GridRowsProp2}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                            filter: 'agTextColumnFilter', // 文本过滤器
                            floatingFilter: true, // 现在过滤器
                        }}
                    />
                </Box>



                <TextField value={bill} onChange={(e) => {
                    setbill(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="票据号" fullWidth sx={{ marginTop: 1 }} />

                <TextField value={num} onChange={(e) => {
                    setnum(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="数量" fullWidth sx={{ marginTop: 1 }} />
                <TextField value={remarks} onChange={(e) => {
                    setremarks(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="备注" fullWidth sx={{ marginTop: 1 }} />

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-label">支付方式</InputLabel>
                    <Select
                        inputProps={{ shrink: true }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="支付方式"
                        value={payment}
                        onChange={(data) => {
                            console.log(data)
                            setpayment(data.target.value)
                        }}
                    >
                        <MenuItem value="现金支付">现金支付</MenuItem>
                        <MenuItem value="余额支付">余额支付</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={async () => {
                    // if (remarks === '') {
                    //     toast.error('请输入备注')
                    //     return
                    // }
                    Modal.confirm({
                        title: '提示',
                        content: '确认办理？',
                        style: {
                            top: '30%'
                        },
                        onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                userid: userinfo.userid,
                                packingtypemodeid: dpinfo.id,
                                billno: bill,
                                price: dpinfo.price,
                                remarks,
                                num,
                                payment,
                                url: 'Srapp.Web_BusinessProcessing_Handle.CreateUserPackingtypeWarehouse'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('办理成功')
                                gridRef1.current.api.deselectAll()
                                setURecord('')
                                setdpinfop('')
                                getwuinfo()

                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.success('办理失败')
                            }
                        }
                    })

                }} variant="outlined" sx={{ marginTop: 1 }}>确认办理</Button>

            </TabPanel>
            <TabPanel value={value} index={3}>
                <Button onClick={async () => {
                    console.log(userinfo)
                    // 获取物资信息
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_Infos.UserPackingtypeModeList',
                        userid: userinfo.userid,
                        customertypeid: userinfo.customertypeid,
                    })
                    if (rew.code === 200) {
                        const arr = (rew.data).filter(item => item.mode === '借用')
                        setGridRowsProp3(arr)
                        // 随机生成票据号 16位数字
                        setbillstr()
                    }

                }} variant="outlined" sx={{ marginBottom: 1 }}>获取抵押物借用信息</Button>

                <Box overflow="scroll" height="40vh">
                    <AgGridReact
                        ref={gridRef1}
                        localeText={tanslations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'mode', headerName: '办理方式', },
                            { field: 'name', headerName: '商品名称', },
                            { field: 'packingtype', headerName: '包装物', },
                            { field: 'billingmode', headerName: '计费方式', },
                            { field: 'price', headerName: '价格', },
                        ]}

                        rowSelection="single"
                        onRowClicked={(data) => {
                            setdpinfop(data.data)
                        }}
                        rowClass="my-row"
                        rowData={GridRowsProp3}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                        }}
                    />
                </Box>




                <TextField value={bill} onChange={(e) => {
                    setbill(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="票据号" fullWidth sx={{ marginTop: 1 }} />


                <TextField value={num} onChange={(e) => {
                    setnum(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="数量" fullWidth sx={{ marginTop: 1 }} />


                <TextField required value={remarks} onChange={(e) => {
                    setremarks(e.target.value)
                }} InputLabelProps={{ shrink: true }} label="备注" fullWidth sx={{ marginTop: 1 }} />

                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-simple-select-label">支付方式</InputLabel>
                    <Select
                        inputProps={{ shrink: true }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="支付方式"
                        value={payment}
                        onChange={(data) => {
                            console.log(data)
                            setpayment(data.target.value)
                        }}
                    >
                        <MenuItem value="现金支付">现金支付</MenuItem>
                        <MenuItem value="余额支付">余额支付</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={async () => {
                    // if (remarks === '') {
                    //     toast.error('请输入备注')
                    //     return
                    // }
                    Modal.confirm({
                        title: '提示',
                        content: '确认办理？',
                        style: {
                            top: '30%'
                        },
                        onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                userid: userinfo.userid,
                                packingtypemodeid: dpinfo.id,
                                billno: bill,
                                price: dpinfo.price,
                                remarks,
                                num,
                                payment,
                                url: 'Srapp.Web_BusinessProcessing_Handle.CreateUserPackingtypeWarehouse'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('办理成功')
                                gridRef1.current.api.deselectAll()
                                setURecord('')
                                setdpinfop('')
                                getwuinfo()
                                setbillstr()
                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.success('办理失败')
                            }
                        }
                    })

                }} variant="outlined" sx={{ marginTop: 1 }}>确认办理</Button>

            </TabPanel>

        </Box>
    );
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Business);
