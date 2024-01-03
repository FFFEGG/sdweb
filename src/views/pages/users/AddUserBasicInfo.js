import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Autocomplete } from "@mui/material";
import { useForm } from "react-hook-form";
import city from "../../../utils/citys";

import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Form, Modal } from "@douyinfe/semi-ui";


const AddUserBasicInfo = () => {
    const { register, handleSubmit, setValue, reset } = useForm()
    const [citys, setcitys] = useState([])
    const [areas, setareas] = useState([])
    const [towns, settowns] = useState([])
    const [departmentid, setdepartmentid] = useState('')
    const [attributiondepartmentid, setattributiondepartmentid] = useState('')
    const [addsaleman, setaddsaleman] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
 
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [department_state,setdepartment_state] = useState(1)

    const onsubmit = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_EditInfo.AddUserBasicInfo'
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('创建成功')
            reset()
        } else {
            toast.error(`创建失败 ${rew.data.tips}`)
        }
    }
    useEffect(() => {
        register('province')
        register('city')
        register('area')
        register('town')
        // 查找配送部id
        let id = initData.DepartmentList.filter(item => item.name === '配送部')[0].id
        // 查找是配送部的部门
        let arr = initData.DepartmentList.filter(item => item.fid === id).map(item=>item.id)
        // 如果登录部门在arr里面 则显示配送部
        if (arr.includes(loginuser.login_departmentid)) {
            setdepartment_state(1)
        } else {
            setdepartment_state(1)
        }



    }, [])
    const api = useRef()

    return(
            department_state == 0 ?
            <Box padding={3} bgcolor="#fff" >
                <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition='top' onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        ...e,
                        url: 'Srapp.Web_User_EditInfo.AddUserBasicInfo',
                        undefined: JSON.stringify(e.undefined)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('创建成功')
                        api.current.reset()
                    } else {
                        toast.error(`创建失败 ${rew.data.tips}`)
                    }
                }}>
                    <Form.Input style={{ width: 150 }}
                                onBlur={async e => {
                                    // console.log(e)

                                    let memberid = e.target.value
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_User_Infos.UserBasicInfo',
                                        memberid
                                    })
                                    if (rew.data?.userid) {
                                        toast.error('会员号已存在')
                                        api.current.setValue('memberid', '')
                                    }

                                }}
                                required label="会员号" field='memberid' size='small' trigger='blur' rules={[{ required: true, message: '会员号必填' }]} />
                    <Form.Input style={{ width: 150 }} required label="用户姓名" field='name' size='small' trigger='blur' rules={[{ required: true, message: '用户姓名必填' }]} />
                    <Form.Input style={{ width: 150 }} required label="电话" field='telephone' size='small' trigger='blur' rules={[{ required: true, message: '电话必填' }]} />
                    <Form.Input style={{ width: 150 }} label="工作单位" size='small' field='workplace' />
                    <Form.Select style={{ width: 150 }} onChange={(item) => {

                        api.current.setValue('province', item.value)
                        setcitys(item.children)
                        setareas([])
                        settowns([])
                    }} required label="省" size='small' rules={[{ required: true, message: '省必填' }]} >
                        {
                            city.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 150 }} onChange={(item) => {

                        api.current.setValue('city', item.value)
                        setareas(item.children)
                        settowns([])

                    }} required label="市" size='small' rules={[{ required: true, message: '市必填' }]} >
                        {
                            citys.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>



                    <Form.Select style={{ width: 150 }} onChange={(item) => {

                        api.current.setValue('area', item.value)
                        settowns(item.children)


                    }} required label="区/县" size='small' rules={[{ required: true, message: '区/县必填' }]} >
                        {
                            areas.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 150 }} required label="镇/街道办" field='town' size='small' rules={[{ required: true, message: '镇/街道办必填' }]} >
                        {
                            towns.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Input style={{ width: 150 }} required label="地址" field='address' size='small' trigger='blur' rules={[{ required: true, message: '地址必填' }]} />
                    <Form.Input style={{ width: 150 }} initValue={1} label="楼层" field='floor' size='small' rules={[{ required: true, message: '楼层必填' }]} />

                    <Form.Select style={{ width: 150 }} label="星级" field='viplevel' size='small' >

                        <Form.Select.Option value="1">1</Form.Select.Option>
                        <Form.Select.Option value="2">2</Form.Select.Option>
                        <Form.Select.Option value="3">3</Form.Select.Option>
                        <Form.Select.Option value="4">4</Form.Select.Option>
                        <Form.Select.Option value="5">5</Form.Select.Option>

                    </Form.Select>

                    <Form.Select style={{ width: 150 }} required label="住所类型" field='housingpropertyid' size='small' rules={[{ required: true, message: '住所类型必填' }]} >
                        {
                            initData?.HousingpropertyList?.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 150 }} required label="用户类型" field='customertypeid' size='small' rules={[{ required: true, message: '用户类型必填' }]} >
                        {
                            initData?.CustomertypeList?.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select filter style={{ width: 150 }} onChange={e => {
                        setdepartmentid(e)
                        api.current.setValue('serviceareaid', '')
                    }} required label="配送部门" field='distributionstoreid' size='small' rules={[{ required: true, message: '配送部门必填' }]} >
                        {
                            initData.DepartmentList.filter(item => item.type === '业务门店').map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 150 }} showClear label="服务区域" field='serviceareaid' size='small' >
                        {
                            initData?.ServiceAreaList.filter(item => item.departmentid == departmentid).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                        {
                            initData?.ServiceAreaList.filter(item => item.departmentid != departmentid).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 150 }} onChange={e=>setattributiondepartmentid(e)} required label="归属部门" field='attributiondepartmentid' filter size='small' rules={[{ required: true, message: '归属部门必填' }]} >
                        {
                            initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Input style={{ width: 150 }} required label="业务员" field='salesman' rules={[{ required: true, message: '必填' }]} onClick={() => setaddsaleman(true)} size='small' trigger='blur' />
                    <Form.Input style={{ width: 150 }} label="备注" field='remarks' size='small' />
                    <Form.Input style={{ width: 150 }} label="内部备注" field='ope_remarks' size='small' />
                    <Box display={'flex'} alignItems={'end'}>
                        <Button size="small" type="submit" variant="outlined">确认开户</Button>
                    </Box>

                </Form>

                <Modal visible={addsaleman} onCancel={() => setaddsaleman(false)} footer={<></>} style={{ top: 100 }}>
                    <Box mb={1} fontSize={18}>选择业务员</Box>
                    {/*<Select sx={{width: '100%'}}>*/}
                    {/*    {*/}
                    {/*        initData.OperatorList.map(item=><MenuItem value={item.name}>{item.name}</MenuItem>)*/}
                    {/*    }*/}
                    {/*</Select>*/}
                    <Form>
                        <Form.Select size={'large'} filter onChange={e => api.current.setValue('salesman', e)} label={'业务员'} style={{ width: '100%', }}>
                            {
                                initData?.OperatorList?.filter(item=>{
                                    //查找归属部门的部门id
                                    let ids = initData.DepartmentList.map(item=>{
                                        if (item.fid == attributiondepartmentid) {
                                            return item.id
                                        }
                                    })
                                    ids.push(attributiondepartmentid)
                                    if (ids.includes(item.departmentid)) {

                                        return true
                                    }
                                    return false
                                }).map(item =>

                                    <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>
                    </Form>
                    <TextField sx={{ width: '100%', mt: 1 }} placeholder={'手动输入'} onChange={e => api.current.setValue('salesman', e.target.value)} />

                </Modal>

            </Box> :

            <Box padding={3} bgcolor="#fff" >
                <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition='top' onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        ...e,
                        url: 'Srapp.Web_User_EditInfo.AddUserBasicInfo',
                        undefined: JSON.stringify(e.undefined)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('创建成功')
                        api.current.reset()
                    } else {
                        toast.error(`创建失败 ${rew.data.tips}`)
                    }
                }}>
                    <Form.Input style={{ width: 200 }}
                                onBlur={async e => {
                                    // console.log(e)

                                    let memberid = e.target.value
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_User_Infos.UserBasicInfo',
                                        memberid
                                    })
                                    if (rew.data?.userid) {
                                        toast.error('会员号已存在')
                                        api.current.setValue('memberid', '')
                                    }

                                }}
                                required label="会员号" field='memberid' size='large' trigger='blur' rules={[{ required: true, message: '会员号必填' }]} />
                    <Form.Input style={{ width: 200 }} required label="用户姓名" field='name' size='large' trigger='blur' rules={[{ required: true, message: '用户姓名必填' }]} />
                    <Form.Input style={{ width: 200 }} required label="电话" field='telephone' size='large' trigger='blur' rules={[{ required: true, message: '电话必填' }]} />
                    <Form.Input style={{ width: 200 }} label="工作单位" size='large' field='workplace' />
                    <Form.Select style={{ width: 200 }} onChange={(item) => {

                        api.current.setValue('province', item.value)
                        setcitys(item.children)
                        setareas([])
                        settowns([])
                    }} required label="省" size='large' rules={[{ required: true, message: '省必填' }]} >
                        {
                            city.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 200 }} onChange={(item) => {

                        api.current.setValue('city', item.value)
                        setareas(item.children)
                        settowns([])

                    }} required label="市" size='large' rules={[{ required: true, message: '市必填' }]} >
                        {
                            citys.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>



                    <Form.Select style={{ width: 200 }} onChange={(item) => {

                        api.current.setValue('area', item.value)
                        settowns(item.children)


                    }} required label="区/县" size='large' rules={[{ required: true, message: '区/县必填' }]} >
                        {
                            areas.map(item => <Form.Select.Option value={item}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 200 }} required label="镇/街道办" field='town' size='large' rules={[{ required: true, message: '镇/街道办必填' }]} >
                        {
                            towns.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Form.Input style={{ width: 200 }} initValue={1} label="楼层" field='floor' size='large' rules={[{ required: true, message: '楼层必填' }]} />

                    <Form.Select style={{ width: 200 }} label="星级" field='viplevel' size='large' >

                        <Form.Select.Option value="1">1</Form.Select.Option>
                        <Form.Select.Option value="2">2</Form.Select.Option>
                        <Form.Select.Option value="3">3</Form.Select.Option>
                        <Form.Select.Option value="4">4</Form.Select.Option>
                        <Form.Select.Option value="5">5</Form.Select.Option>

                    </Form.Select>
                    <Box width={'100%'}>
                        <Form.Input style={{ width: '88%' }} required label="地址" field='address' size='large' trigger='blur' rules={[{ required: true, message: '地址必填' }]} />

                    </Box>


                    <Form.Select style={{ width: 200 }} required label="住所类型" field='housingpropertyid' size='large' rules={[{ required: true, message: '住所类型必填' }]} >
                        {
                            initData?.HousingpropertyList?.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 200 }} required label="用户类型" field='customertypeid' size='large' rules={[{ required: true, message: '用户类型必填' }]} >
                        {
                            initData?.CustomertypeList?.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select filter style={{ width: 200 }} onChange={e => {
                        setdepartmentid(e)
                        api.current.setValue('serviceareaid', '')
                    }} required label="配送部门" field='distributionstoreid' size='large' rules={[{ required: true, message: '配送部门必填' }]} >
                        {
                            initData.DepartmentList.filter(item => item.type === '业务门店').map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 200 }} showClear label="服务区域" field='serviceareaid' size='large' >
                        {
                            initData?.ServiceAreaList.filter(item => item.departmentid == departmentid).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                        {
                            initData?.ServiceAreaList.filter(item => item.departmentid != departmentid).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select style={{ width: 200 }} onChange={e=>setattributiondepartmentid(e)} required label="归属部门" field='attributiondepartmentid' filter size='large' rules={[{ required: true, message: '归属部门必填' }]} >
                        {
                            initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Input style={{ width: 200 }} required label="业务员" field='salesman' rules={[{ required: true, message: '必填' }]} onClick={() => setaddsaleman(true)} size='large' trigger='blur' />
                    <Form.Input style={{ width: 200 }} label="备注" field='remarks' size='large' />
                    <Form.Input style={{ width: 200 }} label="内部备注" field='ope_remarks' size='large' />
                    <Box width={'100%'} display={'flex'} alignItems={'end'} mt={2}>
                        <Button size="large" type="submit" variant="outlined">确认开户</Button>
                    </Box>

                </Form>

                <Modal visible={addsaleman} onCancel={() => setaddsaleman(false)} footer={<></>} style={{ top: 100 }}>
                    <Box mb={1} fontSize={18}>选择业务员</Box>
                    {/*<Select sx={{width: '100%'}}>*/}
                    {/*    {*/}
                    {/*        initData.OperatorList.map(item=><MenuItem value={item.name}>{item.name}</MenuItem>)*/}
                    {/*    }*/}
                    {/*</Select>*/}
                    <Form>
                        <Form.Select size={'large'} filter onChange={e => api.current.setValue('salesman', e)} label={'业务员'} style={{ width: '100%', }}>
                            {
                                initData?.OperatorList?.filter(item=>{
                                    //查找归属部门的部门id
                                    let ids = initData.DepartmentList.map(item=>{
                                        if (item.fid == attributiondepartmentid) {
                                            return item.id
                                        }
                                    })
                                    ids.push(attributiondepartmentid)
                                    if (ids.includes(item.departmentid)) {

                                        return true
                                    }
                                    return false
                                }).map(item =>

                                    <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>
                    </Form>
                    <TextField sx={{ width: '100%', mt: 1 }} placeholder={'手动输入'} onChange={e => api.current.setValue('salesman', e.target.value)} />

                </Modal>

            </Box>

    )




};

export default AddUserBasicInfo;
