import React, { useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Box, Button, Dialog, TextField, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useForm } from "react-hook-form";
import request from "../../utils/request";
import { toast } from "react-toastify";

const SettingServiceType = () => {
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            id: 0,
            action: 'ADD',
            state: '正常',
            sort: '99'
        }
    })
    const [list, setList] = useState([])
    const [state, setstate] = useState('正常')
    const [type, settype] = useState(1)
    const [open, setopen] = useState(false)
    const submit = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_SystemSetting.SettingServiceType'
        })
        if (rew.code === 200) {
            toast.success(`成功 ${rew.data.tips}`)
            reset()
            setopen(false)
        } else {
            toast.error(`添加失败 ${rew.data.tips}`)
        }
    }

    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.ServiceTypeList'
        })
        setList(rew.data.info)
    }
    return (
        <Box height="80vh" overflow="scroll">
            <Button onClick={() => { getlist() }} variant="contained" sx={{ marginBottom: 2, marginRight: 2 }}>搜索</Button>
            <Button onClick={() => {
                setopen(true)
            }} variant="contained" sx={{ marginBottom: 2 }}>新增</Button>
            <AgGridReact
                className="ag-theme-balham"
                reactUi="true"
                rowData={list}
                columnDefs={[
                    { field: 'id', headerName: 'ID' },
                    { field: 'name', headerName: '名称' },
                    { field: 'sort', headerName: '排序' },
                    { field: 'type', headerName: '类型' },
                    { field: 'state', headerName: '状态' },
                    {
                        headerName: '操作', cellRendererFramework: ({ data }) => <Button size={"small"} onClick={() => {
                            setopen(true)
                            setValue('id', data.id)
                            setValue('action', 'UPDATE')
                            setValue('name', data.name)
                            setValue('complete_detailed', data.complete_detailed)
                            setValue('sort', data.sort)
                        }} >编辑</Button>
                    },
                ]}
            />

            <Dialog
                open={open}
                onClose={() => {
                    setopen(false)
                }}
            >
                <Box p={3}>
                    <Typography fontSize={20} marginBottom={2}>新增</Typography>
                    <form>
                        <TextField {...register('name')} fullWidth sx={{ marginBottom: 2 }} label="服务名称" />
                        <TextField {...register('complete_detailed')} fullWidth sx={{ marginBottom: 2 }} label="完成结果选项" />
                        <TextField {...register('sort')} fullWidth sx={{ marginBottom: 2 }} label="排序" />
                        <Box mb={1}>
                            <ToggleButtonGroup
                                color="primary"
                                exclusive
                                size="small"
                                value={state}
                                onChange={(e, data) => {
                                    // console.log(data)
                                    setstate(data)
                                    setValue('state', data)
                                }}
                            >
                                <ToggleButton value="正常">正常</ToggleButton>
                                <ToggleButton value="取消">取消</ToggleButton>

                            </ToggleButtonGroup>
                        </Box>

                        <ToggleButtonGroup
                            color="primary"
                            exclusive
                            size="small"
                            value={type}
                            onChange={(e, data) => {
                                // console.log(data)
                                settype(data)
                                setValue('type', data)
                            }}
                        >
                            <ToggleButton value={1}>门店业务</ToggleButton>
                            <ToggleButton value={2}>客服中心业务</ToggleButton>
                            <ToggleButton value={3}>商用气业务</ToggleButton>

                        </ToggleButtonGroup>




                        <Box marginTop={2}>
                            <Button onClick={handleSubmit(submit)} variant="contained">确认</Button>
                        </Box>

                    </form>
                </Box>
            </Dialog>
        </Box>
    );
};

export default SettingServiceType;
