import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import transulations from '../../../utils/translations.json';

const UserCallRegistrationList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [show, setShow] = useState(false)
    const [showpudate, setShowupdate] = useState(false)
    const [list, setlist] = useState([])
    const [rowdata, setrowdata] = useState('')
    const [userinfo, setUserInfo] = useState('')
    const [orderlist, setOrderList] = useState([])

    const formapi = useRef(null)
    const remarks = useRef('')
    const api = useRef(null)
    useEffect(() => {
        setUserInfo('')
    }, [show])

    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography>通话记录</Typography>
            <Box>
                <Form getFormApi={e => api.current = e} layout={"horizontal"} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_OtherServices_Infos.UserCallRegistrationList',
                        ...e,
                        operator: JSON.stringify(e.operator),
                        state: JSON.stringify(e.state),
                    })

                    setlist(rew.data)
                }}>
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'memberid'} label={'会员号'} />
                    <Form.Input field={'telephone'} label={'电话号码'} />
                    <Form.Input field={'calltype'} label={'通话类型'} />
                    <Form.Select multiple maxTagCount={2} label={'接线员'} field={'operator'} style={{ width: 250 }}>
                        {
                            initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Select initValue={['撤销', '正常', '已完成']} multiple maxTagCount={2} label={'状态'} field={'state'} style={{ width: 250 }}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="已完成">已完成</Form.Select.Option>
                        <Form.Select.Option value="撤销">撤销</Form.Select.Option>
                    </Form.Select>

                    <Box display={"flex"} alignItems={"end"}>
                        <Button type={'submit'} variant={"contained"}>搜索</Button>

                        <Button sx={{ ml: 1 }} onClick={() => { setShow(true) }} variant={"contained"}>新增</Button>
                    </Box>
                </Form>

                <Box mt={3} height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list}
                        getRowStyle={params => {
                            if (params.data && params.data.state === '撤销') {
                                return { color: "pink" }
                            }

                            return { color: "black" }
                        }}
                        columnDefs={[

                            { field: 'addtime', headerName: '添加时间' },
                            { field: 'memberid', headerName: '会员号' },
                            { field: 'name', headerName: '姓名' },
                            { field: 'telephone', headerName: '电话号码' },
                            { field: 'address', headerName: '地址' },
                            { field: 'distributionstore', headerName: '门店' },
                            { field: 'customertype', headerName: '用户类型' },
                            { field: 'attributiondepartment', headerName: '归属部门' },
                            { field: 'salesman', headerName: '维护业务员', hide: true },
                            { field: 'calltype', headerName: '通话类型' },
                            { field: 'callremarks', headerName: '通话备注' },
                            { field: 'department', headerName: '记录部门' },
                            { field: 'operator', headerName: '记录人' },
                            { field: 'complete_time', headerName: '完成时间' },
                            { field: 'complete_department', headerName: '完成部门' },
                            { field: 'complete_ope', headerName: '完成人' },
                            { field: 'complete_remarks', headerName: '完成备注' },
                            { field: 'cancel_time', headerName: '撤销时间' },
                            { field: 'cancel_department', headerName: '撤销部门' },
                            { field: 'cancel_ope', headerName: '撤销人' },
                            { field: 'cancel_remarks', headerName: '撤销备注' },
                            { field: 'state', headerName: '记录状态' },
                            {
                                headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) =>
                                    data.state === '正常' && <Box>
                                        <Button onClick={async () => {
                                            Modal.confirm({
                                                title: '提示',
                                                content: <Form onChange={e => {
                                                    remarks.current = e.values.remarks
                                                }}>
                                                    <Form.Input field={'remarks'} label={'取消原因'} />
                                                </Form>,
                                                onOk: async () => {
                                                    const rew = await request('post', '/api/getInfo', {
                                                        url: 'Srapp.Web_OtherServices_Handle.CancelUserCallRegistration',
                                                        remarks: remarks.current,
                                                        id: data.id
                                                    })
                                                    if (rew.data.msg === 'SUCCESS') {
                                                        toast.success('取消成功')
                                                    } else {
                                                        toast.error('取消失败')
                                                    }
                                                    api.current.submitForm()
                                                }
                                            })



                                        }} size={'small'} variant={"text"}>取消</Button>



                                        <Button onClick={()=>{
                                            setShowupdate(true)
                                            setrowdata(data)
                                        }}>修改</Button>
                                    </Box>
                            },


                        ]}
                    />
                </Box>
            </Box>
            <Modal title="修改通话记录" size={'large'} visible={showpudate} onCancel={() => setShowupdate(false)} footer={<></>}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_OtherServices_Handle.UpdateUserCallRegistration',
                        ...e,
                        id: rowdata.id
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('修改成功')
                    } else {
                        toast.error('修改失败' + rew.data.tips)
                    }
                    setShowupdate(false)
                    api.current.submitForm()
                }}>
                    <Form.Select style={{width: '100%'}} field={'calltype'} label={'通话类型'} initValue={rowdata.calltype} >
                        {
                            [
                                "投诉",
                                "表扬",
                                "业务咨询",
                                "催气",
                                "催水",
                                "催办业务",
                                "费用问题",
                                "服务问题",
                                "门店问题",
                                "用户建议",
                                "微信推广",
                                "开户咨询",
                                "开户途径",
                                "回访",
                                "其他"
                            ]
                                .map((item, index) => {
                                        return (
                                            <Form.Select.Option value={item} key={index}>
                                                {item}
                                            </Form.Select.Option>
                                        );
                                    }
                                )}
                    </Form.Select>
                    <Form.Input field={'remarks'} label={'通话备注'} initValue={rowdata.callremarks} />
                    <Button type={'submit'} variant={'contained'}>确认修改</Button>

                </Form>
            </Modal>


            <Modal title="新增通话记录" size={'large'} visible={show} onCancel={() => setShow(false)} footer={<></>}>
                <Box display={'flex'}>

                    <Box flex={1}>

                        <Form getFormApi={e => formapi.current = e} onSubmit={async e => {
                            setUserInfo('')
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_User_Infos.UserBasicInfo',
                                ...e
                            })
                            setUserInfo(rew.data)

                            // 查找最近订单信息
                            const rew2 = await request('post', '/api/getInfo', {
                                "userid": rew.data.userid,
                                "url": "Srapp.Web_User_Infos.UserOrderInfo",
                                "distributionstore": "全部",
                                "department": "全部",
                                "state": "[\"正常\",\"已安排\",\"已接单\",\"已送达\",\"已收瓶\",\"取消\"]",
                                "begintime": moment().subtract(1, 'months').format('YYYY-MM-DD'),
                                "endtime": moment().format('YYYY-MM-DD'),
                            })

                            setOrderList(rew2.data)


                        }} layout={"horizontal"} labelPosition={"inset"}>
                            <Form.Input field={'memberid'} label={'会员号'} />
                            <Button type="submit" size={'small'} variant={"contained"}>搜索</Button>
                        </Form>
                        <Box height={'30vh'} overflow={'scroll'} mt={1}>
                            <AgGridReact
                                className='ag-theme-balham'
                                rowData={orderlist}
                                localeText={transulations}
                                columnDefs={[

                                    { headerName: '订单号', field: 'serial_main', hide: true },
                                    { headerName: '下单时间', field: 'addtime' },
                                    { headerName: '姓名', field: 'name' },
                                    { headerName: '电话', field: 'telephone' },
                                    { headerName: '地址', field: 'address' },
                                    {
                                        headerName: '商品', valueGetter: ({ data }) => data.suborder.map(item => {
                                            return item.goodsname + 'X' + item.num
                                        }).join(',')
                                    },

                                ]}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true,
                                    sortable: true
                                }}
                            />
                        </Box>

                        {
                            userinfo.memberid ? <Form style={{ marginTop: 10 }} layout="horizontal" onSubmit={async e => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_OtherServices_Handle.CreateUserCallRegistration',
                                    ...e,
                                    userid: userinfo.userid
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('录入成功')
                                } else {
                                    toast.error('录入失败')
                                }
                                setShow(false)
                            }}>

                                <Form.Input field={'memberid'} label={'会员号'} initValue={userinfo.memberid} />
                                <Form.Input field={'name'} label={'姓名'} initValue={userinfo.name} />
                                <Form.Input field={'workplace'} label={'工作单位'} initValue={userinfo.workplace} />
                                <Form.Input field={'address'} label={'工作单位'} initValue={userinfo.address} />
                                <Form.Input field={'customertype'} label={'用户类型'} initValue={userinfo.customertype} />
                                <Form.Input field={'attributiondepartment'} label={'归属部门'} initValue={userinfo.attributiondepartment} />
                                <Form.Input field={'salesman'} label={'维护业务员'} initValue={userinfo.salesman} />
                                <Form.Input field={'telephone'} label={'通话电话号码'} initValue={userinfo.telephone} rules={[{ required: true }]} />
                                {/* <Form.Input field={'calltype'} label={'通话类型'} rules={[{ required: true }]} /> */}

                                <Form.Select field="calltype" label="通话类型" rules={[{ required: true }]} style={{ width: 190 }} >
                                    {
                                        [
                                            "投诉",
                                            "表扬",
                                            "业务咨询",
                                            "催气",
                                            "催水",
                                            "催办业务",
                                            "费用问题",
                                            "服务问题",
                                            "门店问题",
                                            "用户建议",
                                            "微信推广",
                                            "开户咨询",
                                            "开户途径",
                                            "回访",
                                            "其他"
                                        ]
                                            .map((item, index) => {
                                                return (
                                                    <Form.Select.Option value={item} key={index}>
                                                        {item}
                                                    </Form.Select.Option>
                                                );
                                            }
                                            )}
                                </Form.Select>


                                <Form.Input field={'remarks'} label={'备注'} rules={[{ required: true }]} />
                                <Form.Select field={'state'} label={'记录状态'} initValue={'正常'}  >
                                    <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                                    <Form.Select.Option value={'已完成'}>已完成</Form.Select.Option>
                                </Form.Select>
                                <Box display={'flex'} alignItems={'end'}>
                                    <Button variant={"contained"} size="small" type={'submit'} >确认录入</Button>
                                </Box>

                            </Form> : ''
                        }

                    </Box>
                </Box>

            </Modal>
        </Box>
    );
};

export default UserCallRegistrationList;
