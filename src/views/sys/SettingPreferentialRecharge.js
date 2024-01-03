import React, { useEffect, forwardRef, useState } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Box, Button, Card, DialogTitle } from "@mui/material";
import request from "../../utils/request";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker, Input, Popconfirm, Select, Typography } from '@douyinfe/semi-ui';

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";



const SettingPreferentialRecharge = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))

    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'PreferentialRechargeList'
        })
        console.log(response);
        setList(response.data.info);
    }

    const [formdata, setformdata] = useState({
        action: 'ADD',
        id: 0,
        name: '',
        giveprogrammeid: 0,
        price: '',
        total: '',
        remarks: '',
        depidlist: '',
        customertypeidlist: '',
        starttime: moment(new Date()).format('YYYY-MM-DD'),
        endtime: moment(new Date()).format('YYYY-MM-DD'),
        sort: 99,
        state: '正常',
    })

    const { register, handleSubmit, setValue, control, reset, getValues } = useForm();

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    const submit = async (data) => {

        const rew = await request('post', '/api/getInfo', {
            ...formdata,
            customertypeidlist: JSON.stringify(formdata.customertypeidlist),
            depidlist: JSON.stringify(formdata.depidlist),
            url: 'Srapp.Web_SystemSetting.SettingPreferentialRecharge'
        })
        if (rew.code === 200) {
            toast('操作成功');
            handleClose();
        }
        console.log(rew);
    }



    const Edit = (data) => {
        console.log(data.data)
        data.data.action = 'UPDATE'
        setformdata(data.data)
        handleClickOpen()
    }

    return (
        <form>
            <NavCard title="专项款参数列表" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button onClick={() => {
                    setOpen(true)
                }} variant="contained" sx={{ mr: 1 }}>新增</Button>
                <Button onClick={getlist} variant="contained">刷新</Button>
                <Box height="80vh" mt={1}>
                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '名称', field: 'name' },
                            { headerName: '排序', field: 'sort' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", pinned: 'left', cellRendererFramework: (rowData) => (
                                    <Button onClick={() => Edit(rowData)}>编辑</Button>
                                ),
                            },
                        ]}
                    />
                </Box>

            </Card>
            <Dialog

                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ fontSize: 20 }}>
                    新增/修改
                </DialogTitle>
                <DialogContent>

                    <Select onChange={e => {
                        formdata.giveprogrammeid = e
                        setformdata({
                            ...formdata
                        })
                    }} value={formdata.giveprogrammeid} zIndex={999999999999} style={{ width: '100%', marginBottom: 10 }}
                        size="large"
                        prefix="赠品方案ID">
                        {
                            initData.GiveProgrammeList.filter(item => item.type === '专项款办理').map(item => <Select.Option
                                value={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>

                    <Input style={{ marginBottom: 10 }} onChange={e => setformdata({
                        ...formdata,
                        name: e
                    })} value={formdata.name} size="large" prefix="专项款名称" showClear />
                    <Input style={{ marginBottom: 10 }} onChange={e => setformdata({
                        ...formdata,
                        price: e
                    })} value={formdata.price} size="large" prefix="收款金额(实收金额)" showClear />
                    <Input style={{ marginBottom: 10 }} onChange={e => setformdata({
                        ...formdata,
                        total: e
                    })} value={formdata.total} size="large" prefix="专项款总金额(到账金额)" showClear />
                    <Input style={{ marginBottom: 10 }} onChange={e => setformdata({
                        ...formdata,
                        remarks: e
                    })} value={formdata.remarks} size="large" prefix="备注" showClear />


                    <Select onChange={e => {
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
                    </Select>


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

                    <Input style={{ marginBottom: 10 }} onChange={e => setformdata({
                        ...formdata,
                        sort: e
                    })} value={formdata.sort} size="large" prefix="排序" showClear />

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
                    <Popconfirm zIndex={99999999999} title="提示" content="确认操作？" onConfirm={submit}>
                        <Button>确认添加/修改</Button>
                    </Popconfirm>

                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}

export default SettingPreferentialRecharge;
