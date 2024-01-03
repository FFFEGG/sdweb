import React, { useEffect, forwardRef, useState } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Autocomplete, Box, Button, Card, Table, TextField } from "@mui/material";
import request from "../../utils/request";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Switch from '@mui/material/Switch';
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { DatePicker, Input, Select, TreeSelect } from "@douyinfe/semi-ui";
import RemoveIcon from '@mui/icons-material/Remove';

const Goods = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const new_department = JSON.parse(localStorage.getItem('new_department'))
    const [formdata, setformdata] = useState('')
    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'GoodsSalesMashupList'
        })
        console.log(response);
        response.data.info.map(item => {
            item.goodsdetails = item.detailed
            return item
        })
        setList(response.data.info);
    }
    useEffect(async () => {
        getlist();
    }, [])
    const { register, handleSubmit, setValue, control, reset, getValues } = useForm();

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        const data = {
            action: 'ADD',
            id: 0,
            goodsdetails: []
        }
        setformdata(data)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        formdata.goodsdetails.map(item => {
            item.goodsid = Number(item.goodsid)
        })
        const rew = await request('post', '/api/getInfo', {
            ...formdata,
            url: 'Srapp.Web_SystemSetting.SettingGoodsSalesMashup',
            goodsdetails: JSON.stringify(formdata.goodsdetails),
            depidlist: JSON.stringify(formdata.depidlist),
            detailed: JSON.stringify(formdata.detailed),
            customertypeidlist: JSON.stringify(formdata.customertypeidlist),
        })
        if (rew.data.msg === 'SUCCESS') {
            toast('操作成功');
            handleClose();
        } else {
            toast('操作失败' + rew.data.tips);
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


    const Edit = (data) => {
        console.log(data.data)
        data.data.action = 'UPDATE'
        setformdata(data.data)
        setOpen(true)
    }
    const goodslist = []

    const exportdata = async () => {

        // goodslist根据id分组
        let goodslist_arr = goodslist.reduce((acc, cur) => {
            if (acc[cur.id]) {
                acc[cur.id].push(cur)
            } else {
                acc[cur.id] = [cur]
            }
            return acc
        }, {})

        console.log('goodslist_arr', goodslist_arr)

        // action	枚举类型	必须		范围：ADD/UPDATE	状态（ADD,UPDATE）
        // id	整型	可选	0		ID
        // name	字符串	必须		最大：75	商品捆绑销售方案名称
        // goodsdetails	字符串	必须			商品明细JSON,（[{"goodsid":1,"price":10,"num":1,"returnable":0}]）returnable=1 可退 =0 不可退
        // price	浮点型	必须			单价
        // salestype	枚举类型	必须		范围：市场价格优惠/固定价格优惠	市场价格优惠,固定价格优惠
        // paymentstatus	枚举类型	必须		范围：已支付/未支付	支付状态
        // sort	整型	必须			排序
        // depidlist	字符串	必须			可销售部门ID JSON([1,2,3])
        // customertypeidlist	字符串	必须			可销用户类型ID JSON([1,2,3])
        // giveprogrammeid	整型	可选	0		赠品方案ID,type=商品捆绑销售业务办理
        // remarks	字符串	可选			备注
        // starttime	日期	必须			方案生效开始日期
        // endtime	日期	必须			方案生效结束日期
        // effectivedays	整型	可选	900		库存商品有效天数
        // state	枚举类型	必须		范围：正常/取消	状态（正常,取消）

        // return false
        for (const i in goodslist_arr) {
            setTimeout(async () => {
                let item = goodslist_arr[i];
                for (const j in item) {
                    item[j].returnable = 1;
                    // 去掉item[j].id
                    delete item[j].id
                }
                console.log('item', item)

                const formdata_arr = {
                    action: "ADD",
                    id: 0,
                    name: item[0].name,
                    goodsdetails: JSON.stringify(item),
                    price: item.reduce((acc, cur) => {
                        return acc + cur.price * cur.num
                    }, 0),
                    salestype: "固定价格优惠",
                    paymentstatus: "已支付",
                    sort: 0,
                    depidlist: JSON.stringify(initData.DepartmentList.filter(item => item.fid == 24).map(item => item.id)),
                    customertypeidlist: JSON.stringify([1, 2]),
                    giveprogrammeid: 0,
                    remarks: "",
                    starttime: "2000-09-01",
                    endtime: "2025-09-30",
                    effectivedays: 900,
                    state: "正常"
                }
                console.log('数据结构', formdata)
                // return
                const rew = await request('post', '/api/getInfo', {
                    ...formdata_arr,
                    url: 'Srapp.Web_SystemSetting.SettingGoodsSalesMashup',
                })
                console.log('添加结果', rew);
                // return false
            }, i * 1000)
        }

    }





    return (
        <form>
            <NavCard title="商品捆绑销售列表" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button variant="contained" sx={{ mb: 1 }} onClick={handleClickOpen}>新增</Button>
                <Button variant="contained" sx={{ mb: 1, ml: 1 }} onClick={getlist}>刷新</Button>
                {/* <Button variant="contained" sx={{ mb: 1, ml: 1 }} onClick={exportdata}>数据导入</Button> */}
                <Box height="80vh">
                    <AgGridReact
                        // reactUi="true"
                        rowData={list}
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: "序号", field: "id", },
                            { headerName: "商品名称", field: "name", },
                            { headerName: "单价", field: "price", },
                            { headerName: "单价", field: "price", },
                            { headerName: "销售方式", field: "salesmethods", },
                            { headerName: "状态", field: "state", },
                            {
                                headerName: "操作", pinned: 'left', width: 100, cellRendererFramework: (rowData) => <Button variant='text' size="small" onClick={() => Edit(rowData)}>编辑</Button>,
                            },
                        ]}
                        defaultColDef={{
                            flex: 1,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                    />
                </Box>

            </Card>
            <Dialog

                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ fontSize: 20 }}>商品添加/修改</DialogTitle>
                <DialogContent>
                    <Input style={{ marginBottom: 10 }} value={formdata.name}
                        onChange={e => {
                            setformdata({
                                ...formdata,
                                name: e
                            })

                        }} size="large" prefix="套餐名称" />
                    <Input onChange={e => {
                        formdata.price = e
                        setformdata({
                            ...formdata
                        })
                    }} style={{ marginBottom: 10 }} value={formdata.price} size="large" prefix="单价" />
                    <Button onClick={() => {
                        formdata.goodsdetails.push({
                            goodsid: 0,
                            price: 0,
                            num: 1,
                            returnable: 1
                        })
                        setformdata({
                            ...formdata
                        })
                    }} variant="contained" style={{ marginBottom: 10 }}>新增商品</Button>
                    {
                        formdata.goodsdetails?.map((item, index) =>
                            <Box display="flex" alignItems="center" justifyItems="center">

                                <Select onChange={e => {
                                    formdata.goodsdetails[index].goodsid = e
                                    setformdata({
                                        ...formdata
                                    })
                                }} value={item.goodsid} filter zIndex={999999999999} style={{ width: '25%', marginBottom: 10 }}
                                    size="large"
                                    prefix="商品">
                                    {
                                        initData.GoodsList.map(items => <Select.Option
                                            value={Number(items.id)}>{items.name}</Select.Option>)
                                    }
                                </Select>
                                <Input onChange={e => {
                                    formdata.goodsdetails[index].price = e
                                    setformdata({
                                        ...formdata
                                    })
                                }} style={{ width: '25%', marginBottom: 10 }} value={item.price} size="large" prefix="价格" />
                                <Input onChange={e => {
                                    formdata.goodsdetails[index].num = e
                                    setformdata({
                                        ...formdata
                                    })
                                }} style={{ marginBottom: 10, width: '25%' }} value={item.num} size="large" prefix="数量" />
                                <Select onChange={e => {
                                    formdata.goodsdetails[index].returnable = e
                                    setformdata({
                                        ...formdata
                                    })
                                }} value={item.returnable} size="large" prefix="属性" zIndex={999999999999} style={{ width: '25%', marginBottom: 10 }}>
                                    <Select.Option value={1}>可退</Select.Option>
                                    <Select.Option value={0}>不可退</Select.Option>
                                </Select>

                                <Button onClick={() => {

                                    formdata.goodsdetails.splice(index, 1)
                                    setformdata({
                                        ...formdata,
                                    })
                                }} style={{ marginBottom: 10 }}><RemoveIcon /></Button>
                            </Box>
                        )
                    }
                    <Select onChange={e => {
                        formdata.salestype = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.salestype} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        prefix="优惠方式">
                        <Select.Option value="市场价格优惠">市场价格优惠</Select.Option>
                        <Select.Option value="固定价格优惠">固定价格优惠</Select.Option>
                    </Select>

                    <Select onChange={e => {
                        formdata.paymentstatus = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.paymentstatus} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        prefix="支付状态">
                        <Select.Option value="已支付">已支付</Select.Option>
                        <Select.Option value="未支付">未支付</Select.Option>
                    </Select>
                    <Select onChange={e => {
                        formdata.giveprogrammeid = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.giveprogrammeid} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        prefix="赠送方案ID">
                        {
                            initData.GiveProgrammeList.filter(e => e.type == '商品捆绑销售业务办理').map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)
                        }

                    </Select>

                    <Input onChange={e => {
                        formdata.sort = e
                        setformdata({
                            ...formdata
                        })
                    }} style={{ marginBottom: 10 }} value={formdata.sort} size="large" prefix="排序" />
                    <Input onChange={e => {
                        formdata.effectivedays = e
                        setformdata({
                            ...formdata
                        })
                    }} style={{ marginBottom: 10 }} value={formdata.effectivedays} size="large" prefix="库存商品有效天数" />


                    {/* <Select onChange={e => {
                        formdata.depidlist = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.depidlist} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        filter
                        prefix="可销售部门" multiple maxTagCount={3}>
                        {
                            initData.DepartmentList.map(item => <Select.Option
                                value={item.id}>{item.label}</Select.Option>)
                        }
                    </Select> */}
                    <TreeSelect style={{ width: '100%', marginBottom: 10 }} prefix="可销售部门" value={formdata.depidlist} onChange={e => {
                        formdata.depidlist = e
                        setformdata({
                            ...formdata
                        })
                    }} filterTreeNode leafOnly treeData={new_department} multiple field='depidlist' filter label="可销售部门" />
                    <Select onChange={e => {
                        formdata.customertypeidlist = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.customertypeidlist} zIndex={999999999999}
                        style={{ width: '100%', marginBottom: 10 }} size="large"
                        prefix="可销用户类型" multiple maxTagCount={3}>
                        {
                            initData.CustomertypeList.map(item => <Select.Option
                                value={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                    <DatePicker zIndex={999999999999} onChange={(_, e) => {
                        formdata.starttime = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.starttime} prefix="开始时间" style={{ width: '100%', marginBottom: 10 }} size="large" />

                    <DatePicker zIndex={999999999999} onChange={(_, e) => {
                        formdata.endtime = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.endtime} prefix="结束时间" style={{ width: '100%', marginBottom: 10 }} size="large" />

                    <Select onChange={e => {
                        formdata.state = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.state} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        prefix="状态">
                        <Select.Option value="正常">正常</Select.Option>
                        <Select.Option value="取消">取消</Select.Option>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submit}>确认添加/修改</Button>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}

export default Goods;
