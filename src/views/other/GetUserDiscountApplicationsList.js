import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const GetUserDiscountApplicationsList = () => {

    const [list, setlist] = useState([])
    return (
        <Box bgcolor={'#FFF'} p={3}>
            <Box fontSize={18} mb={3}>
                获取用户各项优惠记录列表
            </Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async (e) => {
                const rew = await request('post', '/api/getInfo', {
                    ...e,
                    url: 'Srapp.Web_Other_Infos.GetUserDiscountApplicationsList',
                    state: JSON.stringify(e.state)
                })
                setlist(rew.data)

            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'memberid'} label={'会员号'} placeholder={'会员号'} />
                <Form.Select label={'状态'} field={'state'} multiple initValue={['正常']}>
                    <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                    <Form.Select.Option value={'已授权'}>已授权</Form.Select.Option>
                    <Form.Select.Option value={'撤销'}>撤销</Form.Select.Option>
                </Form.Select>
                <Button type={"submit"} size={'small'} variant={"contained"}>搜索</Button>
            </Form>


            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    localeText={tanslations}
                    rowData={list}
                    columnDefs={[
                        { headerName: '类型', field: 'type' },
                        { headerName: '申请时间', field: 'info.addtime' },
                        { headerName: '会员号', field: 'info.memberid' },
                        { headerName: '姓名', field: 'info.name' },
                        { headerName: '地址', field: 'info.address' },
                        {
                            headerName: '商品', field: 'info.goodsname', valueGetter: ({ data }) => {
                                if (data.type === '包装物费用优惠') {
                                    return data.info.billingmode
                                }

                                if (data.type === '商品单价优惠') {
                                    return data.info.goodsname
                                }

                                if (data.type === '包装物办理优惠') {
                                    return data.info.packingtypemodename
                                }

                            }
                        },
                        { headerName: '支付方式', field: 'info.payment' },
                        {
                            headerName: '优惠方式', field: 'info.salestype', valueGetter: ({ data }) => {
                                if (data.type === '包装物费用优惠') {
                                    return '折扣'
                                }

                                if (data.type === '商品单价优惠') {
                                    return data.info.salestype
                                }

                                if (data.type === '包装物办理优惠') {
                                    return data.info.salestype
                                }

                            }
                        },
                        { headerName: '市场价', field: 'info.marketprice' },
                        {
                            headerName: '申请价格', field: 'info.price', valueGetter: ({ data }) => {
                                if (data.type === '包装物费用优惠') {
                                    return data.info.discount
                                }

                                if (data.type === '商品单价优惠') {
                                    return data.info.price
                                }

                                if (data.type === '包装物办理优惠') {
                                    return data.info.price
                                }

                                if (data.type === '信用额度调整') {
                                    return `原额度${data.info.primaryquota} 申请额度 ${data.info.quota}`
                                }

                            }
                        },
                        { headerName: '申请人', field: 'info.applicant_ope' },
                        { headerName: '申请部门', field: 'info.applican_department' },

                        { headerName: '授权人', field: 'info.authorized_ope' },
                        { headerName: '授权部门', field: 'info.authorized_department' },
                        { headerName: '授权时间', field: 'info.authorized_time' },
                        { headerName: '状态', field: 'info.state' },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) =>

                                data.info.state === '正常' ?
                                    <Box>
                                        <Button onClick={async e => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_BusinessProcessing_Handle.HandleUserDiscountApplications',
                                                id: data.info.id,
                                                userid: data.info.userid,
                                                action: '授权',
                                                type: data.type
                                            })
                                            if (rew.code === 200) {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error('操作失败')
                                            }
                                        }} size={"small"}>授权</Button>
                                        <Button onClick={async e => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_BusinessProcessing_Handle.HandleUserDiscountApplications',
                                                id: data.info.id,
                                                userid: data.info.userid,
                                                action: '撤销',
                                                type: data.type
                                            })
                                            if (rew.code === 200) {
                                                toast.success('操作成功')
                                            } else {
                                                toast.error('操作失败')
                                            }
                                        }} size={"small"}>撤销</Button>
                                    </Box> : ''

                        },
                    ]}

                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        flex: 1
                    }}
                />
            </Box>

        </Box>
    );
};

export default GetUserDiscountApplicationsList;
