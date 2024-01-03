import React, { useRef, useState } from 'react';
import { Box, Button } from "@mui/material";
import { Form, Modal } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const UserListOfSalesman = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [attributiondepartmentid, setattributiondepartmentid] = useState(0)
    const [selectedRows, setselectedRows] = useState([])
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
                                userids: JSON.stringify(selectedRows?.map(item => item.userid))
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
                                    initData.DepartmentList.filter(item => item.name.includes('商'))?.map(item => <Form.Select.Option
                                        value={item.id}>{item.name}</Form.Select.Option>)
                                }
                            </Form.Select>

                            <Form.Select filter field={'salesmanopeid'} label={'业务员'} style={{ width: '100%' }}>
                                {
                                    initData?.OperatorList.filter(item => item.department.includes('商'))?.map(item =>
                                        <Form.Select.Option
                                            value={item.opeid}>{item.name}</Form.Select.Option>)
                                }
                            </Form.Select>
                            <Form.Input field={'remarks'} label={'备注'} />
                            <Button sx={{ mt: 2 }} type={"submit"} variant={"contained"}>确认修改</Button>
                        </Form> : ''
                }
            </Modal>

            <Box fontSize={18} mb={3}>获取业务员维护用户列表</Box>
            <Form labelPosition={"inset"} layout={"horizontal"} onSubmit={async (e) => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserListOfSalesman',
                    ...e,
                })
                setList(rew.data)
            }}>
                <Form.Select label={'范围'} field={'keytype'} initValue={'全部'} style={{ width: 150 }}>
                    <Form.Select.Option value={'会员号'}>会员号</Form.Select.Option>
                    <Form.Select.Option value={'姓名'}>姓名</Form.Select.Option>
                    <Form.Select.Option value={'电话'}>电话</Form.Select.Option>
                    <Form.Select.Option value={'地址'}>地址</Form.Select.Option>
                    <Form.Select.Option value={'单位'}>单位</Form.Select.Option>
                    <Form.Select.Option value={'全部'}>全部</Form.Select.Option>
                </Form.Select>
                <Form.Input field={'keyword'} label={'关键字'} />

                <Form.Select field={'salesmanopeid'} rules={[{ required: true, message: '必填' }]} filter label={'业务员'} style={{ width: 150 }}>
                    {
                        initData.OperatorList.filter(item => item.department.includes('商'))?.map(item => <Form.Select.Option
                            value={item.opeid}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>

                <Button variant={"contained"} size={"small"} type={'submit'}>搜索</Button>

                <Button sx={{ ml: 2 }} variant={"contained"} onClick={() => {
                    if (!selectedRows.length) {
                        toast.error('请勾选用户')
                        return
                    }
                    setopen(true)
                }}>修改用户部门</Button>
            </Form>

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

                        { field: 'addtime', headerName: '开户时间' },
                        { field: 'name', headerName: '姓名' },
                        { field: 'workplace', headerName: '单位' },
                        { field: 'telephone', headerName: '电话' },
                        { field: 'address', headerName: '地址' },
                        { field: 'customtype', headerName: '客户类型' },

                        { field: 'state', headerName: '状态' },
                        { field: 'state', headerName: '归属部门' },
                        { field: 'floor', headerName: '楼层' },

                    ]}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserListOfSalesman;
