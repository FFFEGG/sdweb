import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { toast } from "react-toastify";
import tanslations from '../../utils/translations.json'

const GetOtherSubsidyRecord = () => {
    const [list, setList] = useState([])
    const api = useRef()
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取已申请补贴记录</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetOtherSubsidyRecord',
                    ...e,
                    department: JSON.stringify([loginuser.login_department])
                })
                if (rew.data.length) {
                    rew.data.push({
                        begintime: '合计',
                        num: rew.data.reduce((a, b) => {
                            return a + b.num * 1
                        }, 0)

                    })
                }
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
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Other_Handle.CancelOtherSubsidy',
                                    ...data
                                })
                                if (rew.code === 200) {
                                    toast.success('取消成功')
                                } else {
                                    toast.error('取消失败')
                                }
                                api.current.submitForm();

                            }
                            } size={"small"}>取消申请</Button>
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

export default GetOtherSubsidyRecord;
