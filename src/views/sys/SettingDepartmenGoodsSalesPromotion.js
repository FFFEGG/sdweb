import React, { useState } from 'react';
import { Box, Button, Card } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import NavCard from "../../ui-component/cards/NavCard";


const SettingDepartmenGoodsSalesPromotion = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [open, setopen] = useState(false)

    const [formdata, setdata] = useState({
        action: 'ADD',
        id: 0
    })
    return (
        <form>
            <NavCard title="部门商品促销方案" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box display={"flex"} mb={3}>
                    <Button onClick={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemInfo.DepartmentGoodsSalesPromotionList'
                        })
                        setList(rew.data.info)
                    }} variant={"contained"}>刷新</Button>
                    <Button onClick={() => {
                        setdata({
                            action: 'ADD',
                            id: 0
                        })
                        setopen(true)
                    }} variant={"contained"} sx={{ ml: 2 }}>新增</Button>
                </Box>

                <Box height="60vh">



                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '名称', field: 'goodsname' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '优惠方式', field: 'salestype' },
                            { headerName: '用户类型', field: 'customertype' },
                            { headerName: '价格', field: 'price' },
                            { headerName: '排序', field: 'sort' },
                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", pinned: 'left', cellRendererFramework: (rowData) => (
                                    <Button onClick={() => {
                                        setdata({
                                            ...rowData.data,
                                            action: 'UPDATE',
                                            endtime: rowData.data.endtime.substring(0, 10),
                                            starttime: rowData.data.starttime.substring(0, 10),
                                        })
                                        setTimeout(() => {
                                            setopen(true)
                                        }, 300)

                                    }}>编辑</Button>
                                ),
                            },
                        ]}
                    />
                </Box>

            </Card>

            <Modal visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ top: 100 }}>
                <Form onSubmit={async e => {
                    // console.log(e)
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingDepartmenGoodsSalesPromotion',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen(false)
                }} initValues={formdata} onChange={e => console.log(e)}>
                    <Form.Select field={'departmentid'} label={'部门id'} filter style={{ width: '100%' }}>
                        {
                            initData.DepartmentList.map(item =>
                                <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>
                            )
                        }
                    </Form.Select>

                    <Form.Select field={'customertypeid'} label={'用户类型id'} style={{ width: '100%' }}>
                        <Form.Select.Option value={'0'}>全部</Form.Select.Option>
                        {
                            initData.CustomertypeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>
                    <Form.Select filter field={'goodsid'} label={'商品id'} style={{ width: '100%' }}>
                        {
                            initData.GoodsList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>
                    <Form.Input field={'starttime'} type="date" label={'开始时间'} />
                    <Form.Input field={'endtime'} type="date" label={'结束时间'} />

                    <Form.Select field={'salestype'} label={'优惠方式'} >
                        <Form.Select.Option value={'市场价格优惠'}>市场价格优惠</Form.Select.Option>
                        <Form.Select.Option value={'固定价格优惠'}>固定价格优惠</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field={'price'} label={'价格'} />
                    <Form.Input field={'sort'} label={'排序'} />

                    <Form.Select field={'state'} label={'状态'} >
                        <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>
                    <Button type={'submit'} variant={"contained"}>确认提交</Button>
                </Form>
            </Modal>
        </form>
    );
}

export default SettingDepartmenGoodsSalesPromotion;
