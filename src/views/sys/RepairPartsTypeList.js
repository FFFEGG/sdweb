import React, { useRef, useState } from 'react';
import { Box, Button, Card } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import NavCard from "../../ui-component/cards/NavCard";


const RepairPartsTypeList = () => {
    const [list, setList] = React.useState([]);
    const api = useRef()
    const [open, setopen] = useState(false)
    const [formdata, setdata] = useState({
        action: 'ADD',
        id: 0
    })
    return (
        <form>
            <NavCard title="设置维修配件类型列表" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box height="80vh">

                    <Box display={"flex"} mb={3}>
                        <Button onClick={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_SystemInfo.RepairPartsTypeList'
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


                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '名称', field: 'name' },
                            { headerName: '排序', field: 'sort' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", pinned: 'left', cellRendererFramework: ({ data }) => (
                                    <Button onClick={() => {
                                        console.log(data)
                                        setopen(true)
                                        setTimeout(() => {
                                            api.current.setValues(data)
                                            api.current.setValue('id', data.id)
                                            api.current.setValue('action', 'UPDATE')
                                        }, 500)
                                    }}>编辑</Button>
                                ),
                            },
                        ]}
                    />
                </Box>

            </Card>

            <Modal visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ top: '10%' }}>
                <Form getFormApi={e => api.current = e} onSubmit={async e => {
                    // console.log(e)
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingRepairPartsType',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen(false)
                }} initValues={formdata}>
                    <Form.Input field={'name'} label={'名称'} />
                    <Form.Input field={'sort'} label={'排序'} />
                    <Form.Select field={'state'} label={'状态'} >
                        <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>
                    <Button type={'submit'} variant={"contained"}>确认提交</Button>
                </Form>
            </Modal>
        </form>
    );
}

export default RepairPartsTypeList;

