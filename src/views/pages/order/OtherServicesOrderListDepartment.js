import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import { CheckboxGroup, Form, Image, Input, Modal, Popconfirm, Select } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';

const OtherServicesOrderListDepartment = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const [list, setlist] = useState([])
    const getlist = async (data) => {
        if (loginuser.login_department !== '预约中心') {
            data.department = JSON.stringify([loginuser.login_department])
        }
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_OtherServices_Infos.OtherServicesOrderList',
            ...data,
            state: JSON.stringify(["正常", "已安排", "已接单", "已完成", "取消", "已汇总"]),
        })
        setlist(rew.data)
        // console.log(rew)
    }

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [rowdata, setRowdata] = useState('')
    const [serviceopeid, setsServiceopeid] = useState('')
    const [open, setopen] = useState(false)
    const [imgOpen, setImgOpen] = useState(false)
    const [imgurlList, setImgurl] = useState([])
    const remarksdata = useRef('')
    const gridApi = useRef('')

    const [keywork, setKeywork] = useState('')

    useEffect(() => {
        gridApi.current.api.setQuickFilter(
            keywork
        );
    }, [keywork])


    return (
        <Box>

            <Box display="flex" alignItems="center">
                <TextField {...register('begintime')} size="small" type="date" />
                <TextField {...register('endtime')} size="small" type="date" />
                <Button onClick={handleSubmit(getlist)} sx={{ marginLeft: 2 }} variant="contained">搜索</Button>
            </Box>
            <Box height="60vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    ref={gridApi}
                    localeText={tanslations}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        // flex: 1
                    }}
                    getRowStyle={params => {
                        if (params.data && params.data.state === '已安排') {
                            return { color: "red" }
                        }
                        if (params.data && params.data.state === '已完成') {
                            return { color: "blue" }
                        }

                        if (params.data && params.data.state === '已汇总') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.state === '已接单') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.state === '取消') {
                            return { color: "pink" }
                        }
                        return { color: "black" }
                    }}

                    columnDefs={[
                        {
                            field: 'addtime',
                            headerName: '下单时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.addtime).format('YYYY-MM-DD HH:mm:ss'),
                            cellRenderer: 'agGroupCellRenderer'
                        },
                        {
                            field: 'appointmenttime',
                            headerName: '上门时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.appointmenttime).format('YYYY-MM-DD HH:mm:ss')
                        },
                        { field: 'servicetype', enableRowGroup: true, headerName: '服务类型' },
                        { field: 'department', enableRowGroup: true, headerName: '部门', hide: true },
                        { field: 'memberid', headerName: '会员号' },
                        { field: 'department', headerName: '部门' },
                        { field: 'address', headerName: '地址' },
                        { field: 'serviceope', headerName: '维修员' },
                        { field: 'booking_operator', enableRowGroup: true, headerName: '预约人' },
                        { field: 'remarks', enableRowGroup: true, headerName: '备注' },
                        { field: 'cancel_remarks', enableRowGroup: true, headerName: '取消备注' },
                        { field: 'cancel_operator', enableRowGroup: true, headerName: '取消人' },
                        { field: 'complete_remarks', enableRowGroup: true, headerName: '完成备注' },
                        { field: 'feedback_remarks', enableRowGroup: true, headerName: '汇总备注' },
                        { field: 'state', enableRowGroup: true, headerName: '状态' },
                        {
                            field: 'id', headerName: '操作', pinned: 'left', width: 200, cellRendererFramework: (data) => <div>
                                {
                                    data?.data?.state == '正常' && <Button size={'small'} onClick={async () => {
                                        setopen(true)
                                        setRowdata(data?.data)
                                        // const rew = await request('post','/api/getInfo',{
                                        //     url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                        //     ids: data.value,
                                        //     serviceopeid: 2
                                        // })
                                        // console.log(rew);
                                    }}>安排</Button>
                                }

                                {

                                    data.data.state == '已完成' && <Button size={'small'} onClick={async () => {
                                        setopen(true)
                                        setRowdata(data.data)
                                        // const rew = await request('post','/api/getInfo',{
                                        //     url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                        //     ids: data.value,
                                        //     serviceopeid: 2
                                        // })
                                        // console.log(rew);
                                    }}>汇总</Button>
                                }
                                {
                                    ['已安排', '已接单', '已汇总'].indexOf(data.data.state) !== -1 &&
                                    <Popconfirm style={{ width: 300 }} title="提示" content="确认操作?"
                                        onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_OtherServices_Handle.ResetUserOtherServicesOrder',
                                                ids: JSON.stringify([data.value]),
                                                remarks: `操作员 ${loginuser.name} 重置`
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                                handleSubmit(getlist)

                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                        }}><Button size={'small'}>重置</Button>


                                    </Popconfirm>
                                }
                                {
                                    data.data.state === '正常' &&
                                    <Popconfirm style={{ width: 300 }} title="提示" content={
                                        <Box>
                                            <Form onChange={e => {
                                                remarksdata.current = e.values.remarks
                                            }}>
                                                <Form.Input label="取消原因" field='remarks' />
                                            </Form>

                                        </Box>

                                    }
                                        onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_OtherServices_Handle.CancelUserOtherServicesOrder',
                                                ids: JSON.stringify([data.value]),
                                                remarks: `操作员 ${loginuser.name} 取消,原因 ${remarksdata.current}`
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                                handleSubmit(getlist)
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                        }}><Button size={'small'}>取消</Button>


                                    </Popconfirm>
                                }
                            </div>
                        },
                    ]}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </Box>
            <Box bgcolor="" py={1}>
                <Box display={'flex'} alignItems={'center'}>
                    {/* <Select filter prefix="维修员" style={{ width: 200, marginRight: 10 }}>
                        {
                            initData.OperatorList.filter(item => item.department === loginuser.login_department).map(item =>
                                <Select.Option value={item.opeid}>{item.name}</Select.Option>)
                        }

                    </Select> */}
                    <Input value={keywork} style={{ width: 200, marginRight: 10 }} type="text" placeholder='任意关键字搜索' id="filter-text-box" onChange={e => setKeywork(e)} />

                    {/* <CheckboxGroup options={[
                        { label: '打印机打印', value: '打印机打印' },
                        { label: '飞鹅打印', value: '飞鹅打印' },
                    ]} direction='horizontal' aria-label="CheckboxGroup 示例" /> */}
                </Box>
                <Box display={'flex'} mt={1}>
                    {/*<Form>*/}
                    {/*    <Form.Select filter field={'serviceopeid'} label="选择服务人员" style={{ width: '100%' }}>*/}
                    {/*        {*/}
                    {/*            initData.OperatorList*/}
                    {/*                .filter(item=>item.quarters == '配送员')*/}
                    {/*                .sort((a, b) => a.department === loginuser.login_department ? -1 : 1 )*/}
                    {/*                .map(item =>*/}
                    {/*                    <Form.Select.Option value={item.opeid}>[{item.department}]-{item.name}</Form.Select.Option>)*/}
                    {/*        }*/}

                    {/*    </Form.Select>*/}
                    {/*</Form>*/}

                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('安装')} size="small">安装</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('安检')} size="small">安检</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('维修')} size="small">维修</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('预算')} size="small">预算</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('验收')} size="small">验收</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('正常')} size="small">正常</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('已安排')} size="small">已安排</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('已接单')} size="small">已接单</Button>

                </Box>
                {/* <Button variant={'outlined'} size="small" sx={{ mt: 1 }}>确认安排</Button> */}
            </Box>

            <Modal title="门店业务操作" visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ top: 200 }}>
                {
                    rowdata.state === '正常' ? <Box>
                        <Form onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                ...e,
                                ids: JSON.stringify([rowdata.id]),
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('安排成功')
                                handleSubmit(getlist)
                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.error(`安排失败 ${rew.data.tips}`)
                            }
                            setopen(false)
                        }}>
                            <Form.Select filter field={'serviceopeid'} label="选择服务人员" style={{ width: '100%' }}>
                                {
                                    initData.OperatorList
                                        .filter(item=>item.quarters == '配送员' || item.quarters == '司机')
                                        .sort((a, b) => a.department === loginuser.login_department ? -1 : 1 )
                                        .map(item =>
                                            <Form.Select.Option value={item.opeid}>[{item.department}]-{item.name}</Form.Select.Option>)
                                }

                            </Form.Select>

                            <Button type={"submit"} variant={"contained"} size={"small"} sx={{ mt: 1 }}>确认安排</Button>
                        </Form>

                    </Box> : ''
                }
                {
                    rowdata.state === '已完成' ? <Box>

                        {
                            //展示图片信息  判断rowdata.imgids是数组才循环
                            Array.isArray(rowdata.imgids) ? rowdata.imgids.map(item =>

                                <Box> {item.explan} <span span onClick={async () => {
                                    setImgOpen(true)
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Action.GetImgList',
                                        id: JSON.stringify(item.imgids),
                                    })
                                    console.log(rew);
                                    setImgurl(rew.data)

                                }} style={{ cursor: 'pointer', color: 'blue' }}>查看安检图片</span></Box>
                            ) : ''
                        }

                        <Form onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.FeedbackUserOtherServicesOrder',
                                ...e,
                                id: rowdata.id

                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('汇总成功')
                                handleSubmit(getlist)
                            } else {
                                toast.error(`汇总失败 ${rew.data.tips}`)
                            }
                            setopen(false)
                        }}>
                            <Form.Input field={'num'} label={'数量'} initValue={1} />
                            <Form.Input field={'remarks'} label={'备注'} />

                            <Form.Select field={'state'} label="选择状态" style={{ width: '100%' }}>
                                <Form.Select.Option value={'已完工'}>已完工</Form.Select.Option>
                                <Form.Select.Option value={'未完工'}>未完工</Form.Select.Option>
                            </Form.Select>

                            <Button type={"submit"} variant={"contained"} size={"small"} sx={{ mt: 1 }}>确认汇总</Button>
                        </Form>

                    </Box > : ''
                }

            </Modal >

            <Modal title="安检图片" visible={imgOpen} onCancel={() => {
                setImgOpen(false)
                setImgurl([])
            }} footer={<></>} style={{ top: 200 }}>
                <Box>
                    {
                        imgurlList.map(item =>
                            <Box>
                                <h2>{item.imgtype}</h2>
                                <Image src={item.imgurl} width={400} height={400} />
                            </Box>
                        )
                    }

                </Box>
            </Modal>

        </Box >
    );
};

export default OtherServicesOrderListDepartment;
