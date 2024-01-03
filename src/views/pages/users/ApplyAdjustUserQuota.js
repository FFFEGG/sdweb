import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import {
    Box, Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import UserInfo from "./UserInfo";

import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Modal, Popconfirm } from "@douyinfe/semi-ui";


const ApplyAdjustUserQuota = ({ customization }) => {

    const initData = JSON.parse(localStorage.getItem('initData'))

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [userinfo, setuserinfo] = useState('')
    const department = initData.DepartmentList.filter(item => item.name === loginuser.login_department)

    const { register, handleSubmit, control, resetField } = useForm({
        defaultValues: {
            starttime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
            salestype: '市场价格优惠',
            sellbykilogram: '否',
            payment: '现金支付'
        }
    });
    const onSubmit = async data => {
        const rew = await request('post', '/api/getInfo', {
            userid: userinfo.userid,
            ...data,
            url: 'Srapp.Web_BusinessProcessing_Handle.ApplyAdjustUserQuota'
        })
        if (rew.code === 200) {
            toast.success('申请成功')
        } else {
            toast.error('申请失败')
        }
        console.log(rew)
    };



    const [admin_operatorlist, setadmin_operatorlist] = useState([])

    useEffect(() => {
        setuserinfo(customization.user)
        const login_departmentid = loginuser.login_departmentid

        //父级部门id
        const department_fid = initData.DepartmentList.filter(item => item.id === login_departmentid)[0].fid

        let arr = []
        initData.DepartmentList.forEach(item => {
            if (item.id === department_fid || item.id === login_departmentid) {
                //管理员opeid数组item.actual_manager_opeids
                // setadmin_operatorlist([...admin_operatorlist, ...item.actual_manager_opeids])
                arr.push(...item.actual_manager_opeids)

            }
        })
        console.log('arr', arr)
        // 通过数组arr 找到 initData.OperatorList中的人员
        const arr2 = initData.OperatorList.filter(item => arr.includes(item.opeid))
        setadmin_operatorlist(arr2)

    }, [customization])


    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <form>
                    <Typography marginBottom={2} fontSize={20}>申请用户信用额度</Typography>

                    <TextField {...register('quota')} InputLabelProps={{ shrink: true }} type="number" label="信用额度"
                        fullWidth
                        sx={{ marginBottom: 2 }} />
                    <TextField {...register('remarks')} InputLabelProps={{ shrink: true }} label="备注"
                        fullWidth sx={{ marginBottom: 2 }} />


                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel InputLabelProps={{ shrink: true }} id="demo-simple-select-label">授权人</InputLabel>
                        <Select
                            inputProps={{ shrink: true }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            {...register('authorized_opeid')}
                        >
                            {
                                admin_operatorlist.map(item => {
                                    return <MenuItem value={item.opeid}>{item.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <Popconfirm title="提示" content="确认操作?" onConfirm={handleSubmit(onSubmit)}>
                        <Button variant="contained">确认授权</Button>
                    </Popconfirm>

                </form>

            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ApplyAdjustUserQuota);
