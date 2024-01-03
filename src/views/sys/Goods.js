import React, { useEffect, forwardRef, useRef } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Autocomplete, Box, Button, Card, Table, TextField } from "@mui/material";
import request from "../../utils/request";

import { useForm, Controller, set } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { Modal, Form } from '@douyinfe/semi-ui';


const Goods = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const new_department = JSON.parse(localStorage.getItem('new_department'))

    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'GoodsList'
        })
        console.log(response);
        setList(response.data.info);
    }
    useEffect(async () => {
        getlist();
    }, [])
    const { register, handleSubmit, setValue, control, reset, getValues } = useForm({
        defaultValues: {
            packingtypeid: [],
            depidlist: [],
            customertypeidlist: [],
            formdata: {
                action: 'ADD',
                id: 0,
                companyid: 101,
                salesmethods: [

                ],
                attribute: "实体商品",
                catid: '',
                typeid: '',
                brandid: '',
                name: "",
                unit: "瓶",
                capacityunit: "L",
                suttle: "",
                reportsuttle: '',
                packingtypeid: [

                ],
                price: '',
                floorprice: '',
                servicefee: '',
                physicalcouponprice: '',
                payment: [

                ],
                sort: 99,
                stocktype: "",
                securityinspectionid: 0,
                sellbykilogram: '',
                purpose: [],
                url: '',
                depidlist: [

                ],
                customertypeidlist: [

                ],
                supplierid: 0,
                invoicejson: '',
                details: '',
                goodsdetails: [],
                integral: 0,
                consumeintegral: 0,
                state: '正常',
                cat: '',
                type: '',
                brand: '',
                packingtype: [],
                imglist: []
            }
        }
    });

    const [open, setOpen] = React.useState(false);
    // const [fullWidth, setFullWidth] = React.useState(true);
    // const [maxWidth, setMaxWidth] = React.useState('sm');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset({
            packingtypeid: [],
            depidlist: [],
            customertypeidlist: [],
            formdata: {
                action: 'ADD',
                id: 3,
                companyid: 101,
                salesmethods: [

                ],
                attribute: "实体商品",
                catid: '',
                typeid: '',
                brandid: '',
                name: "",
                unit: "瓶",
                capacityunit: "L",
                suttle: "",
                reportsuttle: '',
                packingtypeid: [

                ],
                recoverypackingtypeid: [

                ],
                price: '',
                floorprice: '',
                servicefee: '',
                physicalcouponprice: '',
                payment: [

                ],
                sort: 99,
                stocktype: "",
                securityinspectionid: 0,
                sellbykilogram: '',
                purpose: [],
                url: '',
                depidlist: [

                ],
                customertypeidlist: [

                ],
                supplierid: 0,
                invoicejson: '',
                details: '',
                goodsdetails: [],
                integral: 0,
                consumeintegral: 0,
                state: '正常',
                cat: '',
                type: '',
                brand: '',
                packingtype: [],
                imglist: []
            }
        });
    };

    const getarrbyname = (arr, ids) => {
        const arrs = []
        arr.map(item => {
            if (ids.indexOf(item.name) > -1) {
                arrs.push(item.id)
            }
            return ''
        })
        return arrs
    }


    const submit = async (data) => {

        const rew = await request('post', '/api/getInfo', {
            ...data.formdata,
            customertypeidlist: JSON.stringify(getarrbyname(initData.CustomertypeList, data.customertypeidlist)),
            depidlist: JSON.stringify(getarrbyname(initData.DepartmentList, data.depidlist)),
            packingtypeid: JSON.stringify(getarrbyname(initData.PackingtypeList, data.packingtypeid)),
            payment: JSON.stringify(data.formdata.payment),
            salesmethods: JSON.stringify(data.formdata.salesmethods),
            recoverypackingtype: JSON.stringify(data.formdata.recoverypackingtype),
            recoverypackingtypeid: JSON.stringify(getarrbyname(initData.PackingtypeList, data.recoverypackingtypeid)),
            purpose: JSON.stringify(data.formdata.purpose),
            goodsdetails: JSON.stringify(data.formdata.goodsdetails),
            imglist: '',
            packingtype: JSON.stringify(data.formdata.packingtype),
            url: 'Srapp.Web_SystemSetting.SettingGoods'
        })
        if (rew.code === 200) {
            toast('操作成功');
            handleClose();
        }
        console.log(rew);
    }

    const getarr = (arr) => {
        const arrs = [];
        for (let i = 0; i < arr.length; i += 1) {
            arrs.push(arr[i].name)
        }
        return arrs
    }

    const getarrbyid = (arr, ids) => {
        const arrs = []
        arr.map(item => {
            if (ids.indexOf(item.id) > -1) {
                arrs.push(item.name)
            }
            return ''
        })
        return arrs
    }


    const api = useRef(null);
    const Edit = (data) => {
        console.log(data.data)
        // setValue('formdata', data.data)
        // setValue('formdata.action', 'UPDATE')
        // setValue('depidlist', getarrbyid(initData.DepartmentList, data.data.depidlist))
        // setValue('packingtypeid', getarrbyid(initData.PackingtypeList, data.data.packingtypeid))
        // setValue('recoverypackingtypeid', getarrbyid(initData.PackingtypeList, data.data.recoverypackingtypeid))

        // setValue('customertypeidlist', getarrbyid(initData.CustomertypeList, data.data.customertypeidlist))
        setOpen(true)
        setTimeout(() => {
            api.current.setValues({
                ...data.data,

            })
            api.current.setValue('id', data.data.id)
            api.current.setValue('action', 'UPDATE')
        }, 500)


    }


    return (
        <>
            <NavCard title="商品列表" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button variant="contained" sx={{ mb: 1 }} onClick={handleClickOpen}>新增</Button>
                <Button variant="contained" sx={{ mb: 1, ml: 1 }} onClick={getlist}>刷新</Button>
                <Box height="80vh">
                    <AgGridReact
                        reactUi="true"
                        rowData={list}
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: "序号", field: "id", },

                            { headerName: "商品名称", field: "name", },

                            { headerName: "单价", field: "price", },
                            { headerName: "包装单位", field: "unit", },
                            { headerName: "最低价", field: "floorprice", },
                            { headerName: "销售方式", field: "salesmethods", },
                            { headerName: "状态", field: "state", },
                            {
                                headerName: "操作", cellRendererFramework: (rowData) => (
                                    <Button size='small' style={{ padding: 1 }} onClick={() => Edit(rowData)}>编辑</Button>
                                ),
                            },
                        ]}
                        defaultColDef={{
                            flex: 1,
                            resizable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                    />
                </Box>

            </Card>

            <Modal maskClosable={false} title="商品添加/修改" visible={open} onOk={() => {
                api.current.submitForm()
            }} onCancel={() => setOpen(false)}>
                <Form getFormApi={e => api.current = e} onSubmit={async e => {


                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingGoods',
                        ...e,
                        customertypeidlist: JSON.stringify(e.customertypeidlist),
                        depidlist: JSON.stringify(e.depidlist),
                        goodsdetails: JSON.stringify(e.goodsdetails),
                        packingtypeid: JSON.stringify(e.packingtypeid),
                        payment: JSON.stringify(e.payment),
                        purpose: JSON.stringify(e.purpose),
                        recoverypackingtypeid: JSON.stringify(e.recoverypackingtypeid),
                        salesmethods: JSON.stringify(e.salesmethods),
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast('操作成功');
                        api.current.reset();
                        setOpen(false);
                        getlist()
                    } else {
                        toast(rew.data.tips);
                    }


                }} initValues={{
                    action: 'ADD',
                    id: 0
                }}>
                    <Form.Select multiple filter style={{ width: '100%' }} label="销售方式" field='salesmethods' >
                        <Form.Select.Option value="周转销售(扫描)">周转销售(扫描)</Form.Select.Option>
                        <Form.Select.Option value="周转销售(不扫描)">周转销售(不扫描)</Form.Select.Option>
                        <Form.Select.Option value="代充销售">代充销售</Form.Select.Option>
                        <Form.Select.Option value="快消品销售">快消品销售</Form.Select.Option>
                    </Form.Select>
                    <Form.Select label="商品强制属性" field='attribute' style={{ width: '100%' }} >
                        <Form.Select.Option value="组合商品">组合商品</Form.Select.Option>
                        <Form.Select.Option value="实体商品">实体商品</Form.Select.Option>
                        <Form.Select.Option value="虚拟商品">虚拟商品</Form.Select.Option>
                    </Form.Select>

                    <Form.Select label="类型" field='catid' style={{ width: '100%' }} >
                        {initData.GoodsCatList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Select label="商品类型" field='typeid' style={{ width: '100%' }} >
                        {initData.GoodsTypeList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Select label="品牌" field='brandid' style={{ width: '100%' }} >
                        {initData.GoodsBrandList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>

                    <Form.Input label="商品名称" field='name' />
                    <Form.Input label="包装单位(桶装水请标明大桶，小桶，一次性桶)" field='unit' />
                    <Form.Input label="容量单位" field='capacityunit' />
                    <Form.Input label="实际净重(一次性桶按容量填写)" field='suttle' />
                    <Form.Input label="报表净重" field='reportsuttle' />
                    <Form.Select multiple filter style={{ width: '100%' }} label="包装物" field='packingtypeid' >
                        {initData.PackingtypeList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Select multiple filter style={{ width: '100%' }} label="回收包装物" field='recoverypackingtypeid' >
                        {initData.PackingtypeList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Input label="商品单价（含基础服务费）" field='price' />
                    <Form.Input label="最低销售单价(优惠后自提商品单价不得小于该单价)" field='floorprice' />
                    <Form.Input label="基础服务费单价" field='servicefee' />
                    <Form.Input label="实物券抵扣单价(第三方实物票)" field='physicalcouponprice' />
                    <Form.Input label="库存类型" field='stocktype' />
                    <Form.Select multiple filter style={{ width: '100%' }} label="支付方式" field='payment' >
                        <Form.Select.Option value="线上支付">线上支付</Form.Select.Option>
                        <Form.Select.Option value="现金支付">现金支付</Form.Select.Option>
                        <Form.Select.Option value="月结支付">月结支付</Form.Select.Option>
                        <Form.Select.Option value="余额支付">余额支付</Form.Select.Option>
                    </Form.Select>
                    {/* 
                    <Button onClick={() => {
                        const depidlist = api.current.getValue('depidlist') || [];
                        //友爱分公司id
                        const yaids = initData.DepartmentList.filter(item => item.fid == 29).map(item => item.id);
                        let arr = new Set([...depidlist, ...yaids]);
                        const result = Array.from(arr);
                        api.current.setValue('depidlist', result);
                    }}>友爱分公司</Button>
                    <Button onClick={() => {
                        const depidlist = api.current.getValue('depidlist') || [];
                        //青秀分公司id
                        const yaids = initData.DepartmentList.filter(item => item.fid == 28).map(item => item.id);
                        let arr = new Set([...depidlist, ...yaids]);
                        const result = Array.from(arr);
                        api.current.setValue('depidlist', result);
                    }}>青秀分公司</Button> */}

                    {/* <Form.Select multiple filter style={{ width: '100%' }} label="可销售部门" field='depidlist' >
                        {initData.DepartmentList.map(item => (
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>
                        ))}
                    </Form.Select> */}
                    <Form.TreeSelect filterTreeNode leafOnly treeData={new_department} multiple field='depidlist' filter style={{ width: '100%' }} label="可销售部门" />
                    <Form.Select multiple filter style={{ width: '100%' }} label="可销用户类型" field='customertypeidlist' >
                        {initData.CustomertypeList.map(item => (
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Select label="安检项目" field='securityinspectionid' style={{ width: '100%' }} >
                        <Form.Select.Option value={"0"}>不安检</Form.Select.Option>
                        {
                            initData.SecurityInspectionItemsList.map(item => (
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            ))
                        }
                    </Form.Select>
                    <Form.Select label="折公斤售卖" field='sellbykilogram' style={{ width: '100%' }} >
                        <Form.Select.Option value="是">是</Form.Select.Option>
                        <Form.Select.Option value="否">否</Form.Select.Option>
                    </Form.Select>
                    <Form.Select multiple filter style={{ width: '100%' }} label="用途" field='purpose' >
                        <Form.Select.Option value="正常销售">正常销售</Form.Select.Option>
                        <Form.Select.Option value="积分兑换">积分兑换</Form.Select.Option>
                    </Form.Select>
                    <Form.Input label="排序" field='sort' />

                    <Form.Input label="供应商" field='supplierid' />
                    <Form.Input label="发票信息" field='invoicejson' />
                    <Form.Input label="商品详情" field='details' />
                    <Form.Input label="结算积分" field='integral' />
                    <Form.Input label="消费积分" field='consumeintegral' />
                    <Form.Input label="组合json" field='goodsdetails' />
                    <Form.Select label="状态" field='state' style={{ width: '100%' }} >
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>
                </Form>
            </Modal>

        </>
    );
}

export default Goods;
