import React, { useEffect, forwardRef, useRef } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Autocomplete, Box, Button, Card, Table, TextField, Typography } from "@mui/material";
import request from "../../utils/request";

import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { Form, Modal } from "@douyinfe/semi-ui";


const PermissionProgrammeList = () => {
    const [list, setList] = React.useState([]);
    const [webapis, setWeb] = React.useState([]);
    const [appapis, setApp] = React.useState([]);
    const [SnsOfficePlatforms, setSnsOfficePlatform] = React.useState([]);
    const [show, setshow] = React.useState(false);
    const api = useRef()
    const initData = JSON.parse(localStorage.getItem('initData'))

    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'PermissionProgrammeList'
        })

        setList(response.data.info);
    }




    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetApiList',
            key: 'Web'
        })

        const rew2 = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetApiList',
            key: 'App'
        })
        const rew3 = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetApiList',
            key: 'SnsOfficePlatform'
        })
        setWeb(rew.data.info)
        setApp(rew2.data.info)
        setSnsOfficePlatform(rew3.data.info)

    }, [])



    const Edit = (data) => {
        setshow(true)
        setTimeout(() => {
            api.current.setValues(data.data)
            api.current.setValue('action', 'UPDATE')
            api.current.setValue('id', data.data.id)
        }, 1000)
    }

    return (
        <form>
            <NavCard title="权限方案" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button sx={{ mb: 2 }} variant="contained" onClick={getlist}>刷新</Button>
                <Button sx={{ mb: 2, ml: 2 }} variant="contained" onClick={() => {
                    setshow(true)
                    setTimeout(() => {

                        api.current.setValue('action', 'ADD')
                        api.current.setValue('id', 0)
                    }, 1000)
                }}>新增</Button>
                <Box height="80vh">
                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: 'companyid', field: 'companyid' },
                            { headerName: '名称', field: 'name' },
                            { headerName: '客户端', field: 'client' },
                            { headerName: '版本号', field: 'version' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", pinned: 'left', cellRendererFramework: (rowData) => (
                                    <Button onClick={() => Edit(rowData)}>编辑</Button>
                                ),
                            },
                        ]}
                        defaultColDef={{
                            // flex: 1
                        }}
                    />
                </Box>

                <Modal title="权限方案新增修改"
                    visible={show}
                    onCancel={() => setshow(false)}
                    bodyStyle={{ overflow: 'auto' }}
                    style={{ top: '15%', width: '60%' }}
                    onOk={async () => {
                        console.log(api.current.getValues())
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemSetting.SettingPermissionProgramme',
                            ...api.current.getValues(),
                            apilist: JSON.stringify(api.current.getValue('apilist'))
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('操作成功')
                        } else {
                            toast.error('操作失败')
                        }
                        getlist()
                        setshow(false)
                    }}
                >
                    <Form getFormApi={formApi => { api.current = formApi }} onChange={values => console.log(values)}>
                        <Form.Input field='client' label="客户端" />
                        <Form.Input field='name' label="权限方案名称" />
                        <Form.Input field='version' label="权限方案版本号" />
                        <Form.Input field='remarks' label="备注" />
                        <Button onClick={() => {
                            const api1 = webapis.map(e => e.service)
                            const api2 = appapis.map(e => e.service)
                            const api3 = SnsOfficePlatforms.map(e => e.service)
                            api.current.setValue('apilist', [...api1, ...api2, ...api3])
                        }}>全选</Button>
                        <Form.CheckboxGroup direction='horizontal' field='apilist' label="权限列表">
                            {
                                webapis.map(item => <Form.Checkbox defaultChecked style={{ width: 300 }} value={item.service}>[WEB]{item.title}</Form.Checkbox>)
                            }

                            {
                                appapis.map(item => <Form.Checkbox defaultChecked style={{ width: 300 }} value={item.service}><Box sx={{ color: "#3a60d3 !important" }}>[APP]{item.title}</Box></Form.Checkbox>)
                            }
                            {
                                SnsOfficePlatforms.map(item => <Form.Checkbox defaultChecked style={{ width: 300 }} value={item.service}><Box sx={{ color: "#f00 !important" }}>[SNS]{item.title}</Box></Form.Checkbox>)
                            }
                        </Form.CheckboxGroup>

                        <Form.Select label="状态" field='state'>
                            <Form.Select.Option value="正常">正常</Form.Select.Option>
                            <Form.Select.Option value="取消">取消</Form.Select.Option>
                        </Form.Select>
                    </Form>
                </Modal>

            </Card>

        </form>
    );
}

export default PermissionProgrammeList;
