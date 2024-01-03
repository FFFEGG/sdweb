import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import UserInfo from "./UserInfo";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Form, Modal } from "@douyinfe/semi-ui";

const ApplyUserPackingtypeChargeSalespromotion = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const { register, handleSubmit, control, resetField, setValue } = useForm({
        defaultValues: {
            starttime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    });
    const department = initData.DepartmentList.filter(item => item.name === loginuser.login_department)

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


    const onSubmit = async (data) => {
        Modal.confirm({
            title: '提示',
            content: '确认办理？',
            style: {
                top: '30%'
            },
            onOk: async () => {
                const rew = await request('post', '/api/getInfo', {
                    ...data,
                    url: 'Srapp.Web_BusinessProcessing_Handle.ApplyUserPackingtypeChargeSalespromotion',
                    userid: userinfo.userid
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('申请成功')

                } else {
                    toast.error('申请失败')
                }
            }
        })


    }



    const api = useRef()
    useEffect(() => {
        console.log(userinfo)
        if (userinfo.customertype !== '家庭用户') {
            //默认两年
            // setValue('starttime', moment(new Date()).format('YYYY-MM-DD'))
            setValue('endtime', moment(new Date()).add(2, 'years').format('YYYY-MM-DD'))
            api.current.setValue('endtime', moment(new Date()).add(2, 'years').format('YYYY-MM-DD'))
        } else {
            setValue('endtime', moment(new Date()).format('YYYY-MM-DD'))
            api.current.setValue('endtime', moment(new Date()).format('YYYY-MM-DD'))
        }

    }, [userinfo])

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">

                <Form getFormApi={e => api.current = e} labelPosition="inset" onSubmit={async e => {
                    Modal.confirm({
                        title: '提示',
                        content: '确认办理？',
                        style: {
                            top: '30%'
                        },
                        onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                ...e,
                                url: 'Srapp.Web_BusinessProcessing_Handle.ApplyUserPackingtypeChargeSalespromotion',
                                userid: userinfo.userid
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('申请成功')
                                api.current.reset()
                            } else {
                                toast.error('申请失败')
                            }
                        }
                    })
                }}>
                    <Typography marginBottom={2} fontSize={20}>申请用户包装物费用优惠</Typography>
                    {/* <form>
                    <Typography marginBottom={2} fontSize={20}>申请用户包装物费用优惠</Typography>
                    <TextField    {...register('discount')} sx={{ marginBottom: 2 }} label="折扣参数X(费用=计算费用*X)" fullWidth InputLabelProps={{ shrink: true }} />

                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="demo-simple-select-labels">计费模式ID</InputLabel>
                        <Select
                            {...register('billingmodeid')}
                            labelId="demo-simple-select-labels"
                            id="demo-simple-select"
                            label="计费模式ID"
                        >
                            {
                                initData.PackingtypeBillingModeList.map(({ name, id }) => <MenuItem value={id}>{name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField {...register('starttime')} InputLabelProps={{ shrink: true }} type="date" label="开始时间"
                        fullWidth sx={{ marginBottom: 2 }} />
                    <TextField {...register('endtime')} InputLabelProps={{ shrink: true }} type="date" label="结束时间"
                        fullWidth
                        sx={{ marginBottom: 2 }} />

                    <TextField {...register('remarks')} InputLabelProps={{ shrink: true }} label="备注"
                        fullWidth
                        sx={{ marginBottom: 2 }} />
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
                                })}
                        </Select>
                    </FormControl>

                    <Button onClick={handleSubmit(onSubmit)} variant="contained">确认申请</Button>

                </form> */}

                    <Form.Input rules={[{ required: true, message: '必填' }]} field='discount' label='折扣参数X(费用=计算费用*X)' size="large" />
                    <Form.Select rules={[{ required: true, message: '必填' }]} field='billingmodeid' label='计费模式ID' size="large" style={{ width: '100%' }}>
                        {
                            initData.PackingtypeBillingModeList.map(({ name, id }) => <Form.Select.Option value={id}>{name}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Form.Input rules={[{ required: true, message: '必填' }]} field='starttime' label='开始时间' size="large" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input rules={[{ required: true, message: '必填' }]} field='endtime' label='结束时间' size="large" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field='remarks' label='备注' size="large" />
                    <Form.Select rules={[{ required: true, message: '必填' }]} field='authorized_opeid' label='授权人' size="large" style={{ width: '100%' }}>
                        {
                            admin_operatorlist.map(item => {
                                return <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                            })
                        }
                    </Form.Select>
                    <Button type="submit" variant="contained" size="large">确认申请</Button>

                </Form>


            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ApplyUserPackingtypeChargeSalespromotion);
