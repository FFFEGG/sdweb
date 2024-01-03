import { Form, Modal } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import request from 'utils/request';

const DispatchDepartmentList = () => {
    const [show, setshow] = useState(false)
    const [list, setlist] = useState([])
    const api = useRef(null);
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.DispatchDepartmentList',
        })
        setlist(rew.data.info)
    }
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={2}>调运部门信息</Box>
            <Box display={'flex'}>
                <Button variant={'contained'} onClick={getlist} color={'primary'} sx={{ mr: 1 }}>刷新</Button>
                <Button onClick={() => setshow(true)} variant={'contained'} color={'primary'}>新增</Button>


            </Box>

            <Modal title="新增调运部门" visible={show} onCancel={() => setshow(false)} onOk={() => api.current.submitForm()}>
                <Form initValues={{
                    id: 0,
                    action: 'ADD'
                }} getFormApi={e => api.current = e} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingDispatchDepartment',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setshow(false)
                    api.current.reset()
                }}>
                    <Form.Input label="部门名称" field='name' />
                    <Form.Input label="部门类型" field='type' />

                    <Form.Input label="排序" field='sort' />
                    <Form.Select label="状态" field='state' >
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>
                </Form>
            </Modal>

            <Box height={'60vh'} overflow={'scroll'} mt={2}>
                <AgGridReact

                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        {
                            headerName: '操作',
                            field: 'action',
                            width: 100,
                            cellRendererFramework: (params) => {
                                return (
                                    <Box display={'flex'} justifyContent={'space-around'}>
                                        <Button onClick={() => {
                                            setshow(true)
                                            setTimeout(() => {
                                                api.current.setValues(params.data)
                                                api.current.setValue('id', params.data.id)
                                                api.current.setValue('action', 'UPDATE')
                                            }, 200)

                                        }} size={'small'} variant={'text'} color={'primary'}>编辑</Button>

                                    </Box>
                                )
                            }
                        },
                        {
                            headerName: '部门名称',
                            field: 'name',
                            width: 100,
                        },
                        {
                            headerName: '部门类型',
                            field: 'type',
                            width: 100,
                        },
                        {
                            headerName: '排序',
                            field: 'sort',
                            width: 100,
                        },
                        {
                            headerName: '状态',
                            field: 'state',
                            width: 100,
                        },
                    ]}

                />
            </Box>


        </Box>
    );
};

export default DispatchDepartmentList;