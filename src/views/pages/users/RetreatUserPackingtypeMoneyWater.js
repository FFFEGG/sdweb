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
import UserPackingtypeWarehouse from "./UserPackingtypeWarehouse";
import { Popconfirm } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';
import RetreatUserPackingtypeMaterialWater from "./RetreatUserPackingtypeMaterialWater";

const RetreatUserPackingtypeMoneyWater = ({userinfo,list,getlist}) => {

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


    const gridRef = useRef()

    const onSelectionChanged = () => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        setSelectedRowsList(selectedRows)
        setpackingtypwarehouseserial(selectedRows.map(item => item.serial).join(','))
        console.log(numprice)
        settktotal(selectedRows.reduce((total, item) => total + parseFloat(item.price * item.num), 0))
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

                        <Box mt={2} height="40vh">
                            <AgGridReact

                                reactUi="true"
                                ref={gridRef}
                                className="ag-theme-balham"
                                columnDefs={[
                                    { field: 'addtime', headerName: '办理时间', checkboxSelection: true, headerCheckboxSelection: true, },
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
                                rowSelection="multiple"
                                rowData={list}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true
                                }}
                                // onRowClicked={async data => {
                                //     setpackingtypwarehouseserial(data.data.serial)
                                //     setpackingtypwarehouseid(data.data.id)
                                //     // setcode(data.data.billno)
                                //     if (userinfo?.userid) {
                                //         const rew = await request('post', '/api/getInfo', {
                                //             url: 'Srapp.Web_User_Infos.UserPackingtypeChargeRecord',
                                //             userid: userinfo.userid
                                //         })
                                //         const arr = rew.data.filter(item => item.id_packingtypewarehouse === data.data.id && item.state == '正常')
                                //         setpackageList(arr)
                                //         setnumprice(data.data.num * data.data.price)
                                //         settktotal(data.data.num * data.data.price)
                                //
                                //         // let total = parseFloat(data.data.num) * parseFloat(data.data.price)
                                //         // // console.log('total', total)
                                //         //
                                //         //
                                //         // for (let i = 0; i < arr.length; i++) {
                                //         //     const order = arr[i];
                                //         //     total = total - parseFloat(order.total)
                                //         // }
                                //         // // console.log('tktotal', total)
                                //         //
                                //         // settktotal(total)
                                //     }
                                // }}


                                onSelectionChanged={onSelectionChanged}

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


                                for (let i = 0; i < selectedRowsList.length; i++) {
                                    setTimeout(async ()=>{

                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserPackingtypeMoney',
                                            userid: userinfo.userid,
                                            packingtypwarehouseid: selectedRowsList[i].id,
                                            packingtypwarehouseserial: selectedRowsList[i].serial,
                                            remarks: code,
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('办理成功！')
                                            // setpackingtypwarehouseserial('')
                                            // setpackingtypwarehouseid('')
                                            // setcode('')
                                            getlist()
                                            if (rew.data.printinfo && isprint === '打印') {
                                                myprint(rew.data.printinfo)
                                            }
                                        } else {
                                            toast.error(`办理失败！${rew.data.tips}`)
                                        }
                                    }, i*500)
                                }


                            }}><Button sx={{ mt: 2 }} variant="contained">确认办理</Button></Popconfirm>
                        </Box>

        </Box>
    );
};

export default (RetreatUserPackingtypeMoneyWater);
