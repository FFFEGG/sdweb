import React, { useRef, useState } from 'react';
import { Box, Button, Card } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import NavCard from "../../ui-component/cards/NavCard";


const SettingUserOverlayOfferInSpecifiedRangeForCustomertype = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [open, setopen] = useState(false)
    const [formdata, setdata] = useState({
        action: 'ADD',
        id: 0
    })

    const api = useRef()
    const Edit = (data) => {
        setopen(true)
        setTimeout(() => {
            api.current.setValues(data.data)
            api.current.setValue('action', 'UPDATE')
            api.current.setValue('id', data.data.id)
        }, 1000)
    }
    return (
        <form>
            <NavCard title="设置指定范围用户叠加优惠条件" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Box height="80vh">

                    <Box display={"flex"} mb={3}>
                        <Button onClick={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_SystemInfo.UserOverlayOfferInSpecifiedRangeList'
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


                    <AgGridReact
                        rowData={list}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '归属部门', field: 'attributiondepartment' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '价格', field: 'price' },

                            { headerName: '状态', field: 'state' },
                            {
                                headerName: "操作", pinned: 'left', cellRendererFramework: (rowData) => (
                                    <Button onClick={() => Edit(rowData)}>编辑</Button>
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
                        url: 'Srapp.Web_SystemSetting.SettingUserOverlayOfferInSpecifiedRange',
                        ...e,
                        customertypeidlist: JSON.stringify(e.customertypeidlist)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setopen(false)
                }} initValues={formdata} getFormApi={formApi => { api.current = formApi }} onChange={values => console.log(values)}>
                    <Form.Input field={'starttime'} type="date" label={'开始时间'} />
                    <Form.Input field={'endtime'} type="date" label={'结束时间'} />

                    <Form.Select field={'attributiondepartmentid'} label={'归属部门ID'} style={{ width: '100%' }}>
                        <Form.Select.Option value="0">全部</Form.Select.Option>
                        {
                            initData.DepartmentList.filter(item => item.type === '管理部门').map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }

                    </Form.Select>
                    <Form.Select field={'goodsid'} label={'商品'} style={{ width: '100%' }}>

                        {
                            initData.GoodsList.filter(item => item.canuse === true).map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }

                    </Form.Select>
                    <Form.Select field={'customertypeidlist'} multiple label={'可销售用户类型'} style={{ width: '100%' }}>
                        {
                            initData.CustomertypeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>

                    <Form.Input field={'price'} label={'单价'} />
                    <Form.Input field={'remarks'} label={'备注'} />

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

export default SettingUserOverlayOfferInSpecifiedRangeForCustomertype;
