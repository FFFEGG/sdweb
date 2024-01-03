import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { toast } from "react-toastify";
import tanslations from '../../utils/translations.json'

const GetOtherAvailableSubsidyRecord = () => {
    const [list, setList] = useState([])
    const api = useRef()
    const [btdata, setdata] = useState('')
    const [show, setshow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取其它可申请补贴记录</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetOtherAvailableSubsidyRecord',
                    ...e,
                    department: JSON.stringify([loginuser.login_department])
                })
                setList(rew.data)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'}
                    initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'}
                    initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field={'type'} label={'补贴类型'} style={{ width: '100%' }}>

                    <Form.Select.Option value="装卸钢瓶补贴">装卸钢瓶补贴</Form.Select.Option>
                    <Form.Select.Option value="自助放空补贴">自助放空补贴</Form.Select.Option>
                    <Form.Select.Option value="安全放空补贴">安全放空补贴</Form.Select.Option>
                    <Form.Select.Option value="看瓶不合格补贴">看瓶不合格补贴</Form.Select.Option>
                </Form.Select>

                <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}

                    columnDefs={[
                        { headerName: '类型', field: 'type' },
                        { headerName: '时间', field: 'businesstime' },
                        { headerName: '订单号', field: 'businessserial' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '涉及工作人员', field: 'workman' },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '单价', field: 'price' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '地址', field: 'completeaddress' },
                        {
                            headerName: '操作',
                            pinned: 'left',
                            cellRendererFramework: ({ data }) => <Button onClick={async e => {
                                // const rew = await request('post','/api/getInfo',{
                                //     url: 'Srapp.Web_Other_Handle.AddOtherSubsidy',
                                //     ...data
                                // })
                                // if (rew.code === 200) {
                                //     toast.success('申请成功')
                                // } else {
                                //     toast.error('申请失败')
                                // }
                                // api.current.submitForm();

                                setshow(true)
                                setdata(data)
                            }
                            } size={"small"}>申请补贴</Button>
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
            <Modal visible={show} onCancel={() => setshow(false)} footer={<></>} style={{ top: '10%' }}>
                <Form initValues={btdata} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Other_Handle.AddOtherSubsidy',
                        num: e.num * 1,
                        type: e.type,
                        businessserial: e.businessserial,
                        workman: e.workman,
                        remarks: e.remarks == '' ? loginuser.name + '办理' : e.remarks,
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('申请成功')
                    } else {
                        toast.error(`申请失败 ${rew.data.tips}`)
                    }
                    setshow(false)
                    api.current.submitForm();
                }}>
                    <Form.Input field={'type'} label={'补贴类型'} rules={[{ required: true }]} />
                    <Form.Input field={'businessserial'} label={'业务单据号'} rules={[{ required: true }]} />

                    <Form.Select field={'workman'} filter style={{ width: 300 }} label={'涉及人员'}
                        rules={[{ required: true }]}>
                        {
                            initData.OperatorList.sort(item => {
                                // 本门店的人员排序在前
                                if (item.departmentid === loginuser.login_departmentid) {
                                    return -1
                                }
                                return 1

                            }).map(item => <Form.Select.Option
                                value={item.name}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>

                    <Form.Input field={'num'} label={'数量'} rules={[{ required: true }]} />
                    <Form.Input field={'remarks'} label={'备注'} />
                    <Button variant={"contained"} type={"submit"}>确认</Button>
                </Form>
            </Modal>


        </Box>
    );
};

export default GetOtherAvailableSubsidyRecord;
