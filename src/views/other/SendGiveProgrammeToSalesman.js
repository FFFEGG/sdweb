import React, { useEffect, useState } from 'react';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { Form, Button as Btn, Popconfirm, Modal, Descriptions } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { toast } from "react-toastify";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";

const SendGiveProgrammeToSalesman = () => {
    const [list, setlist] = useState([])
    const [index, setindex] = useState(1)
    const [indexdata, setdata] = useState('')
    const [userinfo, setuserinfo] = useState('')
    const [open, setopen] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const getlist = async (data) => {

        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Other_Infos.GetGiveProgrammeHeldBySalesmanRecord',
            ...data,
            opeid: JSON.stringify(data.opeid)
        })
        setlist(rew.data)
    }

    const [opelist, setopelist] = useState([])


    useEffect(() => {
        //查找下级部门
        const son_department_ids = initData.DepartmentList.filter(item => item.fid === loginuser.login_departmentid).map(item => item.id)
        //查找下级部门员工
        const son_department_opeids = initData.OperatorList.filter(item => son_department_ids.includes(item.departmentid))
        setopelist(son_department_opeids)

    }, [])

    return (
        <Box p={3} bgcolor="#fff" borderRadius={3}>
            <Box display="flex">
                <Button onClick={() => {
                    setindex(1)
                    setlist([])
                }} variant={index === 1 ? 'contained' : 'outlined'}>查询</Button>
                <Button onClick={() => {
                    setindex(2)
                    setlist([])
                }} variant={index === 2 ? 'contained' : 'outlined'} style={{ marginLeft: 10 }}>录入</Button>

            </Box>

            <Box mt={3}>
                {
                    index === 1 ? (
                        <Box>
                            <Modal visible={open} onCancel={() => {
                                setopen(false)
                                setuserinfo('')
                                setdata('')
                            }} onOk={async () => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Other_Handle.SalesmanSendGiveProgrammeToUser',
                                    id: indexdata.id,
                                    userid: userinfo.userid
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('赠送成功')
                                } else {
                                    toast.error('赠送失败')
                                }
                                setopen(false)
                                setuserinfo('')
                                setdata('')
                            }} style={{ top: '10%' }} title="方案赠送->用户">
                                <Box>
                                    <Form>
                                        <Form.Input onKeyDown={async e => {
                                            if (e.key === 'Enter') {
                                                const rew = await request('post', '/api/getInfo', {
                                                    url: 'Srapp.Web_User_Infos.UserBasicInfo',
                                                    memberid: e.target.value
                                                })

                                                setuserinfo(rew.data)
                                            }
                                        }} label="用户卡号搜索" placeholder="回车搜索" />

                                    </Form>

                                    <Descriptions align="center" data={[
                                        { key: '会员号', value: userinfo.memberid },
                                        { key: '姓名', value: userinfo.name },
                                        { key: '电话', value: userinfo.telephone },
                                        { key: '地址', value: userinfo.address },
                                    ]} />
                                </Box>
                            </Modal>
                            <Form onSubmit={async e => getlist(e)} layout='horizontal' labelPosition='left'
                                labelAlign='right' onValueChange={values => console.log(values)}>
                                <Form.Select maxTagCount={1} field="opeid" filter multiple label="员工" showClear
                                    style={{ width: 200 }}>
                                    {
                                        initData.OperatorList.filter(item => item.department === loginuser.login_department).map(item =>
                                            <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                    }
                                    {
                                        opelist.map(item =>
                                            <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                    }

                                </Form.Select>
                                <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='begintime'
                                    label="开始时间" />
                                <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='endtime'
                                    label="结束时间" />
                                <Btn type="primary" htmlType="submit"
                                    className="btn-margin-right">搜索</Btn>
                            </Form>

                            <Box mt={3} height="60vh" overflow="scroll">
                                <AgGridReact
                                    className="ag-theme-balham"
                                    rowData={list}
                                    localeText={tanslations}
                                    columnDefs={[
                                        { headerName: '申请时间', field: 'addtime' },
                                        { headerName: '方案名称', field: 'giveprogramme.name' },
                                        {
                                            headerName: '方案明细', valueGetter: ({ data }) => {

                                                return data?.giveprogramme?.detailed?.coupon?.map(item => `${item.goodsname}:单价${item.price}*数量${item.num}`).join(',')
                                            }
                                        },
                                        { headerName: '录入人', field: 'operator' },
                                        { headerName: '使用人', field: 'use_operator' },
                                        { headerName: '使用时间', field: 'use_time' },
                                        { headerName: '会员号', field: 'use_memberid' },
                                        { headerName: '状态', field: 'state' },
                                        {
                                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => (
                                                <Box>

                                                    <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {

                                                        if (data.state === '已使用') {

                                                            const rew = await request('post', '/api/getInfo', {
                                                                url: 'Srapp.Web_Other_Handle.SalesmanCancelGiveProgrammeOfUser',
                                                                id: data.id,
                                                                serial: data.use_serial
                                                            })

                                                            if (rew.data.msg === 'SUCCESS') {
                                                                toast.success('操作成功')
                                                            } else {
                                                                toast.error(`操作失败 ${rew.data.tips}`)
                                                            }
                                                        } else {

                                                            const rew = await request('post', '/api/getInfo', {
                                                                url: 'Srapp.Web_Other_Handle.CancelGiveProgrammeOfSalesman',
                                                                id: data.id
                                                            })
                                                            if (rew.data.msg === 'SUCCESS') {
                                                                toast.success('操作成功')
                                                            } else {
                                                                toast.error(`操作失败 ${rew.data.tips}`)
                                                            }
                                                        }



                                                    }}>
                                                        <Button>取消</Button>
                                                    </Popconfirm>
                                                    <Button onClick={() => {
                                                        setopen(true)
                                                        setdata(data)
                                                    }}>赠送</Button>
                                                </Box>
                                            )
                                        }
                                    ]}
                                    defaultColDef={{
                                        resizable: true,
                                        // flex: 1
                                    }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Form onSubmit={async e => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Other_Handle.SendGiveProgrammeToSalesman',
                                    ...e
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('录入成功')
                                } else {
                                    toast.success('录入失败')
                                }
                            }} layout='vertical' onValueChange={values => console.log(values)}>
                                <Form.Select field="giveprogrammeid" label='选择方案' style={{ width: 500 }}>
                                    {
                                        initData.GiveProgrammeList.filter(item => item.department == loginuser.login_department).map(item => <Form.Select.Option
                                            value={item.id}>{item.name}</Form.Select.Option>)
                                    }
                                </Form.Select>
                                <Form.Input field='num' label='数量' style={{ width: 500 }} />
                                <Form.Select filter field="opeid" label='员工' style={{ width: 500 }}>
                                    {
                                        initData.OperatorList.filter(item => item.department === loginuser.login_department).map(item =>
                                            <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                    }
                                    {
                                        opelist.map(item =>
                                            <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                    }


                                </Form.Select>
                                <Button variant="contained" type="primary" htmlType="submit"
                                    className="btn-margin-right">提交</Button>
                            </Form>

                        </Box>
                    )
                }
            </Box>
        </Box>
    );
};

export default SendGiveProgrammeToSalesman;
