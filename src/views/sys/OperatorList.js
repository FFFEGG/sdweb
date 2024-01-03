import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from 'react-toastify';

const OperatorList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))



    const [list, setlist] = useState([])
    const [PermissionProgrammeList, setPermissionProgrammeList] = useState([])
    const [open, setopen] = useState(false)
    const getlist = async () => {
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.OperatorList'
        })
        setlist(rew.data.info)
    }

    const [formdata, setdata] = useState({
        action: 'ADD',
        id: 0
    })

    useEffect(async () => {
        const response = await request('post', '/api/sysGetList', {
            url: 'PermissionProgrammeList'
        })

        setPermissionProgrammeList(response.data.info);
    }, [])


    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>

            <Modal visible={open} onCancel={() => setopen(false)} style={{ top: 100 }} footer={<></>}>
                <Form initValues={formdata} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingOperator',
                        ...e,
                        loginside: JSON.stringify(e.loginside),
                        removepermissionslist: JSON.stringify(e.removepermissionslist),
                        addpermissionslist: JSON.stringify(e.addpermissionslist),
                        quarters_webmenu1: JSON.stringify(e.quarters_webmenu1),
                        quarters_webmenu2: JSON.stringify(e.quarters_webmenu2),
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    }

                    setopen(false)
                    getlist()
                    // console.log(rew);
                }}>
                    <Form.Input field={'opeid'} label={'工号'} />
                    <Form.Input field={'name'} label={'操作员姓名'} />
                    <Form.Input field={'telephone'} label={'电话'} />
                    <Form.Select field={'departmentid'} label={'部门'} filter zIndex={9999999999} style={{ width: '100%' }}>
                        {
                            initData.DepartmentList?.map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Form.Select field={'quartersid'} label={'岗位'} zIndex={9999999999} style={{ width: '100%' }}>
                        {
                            initData.QuartersList?.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Form.Select field={'loginside'} label={'可登录端'} multiple zIndex={9999999999} style={{ width: '100%' }}>
                        <Form.Select.Option value="web端">web端</Form.Select.Option>
                        <Form.Select.Option value="app端">app端</Form.Select.Option>
                        <Form.Select.Option value="sns端">sns端</Form.Select.Option>
                        <Form.Select.Option value="sns办公端">sns办公端</Form.Select.Option>
                    </Form.Select>
                    <Form.Select field={'departmenthead'} label={'部门负责人'} zIndex={9999999999} style={{ width: '100%' }}>
                        <Form.Select.Option value="是">是</Form.Select.Option>
                        <Form.Select.Option value="否">否</Form.Select.Option>
                    </Form.Select>
                    <Form.Select field={'nologingorther'} label={'禁止登录其它部门'} zIndex={9999999999} style={{ width: '100%' }}>
                        <Form.Select.Option value="是">是</Form.Select.Option>
                        <Form.Select.Option value="否">否</Form.Select.Option>
                    </Form.Select>
                    <Form.Select field={'working'} label={'是否工作'} zIndex={9999999999} style={{ width: '100%' }}>
                        <Form.Select.Option value="是">是</Form.Select.Option>
                        <Form.Select.Option value="否">否</Form.Select.Option>
                    </Form.Select>


                    <Form.Select field={'removepermissionslist'} label={'移除权限方案'} multiple zIndex={9999999999} style={{ width: '100%' }}>
                        {
                            PermissionProgrammeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                            )
                        }
                    </Form.Select>


                    <Form.Select field={'addpermissionslist'} label={'增加权限方案'} multiple zIndex={9999999999} style={{ width: '100%' }}>
                        {
                            PermissionProgrammeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                            )
                        }
                    </Form.Select>



                    <Form.Select field={'state'} label={'状态'} zIndex={9999999999} style={{ width: '100%' }}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>

                    <Button variant={"contained"} type={"submit"}>提交</Button>
                </Form>
            </Modal>

            <Box display={"flex"}>
                <Button onClick={() => getlist()} variant={"contained"}>刷新</Button>
                <Button onClick={() => {
                    setopen(true)
                }} variant={"contained"} sx={{ ml: 1 }}>新增</Button>

            </Box>

            <Box height={'60vh'} overflow={"scroll"} mt={3}>
                <AgGridReact
                    rowData={list}
                    className="ag-theme-balham"
                    columnDefs={[
                        { field: 'department', headerName: '部门' },
                        { field: 'name', headerName: '姓名' },
                        { field: 'quarters', headerName: '岗位' },
                        { field: 'opeid', headerName: '工号' },
                        { field: 'telephone', headerName: '电话' },
                        { field: 'workdepartment', headerName: '工作门店' },
                        { field: 'working', headerName: '工作状态' },
                        { field: 'loginside', headerName: '客户端' },
                        { field: 'departmenthead', headerName: '管理人员' },
                        { field: 'state', headerName: '状态' },
                        {
                            headerName: '操作', pinned: 'right', cellRendererFramework: ({ data }) =>
                                <Box>
                                    <Button onClick={e => {
                                        console.log(e)
                                        setopen(true)
                                        setdata({
                                            ...formdata,
                                            ...data,
                                            action: 'UPDATE'
                                        })
                                    }
                                    }>编辑</Button>
                                    <Button onClick={async e => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_SystemSetting.ResetOperatorPassword',
                                            opeid: data.opeid,

                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('操作成功')
                                        } else {
                                            toast.error(rew.data.tips)
                                        }
                                    }
                                    }>重置密码</Button>
                                </Box>
                        },
                    ]}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                    defaultColDef={{
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default OperatorList;
