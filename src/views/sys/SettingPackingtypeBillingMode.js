import React, { useEffect, forwardRef } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    FormControl,
    MenuItem,
    Select,
    Table,
    TextField,
    Typography
} from "@mui/material";
import request from "../../utils/request";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { InputLabel } from "@material-ui/core";
import { Form } from "@douyinfe/semi-ui";


const SettingPackingtypeBillingMode = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))

    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'PackingtypeBillingModeList'
        })
        console.log(response);
        setList(response.data.info);
    }
    useEffect(async () => {
        getlist();
    }, [])
    const { register, handleSubmit, setValue, control, reset, getValues } = useForm({

    });

    const [open, setOpen] = React.useState(false);
    const [formdata, setformdata] = React.useState('');


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    const submit = async (data) => {

        const rew = await request('post', '/api/getInfo', {
            ...formdata,
            url: 'Srapp.Web_SystemSetting.SettingPackingtypeBillingMode'
        })
        if (rew.code === 200) {
            toast('操作成功');
            handleClose();
        }
        console.log(rew);
    }


    const Edit = (data) => {
        console.log(data.data)
        data.data.action = 'UPDATE'
        setformdata(data.data)
        handleClickOpen()
    }
    const Add = () => {

        setformdata({
            action: 'ADD',
            id: 0
        })
        handleClickOpen()
    }

    const { Option } = Form.Select;

    return (
        <form>
            <NavCard title="包装物计费模式列表" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box height="80vh">
                    <Box display={"flex"} mb={3}>
                        <Button onClick={() => getlist()} variant={"contained"}>刷新</Button>
                        <Button onClick={() => Add()} variant={"contained"} sx={{ ml: 2 }}>新增</Button>
                    </Box>

                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '名称', field: 'name' },
                            { headerName: '单价', field: 'price' },
                            { headerName: '周期', field: 'cycle' },

                            { headerName: '排序', field: 'sort' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", cellRendererFramework: (rowData) => (
                                    <Button onClick={() => Edit(rowData)}>编辑</Button>
                                ),
                            },
                        ]}
                    />
                </Box>

            </Card>
            <Dialog

                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <Typography fontSize={18} mb={3}>包装物计费模式新增/修改</Typography>

                    <Form layout='vertical' initValues={formdata} onValueChange={values => setformdata(values)}>

                        <Form.Input field='name' label='包装物计费名称' />
                        <Form.Input field='price' label='单价' />
                        <Form.Input field='remarks' label='备注' />
                        <Form.Input field='cycle' label='周期（天）' />
                        <Form.Input field='sales_num' label='销售数量减免' />
                        <Form.Input field='prescription' label='收费时效' initValue="即时" />



                        <Form.Input field='sort' label='排序' />

                        <Form.Select zIndex={999999} field="state" label='状态' >
                            <Option value="正常">正常</Option>
                            <Option value="取消">取消</Option>
                        </Form.Select>




                    </Form>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(submit)}>确认添加/修改</Button>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}

export default SettingPackingtypeBillingMode;
