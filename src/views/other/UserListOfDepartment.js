import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from "@mui/material";
import { Form, Modal } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const UserListOfDepartment = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [attributiondepartmentid, setattributiondepartmentid] = useState(0)
    const [selectedRows, setselectedRows] = useState([])
    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserListOfDepartment',
            attributiondepartmentid: loginuser.login_departmentid
        })
        setList(rew.data)
    }, [])
    const [open, setopen] = useState(false)
    const onSelectionChanged = e => {
        const arr = gridRef.current.api.getSelectedRows();
        setselectedRows(arr)
    }
    const gridRef = useRef()
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
            <Modal visible={open} onCancel={() => setopen(false)} style={{ top: 100 }} footer={<></>} >
                {
                    open ?
                        <Form getFormApi={e => {
                            api.current = e
                        }} onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_User_EditInfo.BatchChangeUserInfo',
                                ...e,
                                userids: JSON.stringify(selectedRows.map(item => item.userid))
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('操作成功')
                            } else {
                                toast.error(`操作失败 ${rew.data.tips}`)
                            }
                            setopen(false)

                        }}>
                            <Form.Select onChange={e => {
                                console.log(e)
                                setattributiondepartmentid(e)
                            }} field={'attributiondepartmentid'} filter label={'归属部门'} style={{ width: '100%' }}>
                                {
                                    initData.DepartmentList.map(item => <Form.Select.Option
                                        value={item.id}>{item.label}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Select field={'salesmanopeid'} label={'业务员'} style={{ width: '100%' }}>
                                {
                                    initData.OperatorList.filter(item => item.departmentid === attributiondepartmentid).map(item =>
                                        <Form.Select.Option
                                            value={item.opeid}>{item.name}</Form.Select.Option>)
                                }
                            </Form.Select>
                            <Form.Input field={'remarks'} label={'备注'} />
                            <Button sx={{ mt: 2 }} type={"submit"} variant={"contained"}>确认修改</Button>
                        </Form> : ''
                }
            </Modal>

            <Box fontSize={18} mb={3}>部门用户列表</Box>

            <Button variant={"contained"} onClick={() => {
                if (!selectedRows.length) {
                    toast.error('请勾选用户')
                    return
                }
                setopen(true)
            }}>修改用户部门</Button>


            <Box height={'60vh'} overflow={"scroll"} mt={3}>
                <AgGridReact
                    ref={gridRef}
                    localeText={tanslations}
                    className='ag-theme-balham'
                    rowData={list}
                    onSelectionChanged={onSelectionChanged}
                    rowSelection="multiple"
                    columnDefs={[
                        {
                            field: 'memberid', headerName: '卡号', headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true,
                            checkboxSelection: true
                        },
                        { field: 'name', headerName: '姓名' },
                        { field: 'telephone', headerName: '电话' },
                        { field: 'address', headerName: '地址' },
                        { field: 'workplace', headerName: '工作单位' },
                        { field: 'floor', headerName: '楼层' },
                        { field: 'addtime', headerName: '注册时间' },
                        { field: 'salesman', headerName: '维护业务员' },
                        { field: 'state', headerName: '状态' },
                    ]}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        sortable: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserListOfDepartment;
