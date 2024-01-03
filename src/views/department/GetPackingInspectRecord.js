import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import tanslations from '../../utils/translations.json'

const GetPackingInspectRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [show, setshow] = useState(false)
    const [add, setadd] = useState(false)
    const [list, setlist] = useState([])
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography mb={3} fontSize={18} color={"black"}>获取包装物检查信息</Typography>

            <Form layout={'horizontal'} labelPosition={"inset"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_WorkSafety_Infos.GetPackingInspectRecord',
                    ...e
                })
                setlist(rew.data)

            }}>
                <Form.Input type="date" field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type="date" field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Box display={"flex"} alignItems={"end"}>
                    <Button type={"submit"} sx={{ mr: 2 }} variant={"outlined"} size={"small"}>搜索</Button>
                    <Button sx={{ mr: 2 }} onClick={() => {
                        setshow(true)
                    }} variant={"outlined"} size={"small"}>新增抽检</Button>


                    <Button onClick={() => {
                        setadd(true)
                    }} variant={"outlined"} size={"small"}>新增位置核查</Button>
                </Box>
            </Form>


            <Modal title="新增位置核查" visible={add} footer={<></>} onCancel={() => { setadd(false) }} style={{ top: '10%' }}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_WorkSafety_Handle.PackingtypePosition',
                        codes: JSON.stringify(e.codes)
                    })
                    console.log(rew);
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('录入成功')
                    }
                    setadd(false)

                }}>
                    <Form.TagInput field={'codes'} label={'钢瓶号'} placeholder='录入完回车继续' />


                    <Button variant="contained" type="submit">确认录入</Button>
                </Form>
            </Modal>


            <Modal visible={show} footer={<></>} onCancel={() => { setshow(false) }} style={{ top: '10%' }}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_WorkSafety_Handle.PackingInspect',
                        ...e
                    })
                    console.log(rew);
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('录入成功')
                    } else {
                        toast.error(`录入失败 ${rew.data.tips}`)
                    }
                    setshow(false)
                }}>
                    <Form.Input field={'inspecttype'} label={'检查类型'} initValue={'空瓶检查'} />
                    <Form.Input field={'details'} label={'检测数据'} />
                    {/* <Form.Select field='details' label={'检测数据'} filter>
                        {
                            initData.SecurityInspectionItemsList.filter(item => item.name == "空瓶检查").map(item => <Form.Select.Option value={item}>{item}</Form.Select.Option>)
                        }
                    </Form.Select> */}
                    <Form.Input field={'code'} label={'识别码'} />
                    <Form.Input field={'detectionresult'} label={'检测结果'} />
                    <Button variant={"contained"} type={"submit"}>确认录入</Button>
                </Form>
            </Modal>
            <Box height={'60vh'} overflow={"scroll"} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '添加时间', field: 'addtime' },
                        { headerName: '识别码', field: 'code' },
                        { headerName: '检查类型', field: 'inspecttype' },
                        { headerName: '检测数据', field: 'details' },
                        { headerName: '检测结果', field: 'detectionresult' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '操作员', field: 'operator' },
                        // {headerName: '状态',field:'state'},
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) => <Button onClick={async () => {
                                Modal.confirm({
                                    title: '确认删除？',
                                    content: '删除后不可恢复',
                                    onOk: async () => {

                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_WorkSafety_Handle.CancelPackingInspect',
                                            id: data.id
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('取消成功')
                                        } else {
                                            toast.error('取消失败')
                                        }

                                    }
                                })

                            }} size={"small"}>取消</Button>
                        },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    localeText={tanslations}
                />
            </Box>

        </Box>
    );
};

export default GetPackingInspectRecord;
