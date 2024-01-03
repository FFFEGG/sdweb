import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { Modal, Form, ArrayField, Button as Btn } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import { set } from 'react-hook-form';


const GiveProgrammeList = () => {
    const api = useRef();
    const [list, setlist] = useState([])
    const [goods, setgoods] = useState([])
    const [coupon, setcoupon] = useState([])
    const [show, setshow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
    const { Option } = Form.Select;
    const getList = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GiveProgrammeList'
        })
        setlist(rew.data.info)
        console.log(rew);
    }

    return (
        <Box p={3} bgcolor="#fff" borderRadius={1}>
            <Box display="flex">
                <Button onClick={getList} variant="contained" style={{ marginRight: 10 }}>刷新</Button>
                <Button onClick={() => {
                    setgoods([])
                    setcoupon([])
                    setshow(true)
                    setTimeout(() => {
                        api.current.reset()
                    }, 500)

                }} variant="contained">新增</Button>
            </Box>

            <Box mt={3} height="80vh" overflow="scroll">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {
                            headerName: '方案名称', field: 'name'
                        },
                        {
                            headerName: '类型', field: 'type'
                        },
                        {
                            headerName: '状态', field: 'state'
                        },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) => (
                                <Button onClick={() => {
                                    console.log(data)
                                    setgoods(data.detailed.goods)
                                    setcoupon(data.detailed.coupon)
                                    setshow(true)
                                    setTimeout(() => {
                                        api.current.setValues({ ...data })
                                        api.current.setValue('action', 'UPDATE')
                                        api.current.setValue('id', data.id)
                                    }, 500)


                                }}>修改</Button>
                            )
                        },

                    ]}
                />
            </Box>

            <Modal
                visible={show}
                onCancel={() => setshow(false)}
                width={1000}
                height={500}
                zIndex={99999}
                title="方案新增/修改"
                style={{
                    top: '10%',
                }}
                bodyStyle={{
                    overflow: 'scroll'
                }}
                footer={<></>}
            >
                <Form getFormApi={e => api.current = e} initValues={{
                    id: 0,
                    action: 'ADD'
                }} onValueChange={values => console.log(values)} onSubmit={async e => {
                    const list = e.detailed
                    // console.log(list)
                    if (list.coupon) {
                        for (let i = 0; i < list.coupon.length; i += 1) {
                            list.coupon[i].num = parseInt(list.coupon[i].num, 10)
                            list.coupon[i].takeeffectdays = parseInt(list.coupon[i].takeeffectdays, 10)
                            list.coupon[i].days = parseInt(list.coupon[i].days, 10)
                            list.coupon[i].minconsumption = parseInt(list.coupon[i].minconsumption, 10)
                        }
                    }


                    if (list.goods) {
                        for (let i = 0; i < list.goods.length; i += 1) {
                            list.goods[i].num = parseInt(list.goods[i].num, 10)
                            list.goods[i].returnable = parseInt(list.goods[i].returnable, 10)
                            list.goods[i].days = parseInt(list.goods[i].days, 10)
                            list.goods[i].takeeffectdays = parseInt(list.goods[i].takeeffectdays, 10)
                        }
                    }

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingGiveProgramme',
                        ...e,
                        detailed: JSON.stringify(list)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('修改成功')
                    } else {
                        toast.error('修改失败')
                    }
                    getList()
                    setshow(false)
                }} >

                    <Form.Input field='name' label='名称' />
                    <Form.Select field="type" label='适用类型' style={{ width: '100%' }} zIndex={999999}>
                        <Option value="包装物业务办理">包装物业务办理</Option>
                        <Option value="商品捆绑销售业务办理">商品捆绑销售业务办理</Option>
                        <Option value="专项款办理">专项款办理</Option>
                        <Option value="业务赠送(员工持有)">业务赠送(员工持有)</Option>
                    </Form.Select>
                    <Form.Input field='remarks' label='备注' />
                    <Form.Select field="attributiondepartmentid" label='归属部门' filter style={{ width: '100%' }} zIndex={999999}>
                        {
                            initData.DepartmentList.map(item => <Option value={item.id}>{item.label}</Option>)
                        }
                    </Form.Select>
                    <Box display="flex" justifyContent="space-between">
                        <Form.Input type="date" field='starttime' label='开始时间' />
                        <Form.Input type="date" field='endtime' label='结束时间' />
                        <Form.Input field='sort' label='排序' />
                        <Form.Select field="state" label='状态' zIndex={999999}>
                            <Option value="正常">正常</Option>
                            <Option value="取消">取消</Option>
                        </Form.Select>
                    </Box>

                    <Box border={1} p={3} borderRadius={1} borderColor="#ccc" mb={3}>
                        <ArrayField field='detailed.goods' initValue={goods}>
                            {({ add, arrayFields, addWithInitValue }) => (
                                <Box >
                                    <Btn onClick={add} theme='light'> 新增商品</Btn>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <Box key={key} style={{ display: 'flex', flexWrap: "wrap" }}>

                                                {/* <Form.Select
                                                    field={`${field}[goodsid]`}
                                                    label="商品"
                                                    style={{ width: 150 }}
                                                    zIndex={999999}
                                                >
                                                    {
                                                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option
                                                            value={item.id}>{item.name}</Form.Select.Option>)
                                                    }
                                                </Form.Select> */}

                                                <Form.TreeSelect
                                                    field={`${field}[goodsid]`}
                                                    leafOnly
                                                    label="商品"
                                                    zIndex={999999}
                                                    style={{ width: 200 }}

                                                    maxTagCount={1}
                                                    treeData={new_goodslist}
                                                />



                                                <Form.Select
                                                    field={`${field}[salestype]`}
                                                    label="优惠方式"
                                                    initValue="市场价格优惠"
                                                    zIndex={999999}
                                                    style={{ width: 150 }}
                                                >
                                                    <Form.Select.Option value="市场价格优惠">市场价格优惠</Form.Select.Option>
                                                    <Form.Select.Option value="固定价格优惠">固定价格优惠</Form.Select.Option>
                                                </Form.Select>
                                                <Form.Input field={`${field}[price]`} label="金额" style={{ width: 150 }} />
                                                <Form.Input field={`${field}[num]`} label="数量" type="number" style={{ width: 150 }} />
                                                <Form.Select
                                                    field={`${field}[paymentstatus]`}
                                                    label="是否支付"
                                                    zIndex={999999}
                                                    initValue="未支付"
                                                    style={{ width: 150 }}
                                                >
                                                    <Form.Select.Option value="已支付">已支付</Form.Select.Option>
                                                    <Form.Select.Option value="未支付">未支付</Form.Select.Option>
                                                </Form.Select>
                                                <Form.Select
                                                    field={`${field}[returnable]`}
                                                    label="属性"
                                                    zIndex={999999}
                                                    initValue="1"
                                                    style={{ width: 150 }}
                                                >
                                                    <Form.Select.Option value="0">不可退</Form.Select.Option>
                                                    <Form.Select.Option value="1">可退</Form.Select.Option>
                                                </Form.Select>

                                                <Form.Input field={`${field}[takeeffectdays]`} label="生效天数"
                                                    style={{ width: 150 }} />
                                                <Form.Input field={`${field}[days]`} label="有效天数" style={{ width: 150 }} />
                                                <Form.Input field={`${field}[remarks]`} label="备注"
                                                    style={{ width: 150 }} />
                                                <Btn type='danger' theme='borderless' onClick={remove}
                                                    style={{ margin: 12 }}>删除</Btn>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            )}
                        </ArrayField>
                    </Box>

                    <Box border={1} p={3} borderRadius={1} borderColor="#ccc" mb={3}>
                        <ArrayField field='detailed.coupon' initValue={coupon}>
                            {({ add, arrayFields, addWithInitValue }) => (
                                <Box >
                                    <Btn onClick={add} theme='light'> 新增优惠券</Btn>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <Box key={key} style={{ display: 'flex', flexWrap: "wrap" }}>

                                                <Form.Input field={`${field}[name]`} label="优惠券" style={{ width: 150 }} />
                                                <Form.Input field={`${field}[price]`} label="优惠券金额" style={{ width: 150 }} />

                                                {/* <Form.Select
                                                    field={`${field}[goodsids]`}
                                                    label="商品"
                                                    zIndex={999999}
                                                    style={{ width: 150 }}
                                                    multiple
                                                    maxTagCount={1}
                                                >
                                                    {
                                                        initData.GoodsList.filter(item => item.canuse === true).map(item => <Form.Select.Option
                                                            value={item.id}>{item.name}</Form.Select.Option>)
                                                    }
                                                </Form.Select> */}


                                                <Form.TreeSelect
                                                    field={`${field}[goodsids]`}
                                                    leafOnly
                                                    label="商品"
                                                    zIndex={999999}
                                                    style={{ width: 200 }}
                                                    multiple

                                                    maxTagCount={1}
                                                    treeData={new_goodslist}
                                                />


                                                <Form.Input type="number" field={`${field}[num]`} label="数量" style={{ width: 150 }} />

                                                <Form.Input type="number" field={`${field}[takeeffectdays]`} label="生效天数"
                                                    style={{ width: 150 }} />
                                                <Form.Input type="number" field={`${field}[days]`} label="有效天数" style={{ width: 150 }} />
                                                <Form.Input field={`${field}[minconsumption]`} label="最低消费额" style={{ width: 150 }} />
                                                <Form.Input field={`${field}[remarks]`} label="备注"
                                                    style={{ width: 150 }} />
                                                <Btn type='danger' theme='borderless' onClick={remove}
                                                    style={{ margin: 12 }}>删除</Btn>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            )}
                        </ArrayField>


                    </Box>

                    <Form.Input field='detailed.integral' label="积分"
                        style={{ width: '100%' }} />


                    <Button type="submit">确认添加</Button>
                </Form>
            </Modal>
        </Box>
    );
};


export default GiveProgrammeList;
