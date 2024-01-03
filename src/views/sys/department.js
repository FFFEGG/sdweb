import React, { useEffect, forwardRef, useState } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Box, Button, Card, Table, TextField, Typography } from "@mui/material";
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
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import QRCode from 'qrcode.react';
import { Tooltip, Toast, Form, Modal } from "@douyinfe/semi-ui";
import copy from "copy-to-clipboard";

import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js'
import translations from '../../utils/translations'



const Department = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const getTreeList = (arr: any[], pid = "0", temps = [], name) => {
        const temp = temps;
        arr.forEach((item: any) => {
            if (item.fid === pid) {
                temp.push({
                    ...item,
                    id: item.id,
                    names: name ? name.concat(item.name) : [item.name],
                    fid: item.fid,
                })
                getTreeList(arr, item.id, temp, (name ? name.concat(item.name) : [item.name]))
            }
        });
        // console.log(temp);
        return temp;
    }

    const getlist = async () => {
        const response = await request('post', '/api/sysGetList', {
            url: 'DepartmentList'
        })
        setList(getTreeList(response.data.info))
    }
    useEffect(async () => {
        getlist();
    }, [])
    const { register, handleSubmit, setValue, control, reset } = useForm({
        defaultValues: {
            action: 'ADD',
            id: 0,
            fid: 0,
            name: '',
            telephone: '',
            address: '',
            longitude: '',
            latitude: '',
            area: '',
            type: '业务门店',
            distributionmode: '',
            autotype: '',
            manage_users: '',
            sort: 99,
            state: '正常',
        }
    });

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset({
            action: 'ADD',
            id: 0,
            fid: 0,
            name: '',
            telephone: '',
            address: '',
            longitude: '',
            latitude: '',
            area: '',
            type: '业务门店',
            distributionmode: '',
            autotype: '',
            manage_users: '',
            sort: 99,
            state: '正常',
        });
    };


    const submit = async (data) => {
        console.log(data);
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_SystemSetting.SettingDepartment'
        })
        if (rew.code === 200) {
            toast('操作成功');
            handleClose();
        }
        console.log(rew);
    }
    const [screat, setscreat] = useState('')
    const [miyao, setmiyao] = useState('')

    const [initvalue, setinitvalue] = useState({
        id: 0,
        action: 'ADD',
        paymentaccountlist: JSON.stringify([{ "payment": "微信支付", "account": "A1" }]),
        state: '正常',
        sort: 99,
        fid: '0'
    })

    return (
        <form>
            <Box mb={3}>
                <Box display="flex" alignItems="center" mb={3}>
                    <TextField size="small" value={screat} onChange={e => setscreat(e.target.value)} label="解密" sx={{ width: 500 }} />
                    <Button sx={{ ml: 3 }} onClick={() => {
                        const bytes = CryptoJS.AES.decrypt(screat, 'JmYcAEiTql5EEyPW');
                        const originalText = bytes.toString(CryptoJS.enc.Utf8);
                        setmiyao(originalText)
                        console.log(JSON.parse(originalText)); // 'my message'
                    }} variant="contained">解密</Button>


                </Box>
                <Typography bgcolor="#fff" padding={3}>{miyao}</Typography>
            </Box>


            <NavCard title="部门管理" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button variant="contained" sx={{ mb: 1 }} onClick={handleClickOpen}>新增</Button>
                <Button variant="contained" sx={{ ml: 1, mb: 1 }} onClick={getlist}>刷新</Button>
                <Box height="80vh">
                    <AgGridReact
                        defaultColDef={{
                            // flex: 1,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                            resizable: true,
                        }}
                        localeText={translations}
                        reactUi="true"
                        rowData={list}
                        className="ag-theme-balham"
                        treeData="true"
                        getDataPath={data => data.names}
                        columnDefs={[
                            { headerName: "id", field: "id" },

                            { headerName: "地区", field: "area" },
                            { headerName: "配送模式", field: "distributionmode", },
                            { headerName: "电话", field: "telephone", },
                            { headerName: "部门类型", field: "type", },
                            { headerName: "状态", field: "state", },
                            {
                                headerName: "二维码", valueGetter: ({ data }) =>
                                    <Tooltip
                                        position="left"
                                        trigger="click"
                                        onVisibleChange={(e) => {
                                            if (e) {
                                                copy(CryptoJS.AES.encrypt(JSON.stringify({
                                                    departmentid: data.id,
                                                    department: data.name,
                                                    key2: data.datakey,
                                                    key1: data.signkey
                                                }), 'JmYcAEiTql5EEyPW').toString())
                                                Toast.success({
                                                    content: '复制二维码信息成功',
                                                    duration: 3,
                                                })
                                            }

                                        }}
                                        content={
                                            <QRCode

                                                id="qrCode"
                                                value={CryptoJS.AES.encrypt(JSON.stringify({
                                                    departmentid: data.id,
                                                    department: data.name,
                                                    key2: data.datakey,
                                                    key1: data.signkey
                                                }), 'JmYcAEiTql5EEyPW').toString()}
                                                size={136} // 二维码的大小
                                                fgColor="#000000" // 二维码的颜色
                                                style={{ borderRadius: '10px' }}
                                            />}>
                                        <Button size="small" variant="outlined">点击复制</Button>
                                    </Tooltip>

                            },
                            {
                                headerName: "操作", cellRendererFramework: (rowData) =>
                                    <input type="date" onChange={async e => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_SystemSetting.SettingBusinessCancellationTime',
                                            department: rowData.data.name,
                                            date: e.target.value
                                        })
                                        console.log(rew);
                                    }} placeholder="设置部门撤销时间" />
                            },
                            {
                                headerName: "操作", pinned:'right', cellRendererFramework: (rowData) => (
                                    <Button onClick={() => {

                                        setValue('action', 'UPDATE')
                                        setValue('id', rowData.data.id)
                                        setValue('fid', rowData.data.fid)
                                        setValue('name', rowData.data.name)
                                        setValue('telephone', rowData.data.telephone)
                                        setValue('address', rowData.data.address)
                                        setValue('longitude', rowData.data.longitude)
                                        setValue('latitude', rowData.data.latitude)
                                        setValue('area', rowData.data.area)
                                        setValue('type', rowData.data.type)
                                        setValue('distributionmode', rowData.data.distributionmode)
                                        setValue('autotype', rowData.data.autotype)
                                        setValue('manage_users', rowData.data.manage_users)
                                        setValue('sort', rowData.data.sort)
                                        setValue('state', rowData.data.state)
                                        setValue('distance', rowData.data.distance)
                                        setValue('basicrate', rowData.data.basicrate)
                                        setinitvalue({
                                            ...rowData.data,
                                            action: 'UPDATE',
                                            actual_manager_opeids: JSON.stringify(rowData.data.actual_manager_opeids),
                                            manager_opeids: JSON.stringify(rowData.data.manager_opeids),
                                            paymentaccountlist: JSON.stringify(rowData.data.paymentaccountlist),
                                            names: JSON.stringify(rowData.data.names),
                                        })
                                        setTimeout(() => {
                                            handleClickOpen()
                                        }, 500)

                                    }}>编辑</Button>
                                ),
                            },
                        ]}
                    />
                </Box>

            </Card>
            <Modal maskClosable={false} visible={open} onCancel={handleClose} style={{ top: '20%' }} footer={null}>
                <Box fontSize={18}>部门添加/修改</Box>
                <Form initValues={initvalue} onChange={e => console.log(e)} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        ...e,
                        also_opeids: JSON.stringify(e.also_opeids),
                        url: 'Srapp.Web_SystemSetting.SettingDepartment',
                        worktime: '08:00'
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast('操作成功');
                        handleClose();
                    } else {
                        toast(`操作失败 ${rew.data.tips}`);
                    }

                }}>
                    <Form.Select label={'父级部门'} field={'fid'} filter style={{ width: '100%' }}>
                        <Form.Select.Option
                            value="0">顶级部门</Form.Select.Option>
                        {
                            // 循环部门列表
                            initData.DepartmentList.map((item, index) =>

                                <Form.Select.Option
                                    value={item.id}>{item.label}</Form.Select.Option>

                            )

                        }
                    </Form.Select>

                    <Form.Input field={'name'} label={'部门名称'} />


                    <Form.Select label={'可选范围'} field={'type'} style={{ width: '100%' }} >
                        <Form.Select.Option value="SNS站点">SNS站点</Form.Select.Option>
                        <Form.Select.Option value="业务门店">业务门店</Form.Select.Option>
                        <Form.Select.Option value="钢瓶管理">钢瓶管理</Form.Select.Option>
                        <Form.Select.Option value="管理部门">管理部门</Form.Select.Option>
                        <Form.Select.Option value="加盟门店">加盟门店</Form.Select.Option>
                    </Form.Select>


                    <Form.Select filter label={'兼管本部门opeid'} field={'also_opeids'} multiple style={{ width: '100%' }} >

                        {
                            initData.OperatorList.map(item =>
                                <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                            )
                        }

                    </Form.Select>

                    <Form.Input field={'telephone'} label={'电话号码'} />
                    <Form.Input field={'address'} label={'部门地址'} />
                    <Form.Input field={'longitude'} label={'longitude'} />
                    <Form.Input field={'latitude'} label={'latitude'} />
                    <Form.Input field={'area'} label={'片区'} />




                    <Form.Select label={'默认配送模式'} field={'distributionmode'} style={{ width: '100%' }}  >
                        <Form.Select.Option value="配送员接单">配送员接单</Form.Select.Option>
                        <Form.Select.Option value="配送员抢单">配送员抢单</Form.Select.Option>
                        <Form.Select.Option value="营业员派单">营业员派单</Form.Select.Option>
                    </Form.Select>



                    <Form.Select label={'自动派单方式'} field={'autotype'} style={{ width: '100%' }}  >
                        <Form.Select.Option value="0">按设定规则</Form.Select.Option>
                        <Form.Select.Option value="1">在规则基础上最短导航距离分配</Form.Select.Option>
                    </Form.Select>

                    <Form.Select label={'管理用户部门'} field={'manage_users'} style={{ width: '100%' }}  >
                        <Form.Select.Option value="0">非管理</Form.Select.Option>
                        <Form.Select.Option value="1">管理</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field={'paymentaccountlist'} label={'支付账户 JSON'} />
                    <Form.Input field={'distance'} label={'公里数'} />
                    <Form.Input field={'basicrate'} label={'基本运价'} />
                    <Form.Input field={'sort'} label={'排序'} />

                    <Form.Select label={'状态'} field={'state'} style={{ width: '100%' }}  >
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>

                    <Button variant={'contained'} type="submit">确定</Button>
                </Form>
            </Modal>


        </form>
    );
}

export default Department;
