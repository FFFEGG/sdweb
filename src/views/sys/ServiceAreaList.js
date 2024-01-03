import React, { useEffect, useRef, useState } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Autocomplete, Box, Button, Card, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import EditIcon from '@mui/icons-material/Edit';
import FormDialog from "../../ui-component/form/FormDialog";
import { useForm } from "react-hook-form";
import DialogActions from "@mui/material/DialogActions";
import options from '../../utils/city'
// import { Cascader } from 'antd';
import Department from "../../ui-component/Department";
import { ToastContainer, toast } from 'react-toastify';
import { Form, Modal } from "@douyinfe/semi-ui";

import city from "../../utils/city";


const ServiceAreaList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [datavaules, setdatavaules] = useState([])
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            province: '广西壮族自治区',
            city: '南宁市',
            area: '青秀区',
            town: '新竹街道'
        }
    });
    const [list, setList] = useState([])
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(async () => {
        const response = await request('post', '/api/sysGetList', {
            url: 'ServiceAreaList'
        })

        setList(response.data.info)
    }, [])

    const [cascader, setCascader] = useState(['广西壮族自治区', '南宁市', '青秀区', '新竹街道'])

    const handleChange = (value, citylist) => {
        // onChange(value)
        console.log(value)
        // setCascader(value)
        // // console.log(citylist)
        // form.setFieldsValue({
        //     province: value[0],
        //     city: value[1],
        //     area: value[2],
        //     town: value[3],
        // })
    }
    const [show, setshow] = useState(false)
    const [citylist, setcitylist] = useState([])
    const [arealist, setarea] = useState([])
    const [townlist, settown] = useState([])
    const [opeList, setopelist] = useState([])

    const changecity = (data) => {
        city.forEach(item => {

            if (item.value === data) {
                setcitylist(item.children)
            }
        })
    }
    const changearea = (data) => {
        citylist.forEach(item => {
            if (item.value === data) {
                setarea(item.children)
            }
        })
    }
    const changetown = (data) => {
        arealist.forEach(item => {
            if (item.value === data) {
                settown(item.children)
            }
        })
    }


    const api = useRef()

    const changeope = (data) => {
        var arr = []
        initData.OperatorList.forEach(item => {
            if (item.departmentid === data) {
                arr.push(item)

            }
        })
        setopelist(arr)
        api.current?.setValue('opeid', '')
    }




    useEffect(() => {
        changecity('广西壮族自治区')
        changeope(loginuser.login_departmentid)
    }, [])


    useEffect(() => {

        changearea('南宁市')
    }, [citylist])

    useEffect(() => {

        changetown('青秀区')
    }, [arealist])



    return (
        <div>

            <NavCard title="服务参数配置" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box display={"flex"}>
                    <Button sx={{ mr: 3 }} onClick={() => {
                        setshow(true)


                        // api.current.setValues('')

                    }} variant={"contained"} >新增</Button>
                    <Button onClick={async () => {
                        const response = await request('post', '/api/sysGetList', {
                            url: 'ServiceAreaList'
                        })

                        setList(response.data.info)

                    }} variant={"contained"} >刷新</Button>
                </Box>



                <div style={{ height: '70vh', width: '100%', marginTop: 30 }}>
                    <AgGridReact
                        colResizeDefault="shift"
                        reactUi="true"
                        chartThemes="material"
                        className="ag-theme-balham"
                        rowData={list}

                        columnDefs={[
                            { headerName: 'ID', field: 'id' },
                            { headerName: '省', field: 'province' },
                            { headerName: '市', field: 'city' },
                            { headerName: '区/县', field: 'area' },
                            { headerName: '镇/街道办', field: 'town' },
                            { headerName: '区域名称', field: 'name' },
                            { headerName: '默认服务部门', field: 'department' },
                            { headerName: '默认服务配送员', field: 'opeid' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '排序', field: 'sort' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: '操作',
                                floatingFilter: false,
                                editable: false,
                                resizable: false,
                                pinned: 'left',
                                cellRendererFramework: ({ data }) => <Button size={"small"} onClick={() => {
                                    // console.log(params.data)
                                    // setdatavaules(params.data)
                                    // handleClickOpen(true)
                                    setshow(true)
                                    setTimeout(() => {
                                        api.current.setValues(data)
                                        api.current.setValue('id', data.id)
                                        api.current.setValue('action', 'UPDATE')
                                    }, 500)


                                }} startIcon={<EditIcon />}>
                                    编辑
                                </Button>
                            },

                        ]}
                        defaultColDef={
                            {
                                width: 150,
                                editable: true,
                                filter: 'agTextColumnFilter',
                                floatingFilter: true,
                                resizable: true
                                // // flex: 1,
                            }
                        }
                    />
                    <FormDialog open={open} handleClose={handleClose} >
                        <form onSubmit={handleSubmit((data) => {
                            console.log(data);
                        })}>

                            <TextField sx={{ width: '100%', mt: 1 }} {...register('name')} label="区域名称" />
                            <Box sx={{ mt: 1 }}>
                                <Department title="默认服务部门" datavaules={datavaules} setValue={setValue} />
                            </Box>

                            <DialogActions>
                                <Button onClick={handleClose}>取消</Button>
                                <Button type="submit">确认</Button>
                            </DialogActions>
                        </form>
                    </FormDialog>
                </div>
            </Card>
            <Modal visible={show} style={{ top: '10%' }} footer={<></>} onCancel={() => { setshow(false) }}>
                <Form initValues={{
                    id: 0,
                    action: 'ADD'
                }} getFormApi={e => api.current = e} labelPosition={"inset"} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingServiceAreaParameter',
                        ...e,
                        longitudeandlatitude: JSON.stringify(e.longitudeandlatitude)
                    })
                    if (rew.code === 200) {
                        toast.success('成功')
                    } else {
                        toast.erro('失败')
                    }
                    // api.current.submit()
                    setshow(false)
                }}>
                    <Form.Select onChange={e => changecity(e)} label={'省'} field={'province'} initValue={'广西壮族自治区'} style={{ width: '100%' }}>
                        {

                            city.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>


                    <Form.Select onChange={e => changearea(e)} label={'市'} field={'city'} style={{ width: '100%' }} initValue={'南宁市'}>
                        {

                            citylist.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select onChange={e => changetown(e)} label={'区/县'} field={'area'} style={{ width: '100%' }} initValue={'青秀区'}>
                        {

                            arealist.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select label={'镇/街道办'} field={'town'} style={{ width: '100%' }} initValue={'新竹街道办'} >
                        {

                            townlist.map(item => <Form.Select.Option value={item.value}>{item.value}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Input field={'name'} label={'区域名称'} />

                    <Form.Select label={'部门'} onChange={e => changeope(e)} filter field={'departmentid'} style={{ width: '100%' }}>
                        {
                            initData.DepartmentList.map(item =>
                                <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select label={'默认配送员'} showClear field={'opeid'} style={{ width: '100%' }} >
                        {
                            opeList.filter(item => item.distribution > 0).map(item => <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                        }

                    </Form.Select>


                    <Form.Input field={'remarks'} label={'备注'} />
                    <Form.Input field={'longitudeandlatitude'} label={'经纬度JSON'} />
                    <Form.Input field={'sort'} label={'排序'} />



                    <Form.Select label={'状态'} field={'state'} style={{ width: '100%' }} >
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>


                    <Button variant={"contained"} type={"submit"}>确认</Button>

                </Form>
            </Modal>



        </div>

    )
}

export default ServiceAreaList;
