import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { AgGridReact } from "ag-grid-react";
import {Form, Modal, Select} from "@douyinfe/semi-ui";
import { toast } from "react-toastify";


const OpeHoldPackingtypeInfo = () => {
    const [opeid, setopenid] = useState('')
    const [list, setlist] = useState('')
    const [open, setopen] = useState(false)
    const [open2, setopen2] = useState(false)
    const [open3, setopen3] = useState(false)
    const [datas, setdata] = useState('')
    const initData = JSON.parse(localStorage.getItem('initData'))
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.OpeHoldPackingtypeInfo',
            opeids: JSON.stringify(opeid)
        })
        setlist(rew.data)
    }

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const opelist = initData.OperatorList.filter(item => item.department === JSON.parse(localStorage.getItem('userinfo')).login_department)

    return (

        <Box padding={3} bgcolor="#FFF">
            <Box display="flex">
                {/*<Autocomplete*/}
                {/*    multiple*/}
                {/*    id="combo-box-demo"*/}
                {/*    options={opelist}*/}
                {/*    getOptionLabel={(item) => item.name}*/}
                {/*    onChange={(_, data) => {*/}
                {/*        if (data.length) {*/}
                {/*            const arr = data.map(item => item.opeid)*/}
                {/*            setopenid(arr)*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    sx={{ width: 300 }}*/}
                {/*    renderInput={(params) => <TextField {...params} label="选择员工" />}*/}
                {/*/>*/}




                <Select multiple prefix={'选择员工'} onChange={e=>{
                    setopenid(e)
                }}  filter label="选择员工" field="state" style={{ width: 350 }} maxTagCount={2} >
                    {
                        opelist.map(item =>
                            <Select.Option key={item.id} value={item.opeid}>{item.name}</Select.Option>
                        )
                    }
                </Select>
                <Button onClick={getlist} variant="contained" sx={{ ml: 3 }}>搜索</Button>
            </Box>
            <Box height="80vh" overflow="scroll" mt={3}>
                <AgGridReact
                    reactUi="true"
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={tanslations}
                    getRowStyle={params => {
                        if (params.data && params.data.archivesid == 0) {
                            return { color: "red" }
                        }

                        return { color: "black" }
                    }}
                    columnDefs={[
                        { field: 'grant_time', headerName: '受理时间', },
                        { field: 'packingtype', headerName: '包装物', },
                        { field: 'nature', headerName: '性质', },
                        { field: 'type', headerName: '类型', },
                        { field: 'code', headerName: '条码', },
                        { field: 'grant_mode', headerName: '来源模式', },
                        { field: 'grant_department', headerName: '来源部门', },
                        { field: 'grantee', headerName: '来源人', },

                        { field: 'department', headerName: '门店', },

                        { field: 'stockmen', headerName: '持有人', },

                        {
                            field: 'state', headerName: '状态', valueGetter: ({ data }) => {
                                if (data?.state === '待确认入库' && data?.stockmen === loginuser.name) {
                                    return '待确认出库'
                                }
                                return data?.state
                            }
                        },
                        {
                            headerName: '操作', pinned: 'left', width: 300, cellRendererFramework: ({ data }) =>
                                <Box>

                                    {data?.archivesid > 0 ?

                                        '' :
                                        <Button size={"small"} onClick={() => {
                                            setopen(true)
                                            setdata(data)
                                        }}>更新</Button>

                                    }
                                    <Button size={"small"} onClick={() => {
                                        setopen2(true)
                                        setdata(data)
                                    }}>更换持有人</Button>

                                    <Button size={"small"} onClick={() => {
                                        setopen3(true)
                                        setdata(data)
                                    }}>修改</Button>
                                </Box>

                        }
                    ]}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    defaultColDef={
                        {
                            sortable: true, // 开启排序
                            resizable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                            // flex: 1
                        }
                    }
                />
            </Box>

            <Modal visible={open3} onCancel={() => { setopen3(false) }} footer={<></>} >
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.ChangeMaterialType',
                        codejson: JSON.stringify([e.codejson]),
                        mode: e.mode,
                    })
                    if (rew.code === 200) {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen3(false)
                }}>
                    <Form.Input field={'codejson'} label={'包装物'} initValue={datas.code} />
                    <Form.Select label={'状态'} field={'mode'} initValue={datas.type == '空' ? '空(新)转重' : '重转空'}>
                        <Form.Select.Option value="空(新)转重">空(新)转重</Form.Select.Option>
                        <Form.Select.Option value="重转空">重转空</Form.Select.Option>
                    </Form.Select>

                    <Button type={"submit"} variant={"contained"}>提交</Button>
                </Form>
            </Modal>


            <Modal visible={open2} onCancel={() => { setopen2(false) }} footer={<></>} >
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Material_Handle.OpeExchangeOpeMaterial',
                        ...e,
                        grantee_opeid: datas.stockmen_opeid,
                        id: datas.id,
                        serial: datas.grant_serial
                    })
                    if (rew.code === 200) {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen2(false)
                }}>
                    <Form.Select label={'接收人'} field={'receiver_opeid'}>
                        {
                            initData.OperatorList.map(item =>
                                <Form.Select.Option value={item.opeid} >{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>
                    <Form.Input field={'remarks'} label={'备注'} />
                    <Button type={"submit"} variant={"contained"}>提交</Button>
                </Form>
            </Modal>
            <Modal visible={open} onCancel={() => { setopen(false) }} footer={<></>} >

                {
                    open ? <Form onSubmit={async e => {
                        if (datas.archivesid > 0) {
                            setopen(false)
                            return
                        }
                        const rew = await request('post', '/api/getInfo', {
                            id: datas.id,
                            ...e,
                            url: 'Srapp.Web_Material_Handle.UpdateOpeHoldPackingtypeInfoOfOld'
                        })

                        if (rew.code === 200) {
                            toast.success('更新成功')
                        } else {
                            toast.error('更新失败')
                        }
                        setopen(false)
                        setdata('')
                    }}>
                        <Form.Input field={'primary_code'} disabled initValue={datas.code} label={'原识别码'} />
                        <Form.Input field={'new_code'} label={'新识别码'} />
                        <Form.Input field={'remarks'} label={'备注'} />
                        <Button variant={"contained"} type={"submit"}>确认</Button>
                    </Form>
                        : ''
                }

            </Modal>
        </Box>
    );
};

export default OpeHoldPackingtypeInfo;
