import React, { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button, Checkbox, Typography } from "@mui/material";
import {
    ButtonGroup,
    Button as Btn,
    Descriptions,
    Form,
    List,
    Modal,
    Rating,
} from "@douyinfe/semi-ui";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const SalesReportGoodsConfigList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [open, setopen] = useState()
    const [list, setList] = useState([])

    const [projectconfig, setprojectconfig] = useState([])
    const api = useRef()
    // useEffect(async () => {
    //     const rew = await request('post', '/api/getInfo', {
    //         url: 'Srapp.Web_SystemInfo.CollectionProjectList'
    //     })
    //     // console.log(rew);
    //     setCollectionList(rew.data.info)
    // }, [open])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.SalesReportGoodsConfigList'
        })
        setList(rew.data.info)
    }
    return (
        <Box p={3} bgcolor="#fff">
            <Box display='flex'>
                <Button variant="contained" sx={{ mr: 3 }} onClick={getlist}>刷新</Button>
                <Button variant="contained" onClick={() => {
                    setopen(true)
                }}>新增</Button>
            </Box>
            <Box height="60vh" overflow="scroll" mt={3}>
                <AgGridReact
                    rowData={list}
                    className='ag-theme-balham'
                    columnDefs={[
                        { headerName: '名称', field: 'name' },
                        { headerName: '备注', field: 'remarks' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) =>
                                <Box>
                                    <Button onClick={() => {
                                        setopen(true)

                                        setTimeout(() => {

                                            api.current.setValue('id', data.id)
                                            api.current.setValue('action', 'UPDATE')
                                            api.current.setValue('name', data.name)
                                            api.current.setValue('remarks', data.remarks)
                                            api.current.setValue('goodsid', data.goodsids)
                                        }, 500)
                                    }}>修改</Button>
                                </Box>

                        },

                    ]}
                    defaultColDef={{
                        resizable: true,
                        // flex: 1
                    }}
                />
            </Box>
            <Modal title="设置销售报表参数配置" zIndex={99999} onCancel={() => setopen(false)} visible={open} footer={<></>} style={{ top: '5%', width: '80%' }}>
                <Form onSubmit={async e => {
                    // 去掉 id 132,133,137,141,135,136

                    const ids = e.goodsid.filter(item => item !== '99999')

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemSetting.SettingSalesReportGoodsConfig',
                        ...e,
                        goodsid: JSON.stringify(ids)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.success('操作失败')
                    }


                    setopen(false)
                }} getFormApi={formapi => {
                    api.current = formapi
                }} onChange={e => console.log(e.values)} initValues={{
                    id: 0,
                    action: 'ADD'
                }}>
                    <Form.Input field='name' label='销售报表名称' />

                    <Form.CheckboxGroup field='goodsid' label='商品IDs'>
                        {
                            initData.GoodsList.map(item => <Form.Checkbox value={item.id} >[{item.id}]-{item.name}</Form.Checkbox>)
                        }

                    </Form.CheckboxGroup>


                    <Form.Input field='remarks' label='备注' />


                    <Form.Select field='state' label='状态' initValue='正常' zIndex={9999999}>
                        <Form.Select.Option value='正常'>正常</Form.Select.Option>
                        <Form.Select.Option value='取消'>取消</Form.Select.Option>
                    </Form.Select>
                    <Button type='submit'>确认提交</Button>
                </Form>
            </Modal>

        </Box>
    );
};

export default SalesReportGoodsConfigList;
