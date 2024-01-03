import React, { Component, useRef, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ArrayField, Form, Modal, Popconfirm, Button as Btn } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import { toast } from "react-toastify";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import translation from '../../utils/translations'

const NoScanTransferMaterial = () => {
    const [list, setlist] = useState()
    const [time, settime] = useState({
        begintime: moment().format('YYYY-MM-DD'),
        endtime: moment().format('YYYY-MM-DD')
    })
    const [fromdata, setformdata] = useState({
        mode: '调出物资',
        goodsid: 0,
        num: '',
        type: '重',
        transaction_department: '',
        Handler: '',
        remarks: '',
    })
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
    const getlist = async () => {
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.NoScanTransferMaterialRecord',
            ...time
        })
        setlist(rew.data)
    }

    const api = useRef()

    return (
        <Box borderRadius={1} bgcolor="#fff" p={3}>
            <Typography fontSize={18} width="100%">非扫描方式调运物资</Typography>

            <Box mt={3} p={3} border={1} borderRadius={1} borderColor="#ccc">
                <Typography fontSize={18} width="100%">列表</Typography>
                <Box display="flex" alignItems="center" mt={3}>

                    <Form getFormApi={e => api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                        setlist([])
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Material_Infos.NoScanTransferMaterialRecord',
                            ...e,
                            department: JSON.stringify(e.department)
                        })
                        setlist(rew.data)
                    }}>
                        <Form.Input field={'begintime'} type={'date'} label="开始时间" initValue={moment().format('YYYY-MM-DD')} />
                        <Form.Input field={'endtime'} type={'date'} label="结束时间" initValue={moment().format('YYYY-MM-DD')} />
                        <Form.Select label={'模式'} field={'mode'} initValue={'调出'}>
                            <Form.Select.Option value={'调入'}>调入</Form.Select.Option>
                            <Form.Select.Option value={'调出'}>调出</Form.Select.Option>
                        </Form.Select>


                        <Form.Select label={'模式'} field={'type'} initValue={'重'}>
                            <Form.Select.Option value={'重'}>重</Form.Select.Option>
                            <Form.Select.Option value={'空'}>空</Form.Select.Option>
                        </Form.Select>



                        {/* <Form.Select label={'部门'} style={{ width: 300 }} maxTagCount={1} multiple field={'department'} filter>
                            {
                                initData.DepartmentList.filter(item => item.type == '业务门店').map(item => {
                                    return <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                                })
                            }
                        </Form.Select> */}

                        <Form.TreeSelect leafOnly filterTreeNode treeData={new_department_byname} label={'部门'} style={{ width: 300 }} maxTagCount={1} multiple field={'department'} filter />

                        <Button type={'submit'} size={'small'} variant="contained">搜索</Button>
                    </Form>
                    {/*<TextField value={time.begintime} onChange={e => settime({ ...time, begintime: e.target.value })}*/}
                    {/*    size="small" type="date" label="开始时间" />*/}
                    {/*<TextField value={time.endtime} onChange={e => settime({ ...time, endtime: e.target.value })}*/}
                    {/*    size="small" type="date" label="结束时间" />*/}

                </Box>
                <Box height="40vh" overflow="scroll" mt={3}>
                    <AgGridReact
                        className="ag-theme-balham"
                        localeText={translation}
                        rowData={list}
                        columnDefs={[
                            { headerName: '录入时间', field: 'addtime' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '录入部门', field: 'initiator' },
                            { headerName: '经手人', field: 'handler' },
                            { headerName: '发出部门', field: 'grant_department' },
                            { headerName: '发出员工', field: 'grantee' },
                            { headerName: '接收部门', field: 'department' },
                            { headerName: '接收员工', field: 'operator' },
                            { headerName: '确认时间', field: 'confirm_time' },

                            { headerName: '类型', field: 'type' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) =>
                                    <Box>

                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Material_Handle.CancelNoScanTransferMaterial',
                                                id: data.id,
                                                serial: data.serial
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            api.current.submitForm()
                                        }}>
                                            {
                                                data.initiator === loginuser.login_department ? <Button size="small" variant="text" color="error">取消</Button> : ''
                                            }

                                        </Popconfirm>


                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Material_Handle.ConfirmNoScanTransferMaterial',
                                                id: data.id,
                                                serial: data.serial
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            api.current.submitForm()
                                        }}>
                                            {
                                                (data.initiator !== loginuser.login_department && data.state === '正常') ? <Button size="small" variant="text" color="success">确认</Button> : ''
                                            }

                                        </Popconfirm>



                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Material_Handle.CancelConfirmNoScanTransferMaterial',
                                                id: data.id,
                                                serial: data.serial
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                            api.current.submitForm()
                                        }}>
                                            {
                                                (data.initiator != loginuser.login_department && data.state === '已完成') ? <Button size="small" variant="text" color="success">取消确认</Button> : ''
                                            }

                                        </Popconfirm>
                                    </Box>
                            },

                        ]}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true,
                            sortable: true
                        }}
                    />
                </Box>

            </Box>

            <Box mt={3} p={3} border={1} borderRadius={1} borderColor="#ccc">
                <Typography fontSize={18} width="100%">调运录入</Typography>
                <Box mt={3}>

                    <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
                        Modal.confirm({
                            title: '提示',
                            content: '确认操作?',
                            onOk: async () => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Material_Handle.NoScanTransferMaterial',
                                    ...e,
                                    goodsjson: JSON.stringify(e.goodsjson),
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('操作成功')
                                    // api.current.reset()
                                } else {
                                    toast.error(`操作失败 ${rew.data.tips}`)
                                }
                            }
                        })
                        // const rew = await request('post', '/api/getInfo', {
                        //     url: 'Srapp.Web_Material_Handle.NoScanTransferMaterial',
                        //     ...e
                        // })
                        // if (rew.data.msg === 'SUCCESS') {
                        //     toast.success('操作成功')
                        // } else {
                        //     toast.error(`操作失败 ${rew.data.tips}`)
                        // }
                    }}>
                        <Form.Input size="large" field='addtime' label="时间" type={'date'} initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                        <Form.Select size="large" field='mode' label="模式" initValue={'接收物资'} style={{ width: 200 }}>
                            <Form.Select.Option value="调出物资">调出物资</Form.Select.Option>
                            <Form.Select.Option value="接收物资">接收物资</Form.Select.Option>
                        </Form.Select>
                        <Box width={'100%'} mt={1} mb={1}>
                            <ArrayField field='goodsjson'>
                                {({ add, arrayFields, addWithInitValue }) => (
                                    <Box border={1}>
                                        <Btn onClick={add} theme='light'> 新增</Btn>
                                        {
                                            arrayFields.map(({ field, key, remove }, i) => (
                                                <Box key={key} style={{ display: 'flex', flexWrap: "wrap" }}>

                                                    <Form.Select size="large" filter field={`${field}[goodsid]`} label="商品(可选)" initValue={0} style={{ width: 200 }}>
                                                        {
                                                            initData.GoodsList.filter(item => {

                                                                return (item.attribute === '实体商品' && (item.salesmethods.includes('快消品销售') || item.salesmethods.includes('周转销售(不扫描)')))

                                                            }).map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                                                        }
                                                    </Form.Select>
                                                    <Form.Input size="large" field={`${field}[num]`} label="数量" initValue={1} style={{ width: 200 }} />

                                                    <Form.Select size="large" field={`${field}[type]`} label="包装物重空" initValue={'重'} style={{ width: 200 }}>
                                                        <Form.Select.Option value="重">重</Form.Select.Option>
                                                        <Form.Select.Option value="空">空</Form.Select.Option>
                                                    </Form.Select>


                                                    <Btn type='danger' theme='borderless' onClick={remove}
                                                        style={{ margin: 12 }}>删除</Btn>
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                )}
                            </ArrayField>

                        </Box>









                        <Form.Select size="large" filter field='transaction_department' label="交易部门" initValue={''} style={{ width: 200 }}>
                            {
                                initData.DispatchDepartmentList.map(item =>
                                    <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                                )
                            }


                            {
                                initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Select size="large" filter field='Handler' label="经手人" initValue={loginuser.name} style={{ width: 200 }}>
                            {
                                initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Input size="large" field='remarks' label="备注" initValue={''} style={{ width: 200 }} />
                        <Button type="submit" size="large" variant="outlined" sx={{ width: 200, height: 40 }}>确认提交</Button>
                    </Form>



                </Box>
            </Box>
        </Box>
    );

}

export default NoScanTransferMaterial;
