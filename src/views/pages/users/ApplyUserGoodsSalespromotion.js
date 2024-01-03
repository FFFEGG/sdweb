import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import {
    Autocomplete,
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

import { useForm, Controller, set } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Form, Modal, Select as Selects } from "@douyinfe/semi-ui";


const ApplyUserGoodsSalespromotion = ({ customization }) => {

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const department = initData.DepartmentList.filter(item => item.name === loginuser.login_department)

    const [userinfo, setuserinfo] = useState('')

    const { register, handleSubmit, control, resetField, setValue } = useForm({
        defaultValues: {
            starttime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
            salestype: '市场价格优惠',
            sellbykilogram: '否',
            payment: '现金支付'
        }
    });
    const onSubmit = async data => {
        Modal.confirm({
            title: '提示',
            content: '确认办理？',
            style: {
                top: '30%'
            },
            onOk: async () => {
                const rew = await request('post', '/api/getInfo', {
                    userid: userinfo.userid,
                    ...data,
                    url: 'Srapp.Web_BusinessProcessing_Handle.ApplyUserGoodsSalespromotion'
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('申请成功')
                    // resetField('goodsid')
                    // resetField('price')
                    // resetField('starttime')
                    // resetField('endtime')
                    // resetField('remarks')
                    // resetField('salestype')
                    // resetField('sellbykilogram')
                    // resetField('payment')
                    // resetField('authorized_opeid')
                } else {
                    toast.error('申请失败' + rew.data.tips)
                }
                console.log(rew)
            }
        })

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
                                userid: userinfo.userid,
                                ...e,
                                url: 'Srapp.Web_BusinessProcessing_Handle.ApplyUserGoodsSalespromotion'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('申请成功')
                                // resetField('goodsid')
                                // resetField('price')
                                // resetField('starttime')
                                // resetField('endtime')
                                // resetField('remarks')
                                // resetField('salestype')
                                // resetField('sellbykilogram')
                                // resetField('payment')
                                // resetField('authorized_opeid')
                                api.current.reset()
                            } else {
                                toast.error('申请失败' + rew.data.tips)
                            }
                            console.log(rew)
                        }
                    })
                }}>
                    <Typography marginBottom={2} fontSize={20}>用户优惠申请</Typography>
                    <Form.Select rules={[{ required: true, message: "必填" }]} field={'goodsid'} label={'优惠商品'} filter style={{ width: '100%' }} size="large">
                        {
                            initData.GoodsList.filter(item => (parseFloat(item.price) > 0)).map(({ id, name, price }, index) => (<Form.Select.Option key={index} value={id}>{name}-￥{price}</Form.Select.Option>))
                        }
                    </Form.Select>
                    <Form.Input min={0} rules={[{ required: true, message: "必填" }]} field={'price'} label={'优惠金额'}  size="large" />
                    <Form.Input rules={[{ required: true, message: "必填" }]} field={'starttime'} label={'开始时间'} type={'date'} size="large" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input rules={[{ required: true, message: "必填" }]} field={'endtime'} label={'结束时间'} type={'date'} size="large" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'remarks'} label={'备注'} size="large" />
                    <Form.Select rules={[{ required: true, message: "必填" }]} field={'salestype'} label={'优惠方式'} filter style={{ width: '100%' }} size="large">
                        <Form.Select.Option value={'市场价格优惠'}>市场价格优惠</Form.Select.Option>
                        <Form.Select.Option value={'固定价格优惠'}>固定价格优惠</Form.Select.Option>
                    </Form.Select>
                    <Form.Select rules={[{ required: true, message: "必填" }]} field={'sellbykilogram'} label={'折公斤售卖'} filter style={{ width: '100%' }} size="large">
                        <Form.Select.Option value={'是'}>是</Form.Select.Option>
                        <Form.Select.Option value={'否'}>否</Form.Select.Option>
                    </Form.Select>
                    <Form.Select rules={[{ required: true, message: "必填" }]} field={'payment'} label={'支付方式'} filter style={{ width: '100%' }} size="large">
                        <Form.Select.Option value={'现金支付'}>现金支付</Form.Select.Option>
                        <Form.Select.Option value={'月结支付'}>月结支付</Form.Select.Option>
                    </Form.Select>
                    <Form.Select rules={[{ required: true, message: "必填" }]} field={'authorized_opeid'} label={'授权人'} filter style={{ width: '100%' }} size="large">
                        {

                            admin_operatorlist.map(item => {
                                return <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                            })
                        }
                    </Form.Select>

                    <Button type="submit" variant="contained" size="large">确认申请</Button>


                </Form>
                {/* <form>
                    <Typography marginBottom={2} fontSize={20}>商品优惠申请</Typography>
                    <Selects
                        filter
                        labelId="demo-simple-select-labels"
                        id="demo-simple-select"
                        prefix="优惠商品 ID "
                        style={{ width: '100%', border: '1px solid #ccc', height: '50px', marginBottom: '15px' }}
                        onChange={e => {
                            setValue('goodsid', e)
                        }}
                    >
                        {
                            initData.GoodsList.filter(item => (parseFloat(item.price) > 0)).map(({ id, name, price }, index) => (<Selects.Option key={index} value={id}>{name}-￥{price}</Selects.Option>))
                        }
                    </Selects>
                    <TextField {...register('price')} InputLabelProps={{ shrink: true }} type="number" label="优惠金额"
                        fullWidth
                        sx={{ marginBottom: 2 }} />
                    <TextField {...register('starttime')} InputLabelProps={{ shrink: true }} type="date" label="开始时间"
                        fullWidth sx={{ marginBottom: 2 }} />
                    <TextField {...register('endtime')} InputLabelProps={{ shrink: true }} type="date" label="结束时间"
                        fullWidth
                        sx={{ marginBottom: 2 }} />
                    <TextField {...register('remarks')} InputLabelProps={{ shrink: true }} label="备注" fullWidth
                        sx={{ marginBottom: 2 }} />

                    <Box sx={{ marginBottom: 2 }}>
                        <Typography fontSize={15}>优惠方式</Typography>
                        <Controller
                            control={control}
                            name="salestype"
                            render={({ field }) => <ToggleButtonGroup
                                color="primary"
                                exclusive
                                {...field}
                                onChange={e => field.onChange(e.target.value)}
                                size="small"
                            >
                                <ToggleButton value="市场价格优惠">市场价格优惠</ToggleButton>
                                <ToggleButton value="固定价格优惠">固定价格优惠</ToggleButton>

                            </ToggleButtonGroup>
                            }
                        />

                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography fontSize={15}>折公斤售卖（是否可录余气）</Typography>
                        <Controller
                            name="sellbykilogram"
                            control={control}
                            render={({ field }) => <ToggleButtonGroup
                                color="primary"
                                exclusive
                                {...field}
                                onChange={e => field.onChange(e.target.value)}
                                size="small"
                            >
                                <ToggleButton value="是">是   &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  </ToggleButton>
                                <ToggleButton value="否">否   &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  </ToggleButton>

                            </ToggleButtonGroup>}
                        />

                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography fontSize={15}>支付方式（所有支付都可享受优惠，仅月结支付时用户才能使用月结支付方式）</Typography>
                        <Controller
                            control={control}
                            name="payment"
                            render={({ field }) =>
                                <ToggleButtonGroup
                                    {...field}
                                    color="primary"
                                    exclusive
                                    onChange={e => field.onChange(e.target.value)}
                                    size="small"
                                >
                                    <ToggleButton value="现金支付">现金支付</ToggleButton>
                                    <ToggleButton value="月结支付">月结支付</ToggleButton>

                                </ToggleButtonGroup>
                            }
                        />
                    </Box>

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

                    <Button onClick={handleSubmit(onSubmit)} variant="contained">确认申请</Button>
                </form> */}

            </Box>
        </Box >
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ApplyUserGoodsSalespromotion);
