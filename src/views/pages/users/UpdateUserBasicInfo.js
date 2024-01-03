import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Button,
    Typography
} from "@mui/material";
import request from "../../../utils/request";
import { connect } from "react-redux";
import city from "../../../utils/city";

import { toast } from "react-toastify";
import { Form, Cascader, Popconfirm, Table, Modal, ArrayField, Button as Btn, Switch } from '@douyinfe/semi-ui';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import { set } from 'react-hook-form';



const UpdateUserBasicInfo = ({ customization }) => {

    const api = useRef();
    const addressapi = useRef();
    const btapi = useRef();
    const [citys, setcity] = useState([])
    const [area, setareas] = useState([])
    const [town, settown] = useState([])
    const [Btshow, setBtshow] = useState(false)
    const [open, setopen] = useState(false)
    const [yeopen, setyeopen] = useState(false)
    const [couponopen, setcouponopen] = useState(false)
    useEffect(() => {
        console.log('user', customization.user);
        api.current.setValues(customization.user)
        if (customization.user) {
            setopen(customization.user.printshowprice === '是' ? true : false)
            setyeopen(customization.user.printshowbalance === '是' ? true : false)
            setcouponopen(customization.user.canusecoupon === '是' ? true : false)
        }

        for (let i = 0; i < city.length; i += 1) {
            if (customization.user.province === city[i].value) {

                setcity(city[i].children)

                for (let j = 0; j < city[i].children.length; j += 1) {
                    if (customization.user.city === city[i].children[j].value) {
                        setareas(city[i].children[j].children)

                        for (let k = 0; k < city[i].children[j].children.length; k += 1) {
                            // console.log(city[i].children[j].children[k].value)
                            if (customization.user.area === city[i].children[j].children[k].value) {
                                // console.log(city[i].children[j].children[k])
                                settown(city[i].children[j].children[k].children)
                                break;
                            }

                        }

                        break;

                    }
                }
                break
            }
        }


    }, [customization])


    const initData = JSON.parse(localStorage.getItem('initData'))

    const onsubmit = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_User_EditInfo.UpdateUserBasicInfo'
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('创建成功')

        } else {
            toast.error(`创建失败 ${rew.data.tips}`)
        }
    }


    const handleSelectChange = (value) => {
        console.log('value', value);

    }
    const [list, setlist] = useState([])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserAddress',
            userid: customization.user.userid
        })
        setlist(rew.data)
    }
    const [show, setshow] = useState(false)


    return (
        <Box>
            <Box p={3} bgcolor="#FFF" borderRadius={2}>
                <Typography display="flex" fontSize={20}>修改用户基本资料</Typography>
                <Box mt={2} bgcolor="#fff">
                    <Form layout='horizontal' labelPosition='inset' getFormApi={formApi => {
                        api.current = formApi
                    }} onValueChange={values => console.log(values)}>

                        <Form.Input field='memberid' disabled prefix='会员号' size="large"
                            style={{ width: 250, marginBottom: 10 }} />
                        <Form.Input field='name' prefix='用户名' size="large" style={{ width: 250, marginBottom: 10 }} />
                        <Form.Input field='telephone' prefix='电话号码' size="large"
                            style={{ width: 250, marginBottom: 10 }} />
                        <Form.Input field='workplace' prefix='工作单位' size="large"
                            style={{ width: 250, marginBottom: 10 }} />

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='province'
                            prefix='省'
                            onChange={(data) => {
                                for (let i = 0; i < city.length; i += 1) {
                                    if (city[i].value === data) {
                                        // console.log(data)
                                        setcity(city[i].children)
                                        api.current.setValue('province', data)
                                        api.current.setValue('city', '')
                                        api.current.setValue('area', '')
                                        api.current.setValue('town', '')
                                        break
                                    }
                                }
                            }}>
                            {
                                city.map(item => <Form.Select.Option
                                    value={item.value}>{item.value}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='city' prefix='市'
                            onChange={(data) => {
                                for (let i = 0; i < citys.length; i += 1) {
                                    if (citys[i].value === data) {
                                        // console.log(data)
                                        setareas(citys[i].children)
                                        api.current.setValue('city', data)
                                        api.current.setValue('area', '')
                                        api.current.setValue('town', '')
                                        break
                                    }
                                }
                            }}>
                            {
                                citys.map(item => <Form.Select.Option
                                    value={item.value}>{item.value}</Form.Select.Option>)
                            }
                        </Form.Select>


                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='area'
                            prefix='区/县'
                            onChange={(data) => {
                                for (let i = 0; i < citys.length; i += 1) {
                                    if (area[i].value === data) {
                                        // console.log(data)
                                        settown(area[i].children)
                                        api.current.setValue('area', data)
                                        api.current.setValue('town', '')
                                        break
                                    }
                                }
                            }}>
                            {
                                area.map(item => <Form.Select.Option
                                    value={item.value}>{item.value}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='town'
                            prefix='镇/街道办'>
                            {
                                town.map(item => <Form.Select.Option
                                    value={item.value}>{item.value}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Input field='floor' prefix='楼层' size="large" style={{ width: 250, marginBottom: 10 }} />
                        <Form.Input field='viplevel' prefix='VIP等级' size="large"
                            style={{ width: 250, marginBottom: 10 }} />


                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }}
                            field='housingpropertyid'
                            prefix='住所类型'>
                            {
                                initData.HousingpropertyList.map(item => <Form.Select.Option
                                    value={item.id}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='customertypeid'
                            prefix='用户类型'>
                            {
                                initData.CustomertypeList.map(item => <Form.Select.Option
                                    value={item.id}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='serviceareaid'
                            prefix='服务区域'>
                            {
                                initData.ServiceAreaList.map(item => <Form.Select.Option
                                    value={item.id}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }}
                            field='attributiondepartmentid' prefix='归属部门'>
                            {
                                initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option
                                    value={item.id}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>


                        <Form.Select filter size="large" style={{ width: 250, marginBottom: 10 }} field='salesman'
                            prefix='业务员'>
                            {
                                initData.OperatorList.map(item => <Form.Select.Option
                                    value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Select filter field='state' prefix='状态' size="large"
                            style={{ width: 250, marginBottom: 10 }}>
                            <Form.Select.Option value="正常">正常</Form.Select.Option>
                            <Form.Select.Option value="取消">取消</Form.Select.Option>
                        </Form.Select>
                        <Form.Input field='address' prefix='详细地址' size="large" style={{ width: 516, marginBottom: 10 }} />
                        <Form.Input field='remarks' prefix='备注' size="large" style={{ width: 516, marginBottom: 10 }} />
                        <Form.Input field='ope_remarks' prefix='内部备注' size="large"
                            style={{ width: 516, marginBottom: 10 }} />
                        <Box width={'100vw'}>
                            {
                                customization.user && <Box display={'flex'} alignItems={'center'} style={{ width: 516 }} p={1} bgcolor={'#eee'} borderRadius={1} mb={1}>
                                    <Typography sx={{ mr: 1, fontWeight: 'bold', pl: 0.5 }}>订单是否打印价格</Typography>
                                    <Switch checked={open} onChange={async e => {
                                        console.log(e);
                                        setopen(e)
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_User_EditInfo.UpdateUserPricePrintConfig',
                                            userid: customization.user.userid,
                                            show: e ? '是' : '否'
                                        })
                                    }} />
                                </Box>
                            }
                            {
                                customization.user && <Box display={'flex'} alignItems={'center'} style={{ width: 516 }} p={1} bgcolor={'#eee'} borderRadius={1} mb={1}>
                                    <Typography sx={{ mr: 1, fontWeight: 'bold', pl: 0.5 }}>订单是否打印余额</Typography>
                                    <Switch checked={yeopen} onChange={async e => {
                                        console.log(e);
                                        setyeopen(e)
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_User_EditInfo.UpdateUserBalancePrintConfig',
                                            userid: customization.user.userid,
                                            show: e ? '是' : '否'
                                        })
                                    }} />
                                </Box>
                            }

                            {
                                customization.user && <Box display={'flex'} alignItems={'center'} style={{ width: 516 }} p={1} bgcolor={'#eee'} borderRadius={1} mb={1}>
                                    <Typography sx={{ mr: 1, fontWeight: 'bold', pl: 0.5 }}>用户是否可用优惠券</Typography>
                                    <Switch checked={couponopen} onChange={async e => {
                                        console.log(e);
                                        setcouponopen(e)
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_User_EditInfo.UpdateUserCanUseCouponConfig',
                                            userid: customization.user.userid,
                                            show: e ? '是' : '否'
                                        })
                                    }} />
                                </Box>
                            }
                        </Box>



                    </Form>
                    <Popconfirm title="提示" content="确认操作？" onConfirm={async () => {
                        const rew = await request('post', '/api/getInfo', {
                            ...api.current.getValues(),
                            userid: customization.user.userid,
                            url: 'Srapp.Web_User_EditInfo.UpdateUserBasicInfo',
                            memberid: customization.user.memberid
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('修改成功')
                        } else {
                            toast.error('修改失败')
                            toast.error(rew.data.tips)
                        }
                        api.current.reset()
                        // console.log(rew);
                    }}>
                        <Button variant="contained">确认修改</Button>
                    </Popconfirm>

                </Box>
            </Box>
            <Box p={3} mt={3} bgcolor="#FFF" borderRadius={2}>
                <Typography fontSize={20}>用户地址信息</Typography>
                <Box mt={2} bgcolor="#fff">
                    {
                        customization.user.userid ? <Box> <Button onClick={getlist} variant="contained">刷新</Button>
                            <Button variant="contained" onClick={() => {
                                setshow(true)
                                setTimeout(() => {
                                    addressapi.current.setValue('action', 'ADD')
                                    addressapi.current.setValue('id', 0)
                                    addressapi.current.setValue('userid', customization.user.userid)
                                    addressapi.current.setValue('memberid', customization.user.memberid)
                                    addressapi.current.setValue('name', customization.user.name)
                                    addressapi.current.setValue('telephone', customization.user.telephone)
                                    addressapi.current.setValue('workplace', customization.user.workplace)
                                }, 1000)
                            }} sx={{ ml: 3 }}>新增</Button></Box> : ''
                    }

                    <Box mt={3}>
                        <Table bordered size="small" dataSource={list} columns={[

                            {
                                title: '姓名', dataIndex: 'name',
                            },
                            { title: '卡号', dataIndex: 'memberid' },
                            { title: '电话', dataIndex: 'telephone' },
                            { title: '单位', dataIndex: 'workplace' },
                            { title: '地址', dataIndex: 'address' },
                            { title: '部门', dataIndex: 'department' },
                            { title: '默认', dataIndex: 'defaults' },
                            { title: '状态', dataIndex: 'state' },
                            {
                                title: '操作', render: data => <Box>

                                    <Button size="small" onClick={() => {
                                        console.log(data)
                                        setshow(true)
                                        setTimeout(() => {
                                            if (data.additionalservices.length > 0) {
                                                addressapi.current.setValue('additionalservices', JSON.parse(data.additionalservices))
                                            } else {
                                                addressapi.current.setValue('additionalservices', [])
                                            }

                                            addressapi.current.setValues(data)
                                            addressapi.current.setValue('action', 'UPDATE')
                                            addressapi.current.setValue('id', data.id)
                                            addressapi.current.setValue('userid', data.userid)
                                            // addressapi.current.setValue('name', data.name)
                                            addressapi.current.setValue('memberid', data.memberid)

                                        }, 400)
                                    }}>修改</Button>


                                    <Button size="small" onClick={async () => {
                                        // const rew = await request('post','/api/getInfo',{
                                        //     url: '',
                                        //
                                        // })
                                        setBtshow(true)
                                        setTimeout(() => {
                                            btapi.current.setValue('subsidy', data.subsidy)
                                            btapi.current.setValue('addressid', data.id)
                                            btapi.current.setValue('userid', data.userid)
                                        }, 400)
                                    }}>补贴录入</Button>
                                </Box>
                            },
                        ]} />
                    </Box>

                    <Modal visible={Btshow} footer={<></>} onCancel={() => setBtshow(false)} style={{ top: '10%', width: '70vw', left: '5%' }}>
                        <Box fontSize={18} mb={3}>补贴信息录入</Box>
                        <Form getFormApi={e => btapi.current = e} labelPosition={"inset"} onSubmit={async e => {
                            console.log(e)

                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_User_EditInfo.UserAddressDistributionSubsidyOfCompany',
                                ...e,
                                subsidy: JSON.stringify(e.subsidy)
                            })

                            if (rew.code === 200) {
                                toast.success('成功')
                            } else {
                                toast.error('失败')
                            }
                            setBtshow(false)
                        }}>
                            <ArrayField field='subsidy' >
                                {({ add, arrayFields, addWithInitValue }) => (
                                    <Box >
                                        <Btn onClick={add} theme='light'> 新增补贴记录</Btn>
                                        {
                                            arrayFields.map(({ field, key, remove }, i) => (
                                                <Box key={key} style={{ display: 'flex', flexWrap: "wrap" }}>

                                                    <Form.Select
                                                        field={`${field}[type]`}
                                                        label="补贴类型"
                                                        style={{ width: 200 }}
                                                        zIndex={999999}
                                                        rules={[{ required: true, message: '必填' }]}
                                                    >
                                                        <Form.Select.Option value="超远补贴">超远补贴</Form.Select.Option>
                                                        <Form.Select.Option value="抬楼补贴">抬楼补贴</Form.Select.Option>
                                                    </Form.Select>

                                                    <Form.Input field={`${field}[price]`} rules={[{ required: true, message: '必填' }]} style={{ width: 150 }} label={'单价'} />



                                                    <Form.Select
                                                        field={`${field}[goodsid]`}
                                                        label="商品"
                                                        style={{ width: 200 }}
                                                        rules={[{ required: true, message: '必填' }]}
                                                        zIndex={999999}
                                                        initValue={'5'}
                                                        onChange={e => {
                                                            console.log(e)

                                                        }}
                                                    >
                                                        {
                                                            initData.GoodsList.map(item =>
                                                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                                                            )
                                                        }

                                                    </Form.Select>

                                                    <Form.Select
                                                        field={`${field}[department]`}
                                                        label="部门"
                                                        rules={[{ required: true, message: '必填' }]}
                                                        style={{ width: 200 }}
                                                        initValue={'运输公司'}
                                                        filter
                                                        zIndex={999999}
                                                    >
                                                        {
                                                            initData.DepartmentList.filter(item => item.type === '业务门店').map(item =>
                                                                <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                                                            )
                                                        }

                                                    </Form.Select>

                                                    <Form.Input field={`${field}[remarks]`} rules={[{ required: true, message: '必填' }]} style={{ width: 150 }} label={'备注'} />
                                                    <Btn type='danger' theme='borderless' onClick={remove}
                                                        style={{ margin: 12 }}>删除</Btn>
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                )}
                            </ArrayField>

                            <Button variant={"contained"} type={"submit"}>确认添加</Button>
                        </Form>

                    </Modal >


                    <Modal
                        visible={show}
                        title="地址添加修改"
                        onCancel={() => setshow(false)}
                        onOk={async () => {
                            const rew = await request('post', '/api/getInfo', {
                                ...addressapi.current.getValues(),
                                url: 'Srapp.Web_User_EditInfo.UserAddress',
                                additionalservices: JSON.stringify(addressapi.current.getValues().additionalservices),
                                memberid: customization.user.memberid
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('操作成功')
                            } else {
                                toast.error('操作失败' + rew.data.tips)
                            }
                            getlist()
                            setshow(false)
                        }}
                        centered
                        bodyStyle={{ overflow: 'auto', height: 400 }}
                        style={{ top: '10%', width: '50%' }}
                    >
                        <Form layout='horizontal' labelPosition='inset' getFormApi={formApi => {
                            addressapi.current = formApi
                        }} onValueChange={values => console.log(values)}>



                            <Form.Input field='name' size="large" label="姓名" style={{ width: '44vw', marginBottom: 10 }} />
                            <Form.Input field='telephone' size="large" label="电话"
                                style={{ width: '44vw', marginBottom: 10 }} />
                            <Form.Input field='workplace' size="large" label="工作单位"
                                style={{ width: '44vw', marginBottom: 10 }} />
                            <Form.Select filter initValue={'广西壮族自治区'} size="large" style={{ width: '44vw', marginBottom: 10 }} field='province'
                                prefix='省'
                                onChange={(data) => {
                                    for (let i = 0; i < city.length; i += 1) {
                                        if (city[i].value === data) {
                                            // console.log(data)
                                            setcity(city[i].children)
                                            addressapi.current.setValue('province', data)
                                            addressapi.current.setValue('city', '')
                                            addressapi.current.setValue('area', '')
                                            addressapi.current.setValue('town', '')
                                            break
                                        }
                                    }
                                }}>
                                {
                                    city.map(item => <Form.Select.Option
                                        value={item.value}>{item.value}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }} field='city'
                                prefix='市'
                                onChange={(data) => {
                                    for (let i = 0; i < citys.length; i += 1) {
                                        if (citys[i].value === data) {
                                            // console.log(data)
                                            setareas(citys[i].children)
                                            addressapi.current.setValue('city', data)
                                            addressapi.current.setValue('area', '')
                                            addressapi.current.setValue('town', '')
                                            break
                                        }
                                    }
                                }}>
                                {
                                    citys.map(item => <Form.Select.Option
                                        value={item.value}>{item.value}</Form.Select.Option>)
                                }
                            </Form.Select>


                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }} field='area'
                                prefix='区/县'
                                onChange={(data) => {
                                    for (let i = 0; i < citys.length; i += 1) {
                                        if (area[i].value === data) {
                                            // console.log(data)
                                            settown(area[i].children)
                                            addressapi.current.setValue('area', data)
                                            addressapi.current.setValue('town', '')
                                            break
                                        }
                                    }
                                }}>
                                {
                                    area.map(item => <Form.Select.Option
                                        value={item.value}>{item.value}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }} field='town'
                                prefix='镇/街道办'>
                                {
                                    town.map(item => <Form.Select.Option
                                        value={item.value}>{item.value}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Input field='address' size="large" label="地址"
                                style={{ width: '44vw', marginBottom: 10 }} />
                            <Form.Input field='floor' size="large" label="楼层"
                                style={{ width: '44vw', marginBottom: 10 }} />

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }} field='serviceareaid'
                                         prefix='服务区域'>
                                {
                                    initData.ServiceAreaList.map(item => <Form.Select.Option
                                        value={item.id}>{item.name}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }}
                                field='housingpropertyid'
                                prefix='住所类型'>
                                {
                                    initData.HousingpropertyList.map(item => <Form.Select.Option
                                        value={item.id}>{item.name}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Input field='remarks' size="large" label="备注"
                                style={{ width: '44vw', marginBottom: 10 }} />
                            <Form.Input field='ope_remarks' size="large" label="内部备注"
                                style={{ width: '44vw', marginBottom: 10 }} />

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }}
                                field='departmentid'
                                prefix='配送部门'>
                                {
                                    initData.DepartmentList.map(item => <Form.Select.Option
                                        value={item.id}>{item.label}</Form.Select.Option>)
                                }
                            </Form.Select>


                            <ArrayField field='additionalservices'>
                                {({ add, arrayFields, addWithInitValue }) => (
                                    <Box>
                                        <Btn onClick={add} icon={<IconPlusCircle />} style={{ marginBottom: 10 }} theme='light'>新增运费(拓展部)</Btn>
                                        {
                                            arrayFields.map(({ field, key, remove }, i) => (
                                                <Box key={key} style={{ display: 'flex', flexWrap: "wrap", marginBottom: 10 }}>
                                                    <Form.Select
                                                        field={`${field}[goodsId]`}
                                                        label={`商品`}
                                                        zIndex={999999}
                                                        style={{ width: 200, marginRight: 16 }}
                                                    >
                                                        {
                                                            initData.GoodsList.filter(item => item.stocktype === '液化气').map(item => <Form.Select.Option
                                                                value={item.id}>{item.name}</Form.Select.Option>)
                                                        }
                                                    </Form.Select>
                                                    <Form.Select
                                                        field={`${field}[freightId]`}
                                                        label={`费用`}
                                                        zIndex={999999}
                                                        style={{ width: 200, marginRight: 16 }}
                                                    >
                                                        {
                                                            initData.GoodsList.filter(item => item.name.includes('运费')).map(item => <Form.Select.Option
                                                                value={item.id}>{item.name}- ￥{parseFloat(item.price)}</Form.Select.Option>)
                                                        }
                                                    </Form.Select>
                                                    <Form.Input
                                                        initValue={1}
                                                        field={`${field}[freightNum]`}
                                                        label={`数量`}
                                                        type='number'
                                                        zIndex={999999}
                                                        style={{ width: 100, marginRight: 16 }}
                                                    />

                                                    <Btn
                                                        type='danger'
                                                        theme='borderless'
                                                        icon={<IconMinusCircle />}
                                                        onClick={remove}

                                                    />
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                )}
                            </ArrayField>

                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }}
                                field='defaults'
                                prefix='默认'>
                                <Form.Select.Option value="是">是</Form.Select.Option>
                                <Form.Select.Option value="否">否</Form.Select.Option>
                            </Form.Select>
                            <Form.Select filter size="large" style={{ width: '44vw', marginBottom: 10 }}
                                field='state'
                                prefix='状态'>
                                <Form.Select.Option value="正常">正常</Form.Select.Option>
                                <Form.Select.Option value="取消">取消</Form.Select.Option>
                            </Form.Select>


                        </Form>
                    </Modal>
                </Box>
            </Box>
        </Box >
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(UpdateUserBasicInfo);
