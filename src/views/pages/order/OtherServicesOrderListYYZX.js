import React, {useEffect, useRef, useState} from 'react';
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import {useForm} from "react-hook-form";

import moment from "moment";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import {CheckboxGroup, Form, Image, Input, Modal, Popconfirm, Select} from "@douyinfe/semi-ui";
import {toast} from "react-toastify";

const OtherServicesOrderListYYZX = () => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            begintime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const [list, setlist] = useState([])
    const [wxlist, setwxlist] = useState([])

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
    const api = useRef('')

    const [rowdata, setRowdata] = useState('')
    const [serviceopeid, setsServiceopeid] = useState('')
    const [open, setopen] = useState(false)
    const [imgOpen, setImgOpen] = useState(false)
    const [imgurlList, setImgurl] = useState([])
    const remarksdata = useRef('')
    const gridApi = useRef('')
    const [rowlist, setRowlist] = useState([])

    const [keywork, setKeywork] = useState('')

    useEffect(() => {
        gridApi.current.api.setQuickFilter(
            keywork
        );
    }, [keywork])

    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsList'
        })
        setwxlist(rew.data.info)
    }, [])

    const [repairitem, setRepairitem] = useState()
    const [reqairnum, setReqairnum] = useState(1)
    const [reqairList, setReqairList] = useState([])
    const [bzopen, setbzopen] = useState(false)

    return (
        <Box>

            <Box fontSize={18} mb={2}>客服中心门店业务</Box>
            <Box display="flex" alignItems="center">

                <Form getFormApi={e => api.current = e} labelPosition="inset" layout="horizontal" onSubmit={async e => {
                    if (loginuser.login_department !== '预约中心' && loginuser.login_department !== '运营监督') {
                        e.department = JSON.stringify([loginuser.login_department])
                    }
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_OtherServices_Infos.OtherServicesOrderList',
                        ...e,
                        state: JSON.stringify(["正常", "已安排", "已接单", "已完成", "取消", "已汇总"]),

                    })
                    setlist(rew.data)
                }}>
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='begintime'
                                label='开始时间'/>
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='endtime' label='结束时间'/>
                    <Form.Input field='serial' label='单据号'/>

                    <Button type="submit" size="small" variant="contained">搜索</Button>

                </Form>
            </Box>
            <Modal title={'修改备注'} visible={bzopen} onCancel={() => setbzopen(false)} footer={<></>}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_OtherServices_Handle.ChangeUserOtherServicesOrderInfo',
                        ...e,
                        id: rowdata.id
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('修改成功')
                        api.current.submitForm()
                    } else {
                        toast.error(`修改失败 ${rew.data.tips}`)
                    }
                    setbzopen(false)
                }}>
                    <Form.Select field={'department'} filter initValue={rowdata.department} style={{width: '100%'}} label={'门店'}>
                        {
                            initData.DepartmentList.map(item => <Form.Select.Option
                                value={item.name}>{item.label}</Form.Select.Option>)

                        }
                    </Form.Select>
                    <Form.Input field={'remarks'} label={'备注'} initValue={rowdata.remarks}/>
                    <Button type={"submit"} variant={"contained"} size={"small"} sx={{mt: 1}}>确认修改</Button>
                </Form>
            </Modal>


            <Box height="60vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    rowSelection="multiple"
                    ref={gridApi}
                    localeText={tanslations}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        // flex: 1
                    }}
                    onSelectionChanged={(data) => {
                        // console.log(data.api.getSelectedRows())
                        setRowlist(data.api.getSelectedRows())
                    }}

                    getRowStyle={params => {
                        if (params.data && params.data.state === '已安排') {
                            return {color: "red"}
                        }
                        if (params.data && params.data.state === '已完成') {
                            return {color: "blue"}
                        }

                        if (params.data && params.data.state === '已汇总') {
                            return {color: "green"}
                        }

                        if (params.data && params.data.state === '已接单') {
                            return {color: "green"}
                        }

                        if (params.data && params.data.state === '取消') {
                            return {color: "pink"}
                        }
                        return {color: "black"}
                    }}
                    isRowSelectable={data => data.data.state === '正常'}
                    columnDefs={[
                        {field: 'serial', headerName: '单据号'},
                        {
                            field: 'addtime',
                            headerName: '下单时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.addtime).format('YYYY-MM-DD HH:mm:ss'),
                            checkboxSelection: true,
                            headerCheckboxSelection: true,
                        },
                        {
                            field: 'appointmenttime',
                            headerName: '上门时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.appointmenttime).format('YYYY-MM-DD HH:mm:ss')
                        },
                        {field: 'servicetype', enableRowGroup: true, headerName: '服务类型'},
                        {field: 'department', enableRowGroup: true, headerName: '部门', hide: true},
                        {field: 'memberid', headerName: '会员号'},
                        {field: 'telephone', headerName: '电话'},
                        {field: 'department', headerName: '部门'},
                        {field: 'address', headerName: '地址'},
                        {field: 'serviceope', headerName: '维修员'},
                        {field: 'booking_operator', enableRowGroup: true, headerName: '预约人'},
                        {field: 'operator', enableRowGroup: true, headerName: '派单人'},
                        {field: 'arrangetime', enableRowGroup: true, headerName: '派单时间'},
                        {field: 'remarks', enableRowGroup: true, headerName: '备注'},
                        // {field: 'feedback_remarks', headerName: '汇总备注'},


                        {field: 'cancel_remarks', enableRowGroup: true, headerName: '取消备注'},
                        {field: 'cancel_operator', enableRowGroup: true, headerName: '取消人'},

                        {field: 'feedback_remarks', enableRowGroup: true, headerName: '汇总备注'},
                        {field: 'complete_detailed', enableRowGroup: true, headerName: '完成选项'},

                        {field: 'evaluate', headerName: '评价', hide: true},
                        {field: 'feedback_project', headerName: '汇总选项', hide: true},
                        {
                            field: 'partslist',
                            headerName: '配件',
                            hide: true,
                            valueGetter: data => data?.data?.partslist?.map(e => `${e.name} X ${e.num} 合计 ${e.price}`).join(',')
                        },
                        {field: 'charge', headerName: '收费', hide: true},
                        {field: 'subsidy', headerName: '公司补贴', hide: true},
                        {field: 'state', enableRowGroup: true, headerName: '状态'},
                        {
                            field: 'id',
                            headerName: '操作',
                            pinned: 'left',
                            width: 200,
                            cellRendererFramework: (data) => <div>

                                <Button size={'small'} onClick={async () => {

                                    setRowdata(data.data)
                                    setbzopen(true)

                                }}>修改</Button>


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
                                    ['已安排', '已接单', '已汇总', '已完成'].indexOf(data.data.state) !== -1 &&
                                    <Popconfirm style={{width: 300}} title="提示" content="确认操作?"
                                                onConfirm={async () => {
                                                    const rew = await request('post', '/api/getInfo', {
                                                        url: 'Srapp.Web_OtherServices_Handle.ResetUserOtherServicesOrder',
                                                        ids: JSON.stringify([data.value]),
                                                        remarks: `操作员 ${loginuser.name} 重置`
                                                    })
                                                    if (rew.data.msg === 'SUCCESS') {
                                                        toast.success('操作成功')
                                                        api.current.submitForm()
                                                    } else {
                                                        toast.error(`操作失败 ${rew.data.tips}`)
                                                    }
                                                }}><Button size={'small'}>重置</Button>


                                    </Popconfirm>
                                }
                                {
                                    ['正常'].indexOf(data.data.state) !== -1  &&
                                    <Popconfirm style={{width: 300}} title="提示" content={
                                        <Box>
                                            <Form onChange={e => {
                                                remarksdata.current = e.values.remarks
                                            }}>
                                                <Form.Input rules={[{required: true}]} label="取消原因" field='remarks'/>
                                            </Form>

                                        </Box>

                                    }
                                                onConfirm={async () => {
                                                    console.log(remarksdata.current)
                                                    if (remarksdata.current == '' || remarksdata.current == undefined) {
                                                        toast.error('取消原因不能为空')
                                                        return
                                                    }

                                                    const rew = await request('post', '/api/getInfo', {
                                                        url: 'Srapp.Web_OtherServices_Handle.CancelUserOtherServicesOrder',
                                                        ids: JSON.stringify([data.value]),
                                                        remarks: `操作员 ${loginuser.name} 取消,原因 ${remarksdata.current}`
                                                    })
                                                    if (rew.data.msg === 'SUCCESS') {
                                                        toast.success('操作成功')
                                                        api.current.submitForm()
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
                    <Select filter onChange={e => {
                        setsServiceopeid(e)
                    }} prefix="维修员" style={{width: 200, marginRight: 10}}>
                        {
                            initData.OperatorList.filter(item => (item.department === '客服中心')).map(item =>
                                <Select.Option value={item.opeid}>{item.name}</Select.Option>)
                        }

                    </Select>
                    <Input value={keywork} style={{width: 200, marginRight: 10}} type="text"
                           placeholder='任意关键字搜索' id="filter-text-box" onChange={e => setKeywork(e)}/>

                    <CheckboxGroup options={[
                        {label: '打印机打印', value: '打印机打印'},
                        {label: '飞鹅打印', value: '飞鹅打印'},
                    ]} direction='horizontal' aria-label="CheckboxGroup 示例"/>
                </Box>
                <Box display={'flex'} mt={1}>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('安装')}
                            size="small">安装</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('安检')}
                            size="small">安检</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('维修')}
                            size="small">维修</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('预算')}
                            size="small">预算</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('验收')}
                            size="small">验收</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('正常')}
                            size="small">正常</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('已安排')}
                            size="small">已安排</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('已接单')}
                            size="small">已接单</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('客服中心')}
                            size="small">客服中心</Button>
                    <Button sx={{mr: 1}} variant={'outlined'} onClick={() => setKeywork('正常')}
                            size="small">未安排</Button>

                </Box>
                <Button onClick={async () => {


                    Modal.confirm({
                        title: '确认提交', content: '确认提交安排吗?', onOk: async () => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                ids: JSON.stringify(rowlist.map(item => item.id)),
                                serviceopeid,
                                feieprint: '是'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('安排成功')
                                api.current.submitForm()
                            } else {
                                toast.error(`安排失败 ${rew.data.tips}`)
                            }


                        }
                    });


                }} variant={'outlined'} size="small" sx={{mt: 1}}>确认安排</Button>
            </Box>

            <Modal title="门店业务操作" size={rowdata.state === '正常' ? 'small' : 'large'} visible={open}
                   onCancel={() => setopen(false)} footer={<></>}>
                {
                    rowdata.state === '正常' ? <Box style={{top: 200}}>
                        <Form onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                ...e,
                                ids: JSON.stringify([rowdata.id]),
                                feieprint: '是'
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('安排成功')
                                api.current.submitForm()
                            } else {
                                toast.error(`安排失败 ${rew.data.tips}`)
                            }
                            setopen(false)
                        }}>
                            <Form.Select field={'serviceopeid'} label="选择服务人员" style={{width: '100%'}}>
                                {
                                    initData.OperatorList.filter(item => (item.department === '客服中心')).map(item =>
                                        <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                }

                            </Form.Select>

                            <Button type={"submit"} variant={"contained"} size={"small"} sx={{mt: 1}}>确认安排</Button>
                        </Form>

                    </Box> : ''
                }
                {
                    rowdata.state === '已完成' ? <Form onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_OtherServices_Handle.FeedbackUserOtherServicesOrder',
                            ...e,
                            id: rowdata.id,
                            partslist: JSON.stringify(reqairList),
                            feedbackproject: JSON.stringify(e.feedbackproject),
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('汇总成功')
                            api.current.submitForm()
                        } else {
                            toast.error(`汇总失败 ${rew.data.tips}`)
                        }
                        setopen(false)
                    }}><Box display={'flex'}>

                        <Box flex={1}>
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

                                    }} style={{cursor: 'pointer', color: 'blue'}}>查看安检图片</span></Box>
                                ) : ''
                            }


                            <Form.Input field={'num'} label={'数量'} initValue={1}/>
                            <Form.Input field={'remarks'} label={'备注'}/>


                            <Form.Select field={'state'} label="选择状态" style={{width: '100%'}}>
                                <Form.Select.Option value={'已完工'}>已完工</Form.Select.Option>
                                <Form.Select.Option value={'未完工'}>未完工</Form.Select.Option>
                            </Form.Select>

                            <Form.Input field={'subsidy'} label={'公司补贴'}/>
                            <Button type={"submit"} variant={"contained"} size={"small"} sx={{mt: 1}}>确认汇总</Button>

                        </Box>


                    </Box>
                    </Form> : ''
                }

            </Modal>

            <Modal title="安检图片" visible={imgOpen} onCancel={() => {
                setImgOpen(false)
                setImgurl([])
            }} footer={<></>} style={{top: 200}}>
                <Box>
                    {
                        imgurlList.map(item =>
                            <Box>
                                <h2>{item.imgtype}</h2>
                                <Image src={item.imgurl} width={400} height={400}/>
                            </Box>
                        )
                    }

                </Box>
            </Modal>

        </Box>
    );
};

export default OtherServicesOrderListYYZX;
