import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import NavCard from "../../../ui-component/cards/NavCard";
import UserInfo from "./UserInfo";
import { connect } from "react-redux";
import { Popconfirm } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';
import RetreatUserPackingtypeMoneyWater from "./RetreatUserPackingtypeMoneyWater";

const RetreatUserPackingtypeMoney = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([])
    const [type, settype] = useState('票据')
    const [code, setcode] = useState('')
    const [tktotal, settktotal] = useState(0)
    const [numprice, setnumprice] = useState(0)
    const [residual, setresidual] = useState(0)
    const [packingtypwarehouseserial, setpackingtypwarehouseserial] = useState('')
    const [packingtypwarehouseid, setpackingtypwarehouseid] = useState('')
    const [packageList, setpackageList] = useState([])
    const [selectedRowsList, setSelectedRowsList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [isprint, setisprint] = useState('打印')
    const getlist = async () => {
        if (!userinfo.userid) {
            return;
        }
        setlist([])
        setpackageList([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse',
            userid: userinfo.userid,
            begintime: '1991-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        })
        const arr = (rew.data).filter(item => item.state === '已退物资' && item.mode === '押金')
        setlist(arr)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    useEffect(async () => {
        getlist()
        // 查找用户钢瓶费用

    }, [userinfo])
    const gridRef = useRef()

    const onSelectionChanged = () => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setSelectedRowsList(selectedRows)
        console.log(numprice)
        settktotal(parseFloat(numprice) - selectedRows.reduce((total, item) => total + parseFloat(item.total), 0))
        console.log(selectedRows)
    }


    const [department_state, setdepartment_state] = useState(0)
    useEffect(()=>{
        // 查找配送部id
        let id = initData.DepartmentList.filter(item => item.name === '配送部')[0].id
        // 查找是配送部的部门
        let arr = initData.DepartmentList.filter(item => item.fid === id).map(item=>item.id)
        // 如果登录部门在arr里面 则显示配送部
        if (arr.includes(loginuser.login_departmentid)) {
            setdepartment_state(1)
        } else {
            setdepartment_state(0)
        }
    },[])



    return (
        <Box>

            <NavCard title="用户业务办理" subtitle="办理用户退抵押物款" />
            {
                department_state == 1 ?

                    <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
                        <UserInfo userinfo={userinfo} />

                        <RetreatUserPackingtypeMoneyWater userinfo={userinfo} list={list} getlist={()=>getlist()} />
                    </Box>



                    :
                    <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
                        <UserInfo userinfo={userinfo} />
                        <Box mt={2} height="30vh">
                            <AgGridReact

                                reactUi="true"

                                className="ag-theme-balham"
                                columnDefs={[
                                    { field: 'addtime', headerName: '办理时间', },
                                    { field: 'serial', headerName: '订单号', },
                                    { field: 'mode', headerName: '办理方式', },
                                    { field: 'name', headerName: '商品名称', },
                                    { field: 'packingtype', headerName: '包装物', },
                                    { field: 'billingmode', headerName: '计费方式', },
                                    { field: 'billno', headerName: '票据号', },
                                    { field: 'num', headerName: '数量', },
                                    { field: 'price', headerName: '价格', },
                                    { field: 'remarks', headerName: '备注', },
                                    { field: 'department', headerName: '办理部门', },
                                    { field: 'state', headerName: '状态', },
                                ]}
                                rowSelection="single"
                                rowData={list}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true
                                }}
                                onRowClicked={async data => {
                                    setpackingtypwarehouseserial(data.data.serial)
                                    setpackingtypwarehouseid(data.data.id)
                                    // setcode(data.data.billno)
                                    if (userinfo?.userid) {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_User_Infos.UserPackingtypeChargeRecord',
                                            userid: userinfo.userid
                                        })
                                        const arr = rew.data.filter(item => item.id_packingtypewarehouse === data.data.id && item.state == '正常')
                                        setpackageList(arr)
                                        setnumprice(data.data.num * data.data.price)
                                        settktotal(data.data.num * data.data.price)

                                        // let total = parseFloat(data.data.num) * parseFloat(data.data.price)
                                        // // console.log('total', total)
                                        //
                                        //
                                        // for (let i = 0; i < arr.length; i++) {
                                        //     const order = arr[i];
                                        //     total = total - parseFloat(order.total)
                                        // }
                                        // // console.log('tktotal', total)
                                        //
                                        // settktotal(total)
                                    }
                                }}
                                onGridReady={params => {
                                    params.api.sizeColumnsToFit();
                                }}
                                getRowStyle={params => {
                                    if (params.data && params.data.state === '已使用') {
                                        return { color: "red" }
                                    }

                                    return { color: "black" }
                                }}
                            />
                        </Box>
                        <Box mt={2} height="30vh">

                            <AgGridReact
                                ref={gridRef}
                                reactUi="true"
                                className="ag-theme-balham"
                                onSelectionChanged={onSelectionChanged}
                                rowSelection="multiple"
                                columnDefs={[
                                    {
                                        headerName: '钢瓶费用', children: [

                                            {
                                                headerName: 'serial', field: 'serial', headerCheckboxSelection: true,
                                                headerCheckboxSelectionFilteredOnly: true,
                                                checkboxSelection: true,
                                            },
                                            { field: 'packingtype', headerName: '包装物类型', },
                                            { field: 'project', headerName: '费用', },
                                            { field: 'total', headerName: '金额', },
                                            { field: 'remarks', headerName: '备注', },
                                            { field: 'state', headerName: '状态', },
                                        ]
                                    },
                                ]}

                                rowData={packageList}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true
                                }}

                            />
                        </Box>
                        <Box mt={3}>
                            <TextField value={packingtypwarehouseserial} label="单据号" fullWidth sx={{ mt: 2 }}
                                       InputLabelProps={{ shrink: true }} />


                            <TextField value={code} id="remarks" onChange={(data) => setcode(data.target.value)} label="备注" fullWidth
                                       sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
                            <Box display={'flex'} flexWrap={'wrap'}>

                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('退备用瓶')}>退备用瓶</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('铺面倒闭')}>铺面倒闭</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('经营不下，铺面转让')}>经营不下，铺面转让</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('铺面合同到期')}>铺面合同到期</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('工地项目完工')}>工地项目完工</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('退大换小')}>退大换小</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('退小换大')}>退小换大</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('改用管道燃气')}>改用管道燃气</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('改用电')}>改用电</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('改用环保油')}>改用环保油</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('嫌送气慢')}>嫌送气慢</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('服务态度不满')}>服务态度不满</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('铺面拆迁')}>铺面拆迁</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('因价格换外公司气')}>因价格换外公司气</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setcode('改家用，不完全退户')}>改家用，不完全退户</Box>
                                <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => {
                                    setcode('')
                                    //光标移动到备注
                                    document.getElementById('remarks').focus()
                                }}>其他原因</Box>



                            </Box>
                            <TextField value={tktotal} disabled label="退款金额" fullWidth
                                       sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
                            <Box marginTop={1} marginBottom={1}>
                                <ToggleButtonGroup
                                    color="primary"
                                    exclusive
                                    size="small"
                                    value={isprint}
                                    onChange={(e, data) => {
                                        // console.log(data)
                                        // setsalesmethods(data)
                                        // 记录是否打印 本地
                                        // localStorage.setItem('isprint', data)
                                        setisprint(data)
                                    }}
                                >
                                    <ToggleButton value="打印">打印</ToggleButton>
                                    <ToggleButton value="不打印">不打印</ToggleButton>

                                </ToggleButtonGroup>
                            </Box>

                            <Popconfirm title="提示" content="确认办理？" onConfirm={async () => {

                                if (selectedRowsList.length) {
                                    // 钢瓶缴费信息
                                    const rews = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_BusinessProcessing_Handle.CollectUserPackingtypeCharge',
                                        ids: JSON.stringify(selectedRowsList.map(item => item.id)),
                                        total: selectedRowsList.reduce((total, item) => total + parseFloat(item.total), 0),
                                        remarks: `${loginuser.name} 操作钢瓶缴费信息`,
                                        userid: userinfo.userid
                                    })


                                    if (rews.data.msg === 'SUCCESS') {
                                        toast.success('钢瓶缴费成功')
                                        if (rews.data.printinfo && isprint === '打印') {
                                            myprint(rews.data.printinfo)
                                        }
                                    }

                                }


                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserPackingtypeMoney',
                                    userid: userinfo.userid,
                                    packingtypwarehouseid,
                                    packingtypwarehouseserial,
                                    remarks: code,
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('办理成功！')
                                    setpackingtypwarehouseserial('')
                                    setpackingtypwarehouseid('')
                                    setcode('')
                                    getlist()
                                    if (rew.data.printinfo && isprint === '打印') {
                                        myprint(rew.data.printinfo)
                                    }
                                } else {
                                    toast.error(`办理失败！${rew.data.tips}`)
                                }
                            }}><Button sx={{ mt: 2 }} variant="contained">确认办理</Button></Popconfirm>
                        </Box>
                    </Box>
            }


        </Box>
    );
};
const mapStateToProps = (state) => state

export default connect(mapStateToProps)(RetreatUserPackingtypeMoney);
