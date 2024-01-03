import React, { useState, useEffect, useRef } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import { Button, Typography } from "@mui/material";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { connect } from 'react-redux';
// import { history } from 'react-router';
// import { useEffect } from 'react';
// import { withRouter } from 'react-router-dom/withRouter';
import { useNavigate, useLocation } from 'react-router-dom'
import { MEMBERID } from 'store/actions';
import moment from 'moment';
import { set } from 'react-hook-form';
import transulations from '../../../utils/translations.json';
import { toast } from 'react-toastify';


const VagueQueryUserInfo = (props) => {

    // console.log('history', props)
    const navigate = useNavigate()
    // const { value, setValue, popupState, sendAction } = props
    // const history = use
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tel = searchParams.get('tel');
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [list, setList] = useState([])
    const [userinfo, setUserInfo] = useState('')
    const [orderlist, setOrderList] = useState([])
    const [calllist, setCallList] = useState([])
    const api = useRef(null)
    const formapi = useRef(null)
    useEffect(() => {
        // console.log('navigate', navigate)
        if (tel) {
            // console.log('tel', tel)
            api.current.setValues({ keytype: '电话', keyword: tel })
            api.current.submitForm()
        }
    }, [tel]);


    useEffect(() => {
        if (!show) {
            setUserInfo('')
            setOrderList([])
            setCallList([])
        }

    }, [show])

    useEffect(() => {
        if (!show2) {
            setUserInfo('')
            setOrderList([])
            setCallList([])
        }

    }, [show2])
    const api2 = useRef(null)
    return (
        <Box p={3} bgcolor="#fff">
            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.VagueQueryUserInfo',
                    ...e,
                    // row: 1
                })
                // setUserInfo({
                //     telephone: e.keyword,
                // })
                setList(rew.data)
                console.log(e)
            }} labelPosition="inset" layout='horizontal'>
                <Form.Select field='keytype' initValue={'电话'} label="查询范围" style={{ width: 300 }}>
                    <Form.Select.Option value="会员号">会员号</Form.Select.Option>
                    <Form.Select.Option value="姓名">姓名</Form.Select.Option>
                    <Form.Select.Option value="电话">电话</Form.Select.Option>
                    <Form.Select.Option value="地址">地址</Form.Select.Option>
                    <Form.Select.Option value="单位">单位</Form.Select.Option>
                </Form.Select>
                <Form.Input field="keyword" label="关键字" style={{ width: 300 }} />
                <Button type="submit" variant="outlined" size="small">搜索</Button>
                <Button variant="outlined" size="small" sx={{ marginLeft: 1 }} onClick={() => {
                    setShow(true)
                    setUserInfo({
                        telephone: api.current.getValue('keyword'),
                        name: '无'
                    })
                }}>新增来电记录</Button>
            </Form>

            <Box mt={3} height="60vh" overflow="scroll">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '电话', field: 'telephone' },
                        { headerName: '地址', field: 'address' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '楼层', field: 'floor' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', pinned: "right", cellRendererFramework: (params) => <Box>

                                <Button variant="text" size="small" onClick={() => {
                                    setShow(true)
                                    setTimeout(() => {
                                        formapi.current.setValue('memberid', params.data.memberid)
                                        formapi.current.submitForm()
                                    }, 300)
                                }}>新增来电记录</Button>
                                <Button variant="text" size="small" onClick={() => {
                                    props.dispatch({
                                        type: 'memberid',
                                        memberid: params.data.memberid
                                    })
                                    setTimeout(() => {
                                        navigate('/users/UserBasicInfo?tab=1')
                                        // localStorage 存5秒电话时间
                                        // localStorage.setItem('ldtel', params.data.telephone)
                                        // localStorage.setItem('ldteltime', new Date().getTime())


                                    }, 500)

                                }}>去下单</Button>
                            </Box>
                        },
                    ]}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true
                    }}

                />
            </Box>

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


                            // 查询历史通话记录

                            const rew3 = await request('post', '/api/getInfo', {
                                "url": "Srapp.Web_OtherServices_Infos.UserCallRegistrationList",
                                // 半年时间
                                "begintime": moment.utc().subtract(6, 'months').format('YYYY-MM-DD'),
                                "endtime": moment().format('YYYY-MM-DD'),
                                "state": "[\"撤销\",\"正常\",\"已完成\"]",
                                "userid": rew.data.userid,
                            })

                            setCallList(rew3.data)

                        }} layout={"horizontal"} labelPosition={"inset"}>
                            <Form.Input field={'memberid'} label={'会员号'} />
                            <Button type="submit" size={'small'} variant={"contained"}>搜索</Button>
                            <Button sx={{ ml: 2 }} onClick={() => {
                                setShow(false)
                                setShow2(true)
                            }} size={'small'} variant={"contained"}>无卡号录入</Button>
                        </Form>
                        <Box height={'30vh'} overflow={'scroll'} mt={1}>
                            <AgGridReact
                                className='ag-theme-balham'
                                rowData={orderlist}
                                localeText={transulations}
                                columnDefs={[
                                    {
                                        headerName: '历史订单信息', children: [
                                            { headerName: '订单号', field: 'serial_main', hide: true },
                                            { headerName: '下单时间', field: 'addtime' },
                                            { headerName: '姓名', field: 'name' },
                                            { headerName: '电话', field: 'telephone' },
                                            { headerName: '配送门店', field: 'department', valueGetter:({data}) => data?.suborder[0].department},
                                            { headerName: '地址', field: 'address' },
                                            {
                                                headerName: '商品', valueGetter: ({ data }) => data.suborder.map(item => {
                                                    return item.goodsname + 'X' + item.num
                                                }).join(',')
                                            },
                                            { headerName: '状态', field: 'state' },
                                        ]
                                    },

                                ]}
                                onCellClicked={e=>{
                                    console.log(e)
                                    api2.current.setValue('telephone',e.data.telephone)
                                    api2.current.setValue('distributionstore',e.data?.suborder[0].department)
                                    api2.current.setValue('address',e.data.address)


                                }}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true,
                                    sortable: true
                                }}
                            />
                        </Box>
                        <Box height={'30vh'} overflow={'scroll'} mt={1}>
                            <AgGridReact
                                className='ag-theme-balham'
                                rowData={calllist}
                                localeText={transulations}
                                columnDefs={[
                                    {
                                        headerName: '历史反馈信息', children: [

                                            { headerName: '反馈时间', field: 'addtime' },
                                            { headerName: '反馈类型', field: 'calltype' },
                                            { headerName: '反馈备注', field: 'callremarks' },
                                            { headerName: '电话', field: 'telephone' },
                                            { headerName: '地址', field: 'address' },
                                            { headerName: '接线员', field: 'operator' },
                                            { headerName: '状态', field: 'state' },
                                        ]
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
                            userinfo.memberid ? <Form getFormApi={e=>api2.current = e} style={{ marginTop: 10 }} layout="horizontal" onSubmit={async e => {
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
                                <Form.Select filter style={{width:150}} field={'distributionstore'} label={'门店'} initValue={userinfo.department} >
                                    {
                                        initData.DepartmentList.map((item, index) => {
                                            return (
                                                <Form.Select.Option value={item.name} key={index}>
                                                    {item.label}
                                                </Form.Select.Option>
                                            );
                                        })
                                    }
                                </Form.Select>
                                <Form.Input field={'address'} label={'地址'} initValue={userinfo.address} />
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


            <Modal title="新增通话记录(无卡号)" size={'large'} visible={show2} onCancel={() => setShow2(false)} footer={<></>}>
                <Box display={'flex'}>

                    <Box flex={1}>

                        <Form getFormApi={e => formapi.current = e} onSubmit={async e => {


                            // 查询历史通话记录

                            const rew3 = await request('post', '/api/getInfo', {
                                "url": "Srapp.Web_OtherServices_Infos.UserCallRegistrationList",
                                "begintime": "1999-05-26",
                                "endtime": "2023-05-26",
                                "state": "[\"撤销\",\"正常\",\"已完成\"]",
                                "telephone": e.telephone,
                            })

                            setCallList(rew3.data)

                        }} layout={"horizontal"} labelPosition={"inset"}>
                            <Form.Input field={'telephone'} label={'手机号'} />
                            <Button type="submit" size={'small'} variant={"contained"}>搜索</Button>

                        </Form>
                        {/* <Box height={'30vh'} overflow={'scroll'} mt={1}>
                            <AgGridReact
                                className='ag-theme-balham'
                                rowData={orderlist}
                                localeText={transulations}
                                columnDefs={[
                                    {
                                        headerName: '历史订单信息', children: [
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
                                            { headerName: '状态', field: 'state' },
                                        ]
                                    },

                                ]}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true,
                                    sortable: true
                                }}
                            />
                        </Box> */}
                        <Box height={'30vh'} overflow={'scroll'} mt={1}>
                            <AgGridReact
                                className='ag-theme-balham'
                                rowData={calllist}
                                localeText={transulations}
                                columnDefs={[
                                    {
                                        headerName: '历史反馈信息', children: [

                                            { headerName: '反馈时间', field: 'addtime' },
                                            { headerName: '反馈类型', field: 'calltype' },
                                            { headerName: '反馈备注', field: 'callremarks' },
                                            { headerName: '电话', field: 'telephone' },
                                            { headerName: '接线员', field: 'operator' },
                                            { headerName: '地址', field: 'address' },
                                            { headerName: '状态', field: 'state' },
                                        ]
                                    },

                                ]}
                                defaultColDef={{
                                    // flex: 1,
                                    resizable: true,
                                    sortable: true
                                }}
                            />
                        </Box>

                        <Form style={{ marginTop: 10 }} layout="horizontal" onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.CreateUserCallRegistration',
                                ...e,
                                userid: 0
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('录入成功')
                            } else {
                                toast.error('录入失败')
                            }
                            setShow2(false)
                        }}>

                            <Form.Input field={'memberid'} label={'会员号'} initValue={userinfo.memberid} />
                            <Form.Input field={'name'} label={'姓名'} initValue={userinfo.name} rules={[{ required: true }]} />
                            <Form.Select filter style={{width:150}} field={'distributionstore'} label={'门店'} initValue={userinfo.department} >
                                {
                                    initData.DepartmentList.map((item, index) => {
                                        return (
                                            <Form.Select.Option value={item.name} key={index}>
                                                {item.label}
                                            </Form.Select.Option>
                                        );
                                    })
                                }
                            </Form.Select>
                            <Form.Input field={'address'} label={'地址'} initValue={userinfo.address} />
                            <Form.Input field={'customertype'} label={'用户类型'} initValue={userinfo.customertype} />
                            <Form.Input field={'attributiondepartment'} label={'归属部门'} initValue={userinfo.attributiondepartment} />
                            <Form.Input field={'salesman'} label={'维护业务员'} initValue={userinfo.salesman} />
                            <Form.Input field={'telephone'} label={'通话电话号码'} initValue={userinfo.telephone} rules={[{ required: true }]} />
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

                        </Form>


                    </Box>
                </Box>

            </Modal>
        </Box>
    );
};

// export default VagueQueryUserInfo;
// const mapStateToProps = (state) => state
// const mapDispatchToProps = (dispatch) => {
//     console.log('BindUser', dispatch)
//     return {
//         BindUser: (data) => dispatch({
//             type: 'binduser',
//             user: data
//         })
//     }
// }

export default connect(null)((VagueQueryUserInfo));