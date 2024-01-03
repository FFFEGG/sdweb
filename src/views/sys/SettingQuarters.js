import React, { useEffect, forwardRef, useRef, useState } from 'react';
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
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { Form, Modal } from "@douyinfe/semi-ui";
import users from "../../menu-items/users";
import RepeatIcon from "@mui/icons-material/Repeat";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddIcon from "@mui/icons-material/Add";
import ReorderIcon from "@mui/icons-material/Reorder";


const SettingQuarters = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const [webapis, setWeb] = React.useState([]);
    const [appapis, setApp] = React.useState([]);

    const [PermissionProgrammeList, setPermissionProgrammeList] = useState([])



    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'QuartersList'
        })
        console.log(response);
        setList(response.data.info);
    }

    useEffect(async () => {

        const response = await request('post', '/api/sysGetList', {
            url: 'PermissionProgrammeList'
        })

        setPermissionProgrammeList(response.data.info);
    }, [])


    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
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




    const api = useRef()

    const Edit = (data) => {
        setTimeout(() => {
            // console.log('dsadsad--------', JSON.parse(data.data.webmenu1))
            api.current.setValues({ ...data.data })
            api.current.setValue('id', data.data.id)
            api.current.setValue('menus', JSON.parse(data.data.webmenu2))
            api.current.setValue('action', 'UPDATE')
        }, 200)
        handleClickOpen()
    }

    const menu_list = {
        label: users.title,
        value: users.id,
        key: users.id,
        children: users.children.map((item) => {

            return {
                label: item.title,
                value: item?.id,
                key: item.id,
                children: item.children ? (item.children.map((items) => {

                    return {
                        label: items.title,
                        value: items.id,
                        key: items.id,
                        children: items?.children?.map((itemss) => {
                            return {
                                label: itemss.title,
                                value: itemss.id,
                                key: itemss.id,
                            }
                        })
                    }
                })) : []
            }
        })
    }


    const filterData = (data, ids) => {
        console.log(data, ids);
        let result = {};

        function traverse(obj, parentId) {
            if (Array.isArray(obj)) {
                let children = [];

                obj.forEach((item) => {
                    let res = traverse(item, parentId);
                    if (res) {
                        children.push(res);
                    }
                });

                return children.length > 0 ? children : null;
            } else {
                let newObj = { ...obj };

                if (ids.includes(newObj.id)) {
                    newObj.parentId = parentId;
                    return newObj;
                }

                if (newObj.children) {
                    let children = traverse(newObj.children, newObj.id);
                    if (children) {
                        newObj.children = children;
                        return newObj;
                    }
                }

                return null;
            }
        }

        result = { ...data, children: traverse(data.children, null) };
        return result;
    }


    return (
        <form>
            <NavCard title="岗位" subtitle="系统参数设置" />


            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box mb={3}>
                    <Button onClick={() => setOpen(true)} variant={"contained"}>新增</Button>
                    <Button onClick={() => getlist()} variant={"contained"} sx={{ ml: 2 }}>刷新</Button>
                </Box>

                <Box height="80vh">
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


            <Modal title="新增岗位" visible={open} onCancel={handleClose}>
                <Form getFormApi={apisa => { api.current = apisa }} initValues={{
                    action: 'ADD',
                    id: 0
                }} onSubmit={async e => {

                    // 循环判断是几级菜单
                    const webmenu1 = filterData(users, e.menus)




                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingQuarters',
                        ...e,
                        permissionprogrammelist: JSON.stringify(e.permissionprogrammelist),
                        webmenu1: JSON.stringify(webmenu1),
                        webmenu2: JSON.stringify(e.menus),
                        menus: JSON.stringify(e.menus),
                    })
                    if (rew.code === 200) {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setOpen(false)
                    getlist()
                }}>
                    <Form.Input field={'name'} label={'岗位名称'} />


                    <Form.Select label={'配送岗位'} field={'distribution'} initValue={'0'} zIndex={99999}>
                        <Form.Select.Option value={'0'}>非配送人员</Form.Select.Option>
                        <Form.Select.Option value={'1'}>骑行配送</Form.Select.Option>
                        <Form.Select.Option value={'2'}>货车配送</Form.Select.Option>

                    </Form.Select>


                    <Form.TreeSelect
                        multiple
                        filterTreeNode
                        field={'menus'}
                        label={'菜单'}
                        // leafOnly
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        size={'large'}
                        placeholder={'请选择菜单'}
                        style={{ width: '100%' }}
                        treeData={menu_list.children}
                    />

                    <Form.Input field={'sort'} label={'排序'} initValue={99} />


                    <Form.Select label={'权限方案'} field={'permissionprogrammelist'} style={{ width: '100%' }} multiple zIndex={99999}>
                        {
                            PermissionProgrammeList.map(e => <Form.Select.Option value={e.id}>{e.name}</Form.Select.Option>)
                        }


                    </Form.Select>



                    <Form.Select label={'状态'} field={'state'} initValue={'正常'} zIndex={99999}>
                        <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>




                    <Button variant={"contained"} type={'submit'}>确认提交</Button>
                </Form>
            </Modal>
        </form>
    );
}

export default SettingQuarters;
