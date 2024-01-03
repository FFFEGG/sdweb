import React, { useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import {Form, Modal} from "@douyinfe/semi-ui";
import {toast} from "react-toastify";

const MaterialPackingtypeArchivesList = () => {
    const [list, setList] = useState()
    const [page, setPage] = useState(1)
    const [pageinfo, setpageinfo] = useState({})
    const [data,setdata] = useState()
    const [show,setshow] = useState(false)
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD')
        }
    })
    const onsubmit = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.MaterialPackingtypeArchivesList',
            ...data,
            // page: 1,
            // row: 50
        })
        setList(rew.data)
        // setpageinfo(rew.pageinfo)
        // if (page == 1) {
        //     setpageinfo(rew.pageinfo)
        // }
        // const pageCount = rew.pageinfo.pageCount

        // if (pageCount > 1) {
        //     for (let i = 2; i <= pageCount; i++) {
        //         const rew = await request('post', '/api/getInfo', {
        //             url: 'Srapp.Web_Material_Infos.MaterialPackingtypeArchivesList',
        //             ...data,
        //             page: i,
        //             row: 50
        //         })
        //         setList(list => [...list, ...rew.data])
        //     }
        // }
    }

    return (
        <Box p={3} bgcolor="#FFF">
            <Box marginBottom={1} display="flex">
                <TextField {...register('begintime')} size="small" type="date" sx={{ mr: 1 }} />
                <TextField {...register('endtime')} size="small" type="date" sx={{ mr: 1 }} />
                <Button onClick={handleSubmit(onsubmit)} size="small" sx={{ p: 1, px: 4 }} variant="contained">搜索</Button>
            </Box>
            <Box height="80vh" overflow="scroll">
                <AgGridReact
                    reactUi="true"
                    className="ag-theme-balham"
                    localeText={tanslations}
                    columnDefs={[
                        { field: 'id', headerName: 'ID' },
                        { field: 'operator', headerName: '操作员' },
                        { field: 'addtime', headerName: '添加时间' },
                        { field: 'department', headerName: '部门' },
                        { field: 'nature', headerName: '属性' },
                        { field: 'code', headerName: '识别码' },
                        { field: 'property_unit', headerName: '产权单位' },
                        { field: 'trackingcode', headerName: '追溯码' },
                        { field: 'manufacturing_unit', headerName: '制造单位' },
                        { field: 'packingtype', headerName: '包装物类型' },
                        { field: 'reg_number', headerName: '登记编号（钢印）' },
                        { field: 'weight', headerName: '重量' },
                        // {field: 'province', headerName: '生产日期'},
                        { field: 'production_number', headerName: '出厂编号' },
                        // {field: 'lasttestdate', headerName: '最近检测日期'},
                        { field: 'nexttestdate', headerName: '下次检测日期' },
                        { field: 'volume', headerName: '容积（L）' },
                        { field: 'wall_thickness', headerName: '设计壁厚（MM）' },
                        { field: 'nominal_pressure', headerName: '公称压力(Mpa)' },
                        { field: 'material', headerName: '材料' },
                        { field: 'suttle', headerName: '充装量' },
                        // {field: 'type', headerName: '类型'},
                        { field: 'remarks', headerName: '备注' },
                        { headerName: '操作', width: 100, pinned:'left', cellRendererFramework:({data})=><Button onClick={()=>{
                                data.date4manufacture = moment(data.date4manufacture).format('YYYY-MM-DD')
                                data.nexttestdate = moment(data.nexttestdate).format('YYYY-MM-DD')
                                data.lasttestdate = moment(data.lasttestdate).format('YYYY-MM-DD')

                                setdata(data)
                                setshow(true)
                            }}>修改</Button>},
                    ]}
                    defaultColDef={{
                        sortable: true, // 开启排序
                        resizable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    pagination={true}
                    paginationPageSize={50}
                    rowData={list}
                />

            </Box>

            <Modal title={'修改档案'} visible={show} onCancel={()=>setshow(false)} footer={<></>}>
                <div>
                    <Form onSubmit={async e=>{
                        const rew = await request('post','/api/getInfo',{
                            url: 'Srapp.Web_Material_Handle.UpdateMaterialPackingtypeArchivesOflimitation',
                            ...e,
                            id: data.id
                        })
                        if(rew.data.msg == 'SUCCESS'){
                            setshow(false)
                            toast.success('修改成功')
                        } else {
                            toast.error('修改失败')
                        }
                    }}>
                        {/*id	整型	必须			包装物档案ID*/}
                        {/*manufacturing_unit	字符串	可选		最大：75	制造单位*/}
                        {/*reg_number	字符串	必须		最大：75	登记编号（钢印）*/}
                        {/*province	日期	必须			生产日期*/}
                        {/*production_number	字符串	必须		最大：75	出厂编号*/}
                        {/*lasttestdate	字符串	可选			最近检测日期*/}
                        {/*nexttestdate	日期	必须			下次检测日期*/}
                        {/*<Form.Input field={'id'} label={'id'} initValue={data?.id}/>*/}
                        <Form.Input field={'manufacturing_unit'} label={'制造单位'} initValue={data?.manufacturing_unit}/>
                        <Form.Input field={'reg_number'} label={'登记编号（钢印）'} initValue={data?.reg_number}/>
                        <Form.Input field={'date4manufacture'} type={'date'} label={'生产日期'} initValue={data?.date4manufacture}/>
                        <Form.Input field={'production_number'} label={'出厂编号'} initValue={data?.production_number}/>
                        <Form.Input field={'lasttestdate'} type={'date'} label={'最近检测日期'} initValue={data?.lasttestdate}/>
                        <Form.Input field={'nexttestdate'} type={'date'} label={'下次检测日期'} initValue={data?.nexttestdate}/>
                        <Button type={'submit'} variant={'contained'}>确认修改</Button>
                    </Form>
                </div>
            </Modal>
        </Box>
    );
};

export default MaterialPackingtypeArchivesList;
