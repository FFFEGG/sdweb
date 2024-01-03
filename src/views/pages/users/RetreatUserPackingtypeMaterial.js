import React, { useEffect, useState } from 'react';
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
import {getCode} from "../../../utils/getCode";
import RetreatUserPackingtypeMaterialWater from "./RetreatUserPackingtypeMaterialWater";

const RetreatUserPackingtypeMaterial = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([])
    const [type, settype] = useState('票据')
    const [code, setcode] = useState('')
    const [remarks, setremarks] = useState('')
    const [residual, setresidual] = useState(0)
    const [packingtypwarehouseserial, setpackingtypwarehouseserial] = useState('')
    const [packingtypwarehouseid, setpackingtypwarehouseid] = useState('')
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
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

    const getlist = async () => {
        if (!userinfo.userid) {
            return;
        }
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserPackingtypeWarehouse',
            userid: userinfo.userid,
            begintime: '1991-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        })
        const arr = (rew.data).filter(item => (item.state === '正常' || item.state === '已使用'))
        // 排出arr中mode = ‘带入’ && state != ‘正常’的数据
        const arr1 = arr.filter(item => !(item.mode === '带入' && item.state !== '正常'))


        setlist(arr1)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    useEffect(() => {
        getlist()
    }, [userinfo])

    const [isprint, setisprint] = useState('打印')
    return (
        <Box>

            <NavCard title="用户业务办理" subtitle="办理用户退抵押物物资" />
            {
                department_state == 1 ? <>
                <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
                    <UserInfo userinfo={userinfo} />

                    <RetreatUserPackingtypeMaterialWater userinfo={userinfo} list={list} getlist={()=>getlist()} />
                </Box>
                </> :   <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
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
                                { field: 'num', headerName: '数量', },
                                { field: 'billingmode', headerName: '计费方式', },
                                { field: 'billno', headerName: '票据号', },
                                { field: 'price', headerName: '价格', },
                                { field: 'remarks', headerName: '备注', },
                                { field: 'department', headerName: '办理部门', },
                                { field: 'department_use', headerName: '使用部门', },
                                { field: 'operator_use', headerName: '使用人', },
                                { field: 'usetime', headerName: '使用时间', },
                                { field: 'state', headerName: '状态', },
                            ]}
                            rowSelection="single"
                            rowData={list}
                            defaultColDef={{
                                // flex: 1,
                                resizable: true,
                                sortable: true,
                                filter: 'agTextColumnFilter',
                                floatingFilter: true,
                            }}
                            onRowClicked={data => {
                                setpackingtypwarehouseserial(data.data.serial)
                                setpackingtypwarehouseid(data.data.id)
                                setcode(data.data.billno)
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

                    <Box>
                        <TextField value={packingtypwarehouseserial} label="单据号" fullWidth sx={{ mt: 2 }}
                                   InputLabelProps={{ shrink: true }} />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>票据类型</InputLabel>
                            <Select value={type} onChange={(data) => settype(data.target.value)} label="票据类型">
                                <MenuItem value="票据">票据</MenuItem>
                                <MenuItem value="物品">物品</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField type={'password'} value={code} onChange={(data) => setcode(data.target.value)} label="票据号或者物资识别号" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
                        <div>{code}</div>
                        <TextField value={residual} onChange={(data) => setresidual(data.target.value)} label="回收余气/公斤（可选）" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />

                        <TextField value={remarks} id="remarks" onChange={(data) => setremarks(data.target.value)} label="备注" fullWidth
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

                        <Box display={'flex'} flexWrap={'wrap'}>

                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退备用瓶')}>退备用瓶</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面倒闭')}>铺面倒闭</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('经营不下，铺面转让')}>经营不下，铺面转让</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面合同到期')}>铺面合同到期</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('工地项目完工')}>工地项目完工</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退大换小')}>退大换小</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('退小换大')}>退小换大</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用管道燃气')}>改用管道燃气</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用电')}>改用电</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改用环保油')}>改用环保油</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('嫌送气慢')}>嫌送气慢</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('服务态度不满')}>服务态度不满</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('铺面拆迁')}>铺面拆迁</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('因价格换外公司气')}>因价格换外公司气</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => setremarks('改家用，不完全退户')}>改家用，不完全退户</Box>
                            <Box p={1} sx={{ cursor: 'pointer' }} bgcolor={'#eee'} border={1} borderRadius={1} onClick={() => {
                                setremarks('')
                                //光标移动到备注
                                document.getElementById('remarks').focus()
                            }}>其他原因</Box>



                        </Box>
                        <Popconfirm title="提示" content="确认办理？" onConfirm={async () => {
                            let str = await getCode(code)
                            console.log('str',str)
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserPackingtypeMaterial',
                                userid: userinfo.userid,
                                packingtypwarehouseid,
                                packingtypwarehouseserial,
                                type,
                                code: type == '物品'?str.code: code,
                                residualweight: residual
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('办理成功！')
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

export default connect(mapStateToProps)(RetreatUserPackingtypeMaterial);
