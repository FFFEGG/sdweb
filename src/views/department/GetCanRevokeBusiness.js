import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Popconfirm } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const GetCanRevokeBusiness = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [keys, setkey] = useState([])
    const [titles, settitle] = useState([])
    const api = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取部门可取消业务</Typography>
            <Form getFormApi={fromapi => { api.current = fromapi }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Revoke_Infos.GetCanRevokeBusiness',
                    ...e,
                    department: JSON.stringify(e.department),

                })
                setList(rew.data.data)
                setkey(rew.data.key)
                settitle(rew.data.title)
            }} layout='horizontal' labelPosition="inset">

                <Form.Select field='type' rules={
                    [
                        { required: true, message: '请选择业务类型' },
                    ]
                } label="业务类型" style={{ width: 300 }}>
                    <Form.Select.Option value="办理包装物库存(票)业务">办理包装物库存(票)业务</Form.Select.Option>
                    <Form.Select.Option value="办理包装物库存(带入物)业务">办理包装物库存(带入物)业务</Form.Select.Option>
                    <Form.Select.Option value="办理带入包装物物资">办理带入包装物物资</Form.Select.Option>
                    <Form.Select.Option value="办理包装物退物资">办理包装物退物资</Form.Select.Option>
                    <Form.Select.Option value="办理包装物退款">办理包装物退款</Form.Select.Option>
                    <Form.Select.Option value="办理收购包装物(钢瓶)">办理收购包装物(钢瓶)</Form.Select.Option>
                    <Form.Select.Option value="办理收购包装物(水桶)">办理收购包装物(水桶)</Form.Select.Option>
                    <Form.Select.Option value="办理商品捆绑销售方案">办理商品捆绑销售方案</Form.Select.Option>
                    <Form.Select.Option value="办理专项款">办理专项款</Form.Select.Option>
                    <Form.Select.Option value="商品订单核销凭证">商品订单核销凭证</Form.Select.Option>
                    <Form.Select.Option value="办理暂存包装物">办理暂存包装物</Form.Select.Option>
                    <Form.Select.Option value="确认商品销售信息">确认商品销售信息</Form.Select.Option>
                    <Form.Select.Option value="确认退瓶/存瓶余气信息">确认退瓶/存瓶余气信息</Form.Select.Option>

                    <Form.Select.Option value="确认业务类收款信息">确认业务类收款信息</Form.Select.Option>
                    <Form.Select.Option value="办理商品直售">办理商品直售</Form.Select.Option>
                    <Form.Select.Option value="处理问题瓶">处理问题瓶</Form.Select.Option>
                    <Form.Select.Option value="收购存瓶单">收购存瓶单</Form.Select.Option>
                </Form.Select>
                <Form.Input field={'memberid'} label='会员号' />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[...keys.map((item, index) => {
                        if (item == 'info') {
                            return ({ headerName: titles[index], field: item, cellRendererFramework: ({ data }) => JSON.stringify(data.info) })
                        }
                        return ({ headerName: titles[index], field: item })
                    }), {
                        headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Box>
                            <Popconfirm title="提示?" style={{ width: '250px' }} content="确定操作" onConfirm={async () => {
                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Web_Revoke_Handle.RevokeBusiness',
                                    // ...data,
                                    userid: data.userid,
                                    serial: data.serial,
                                    type: api.current.getValue('type'),
                                    // material: JSON.stringify(data.material),
                                    // info: JSON.stringify(data.info),
                                })
                                if (rew.data.msg === 'SUCCESS') {
                                    toast.success('操作成功')
                                } else {
                                    toast.error(`操作失败 ${rew.data.tips}`)
                                }
                                api.current.submitForm()
                            }}>
                                <Button>取消</Button>
                            </Popconfirm>

                        </Box>
                    }]}
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetCanRevokeBusiness;
