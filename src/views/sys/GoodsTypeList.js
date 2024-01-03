import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";

const GoodsTypeList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [open, setopen] = useState(false)
    const [formdata, setdata] = useState({
        action: 'ADD',
        id: 0
    })
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Box display={"flex"}>
                <Button onClick={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemInfo.GoodsTypeList'
                    })
                    setList(rew.data.info)
                }} variant={"contained"}>刷新</Button>
                <Button onClick={() => {
                    setdata({
                        action: 'ADD',
                        id: 0
                    })
                    setopen(true)
                }} variant={"contained"} sx={{ ml: 2 }}>新增</Button>
            </Box>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        { field: 'id', headerName: 'ID' },
                        { field: 'name', headerName: '名称' },
                        { field: 'name', headerName: '名称' },
                        { field: 'sort', headerName: '排序' },
                        { field: 'state', headerName: '状态' },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) => <Button onClick={e => {
                                console.log(e)
                                setopen(true)
                                setdata({
                                    ...formdata,
                                    ...data,
                                    action: 'UPDATE'
                                })
                            }
                            }>编辑</Button>
                        },
                    ]}
                />
            </Box>

            <Modal visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ top: 100 }}>
                <Form onSubmit={async e => {
                    // console.log(e)
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingGoodsType',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen(false)
                }} initValues={formdata}>
                    <Form.Input field={'name'} label={'用户类型名称'} />
                    <Form.Input field={'sort'} label={'排序'} />
                    <Form.Select field={'state'} label={'状态'} >
                        <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>
                    <Button type={'submit'} variant={"contained"}>确认提交</Button>
                </Form>
            </Modal>
        </Box>
    );
};

export default GoodsTypeList;
