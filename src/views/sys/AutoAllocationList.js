import React, { useRef, useState } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Box, Button, Card } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { Form, Modal } from '@douyinfe/semi-ui';
import { toast } from 'react-toastify';



const AutoAllocationList = () => {
    const [list, setList] = useState([])
    const getlist = async () => {
        setList([])
        const response = await request('post', '/api/sysGetList', {
            url: 'AutoAllocationList'
        })
        setList(response.data.info);
    }
    const [show, setshow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [department, setdepartment] = useState('')
    const api = useRef()


    return (<Box>
        <NavCard title="自动分配参数信息" subtitle="系统参数设置" />
        <Card sx={{
            mt: 1,
            p: 2

        }}>
            <Box height="80vh">
                <Box mb={1}>
                    <Button sx={{ mr: 1 }} onClick={getlist} variant="contained">刷新</Button>
                    <Button onClick={() => {
                        setshow(true)
                    }} variant="contained">新增</Button>
                </Box>
                <AgGridReact
                    rowData={list}
                    reactUi="true"
                    className="ag-theme-balham"
                    columnDefs={[
                        { headerName: '部门', field: 'department' },
                        { headerName: '模式', field: 'distributionmode' },
                        { headerName: '操作员', field: 'opename' },

                        { headerName: '状态', field: 'state' },
                        {
                            headerName: "操作", pinned: 'left', cellRendererFramework: ({ data }) => (
                                <Button size="small" onClick={() => {
                                    setshow(true)

                                    setTimeout(() => {
                                        api.current.setValues(data)
                                        api.current.setValue('id', data.id)
                                        api.current.setValue('action', 'UPDATE')
                                    }, 500)
                                }}>编辑</Button>
                            ),
                        },
                    ]}
                />

                <Modal visible={show} onCancel={() => setshow(false)} style={{ top: '10%' }} footer={<></>}>
                    <Form getFormApi={e => api.current = e} initValues={{
                        action: 'ADD',
                        id: 0,
                        state: '正常'
                    }} onSubmit={async (e) => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemSetting.SettingAutoAllocationParameter',
                            ...e,
                            goodsid: JSON.stringify(e.goodsid),
                        })
                        if (rew.code === 200) {
                            toast.success('成功')
                        } else {
                            toast.error('失败')
                        }
                        setshow(false)
                        getlist()
                    }}>
                        <Form.Select label="服务区域" field='serviceareaid' style={{ width: '100%' }} >
                            {
                                initData.ServiceAreaList.map(item =>
                                    <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                                )
                            }

                        </Form.Select>


                        <Form.Select onChange={e => {
                            setdepartment(e)
                            api.current.setValue('opeid', '')
                        }} label="默认部门" field='departmentid' style={{ width: '100%' }} >
                            {
                                initData.DepartmentList.filter(item => item.type == '业务门店').map(item =>
                                    <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                                )
                            }

                        </Form.Select>


                        <Form.Select showClear label="服务人员" field='opeid' style={{ width: '100%' }} >
                            {
                                initData.OperatorList.filter(item => item.departmentid === department && item.distribution > 0).map(item =>
                                    <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>

                        <Form.Select multiple filter showClear label="指定服务商品" field='goodsid' style={{ width: '100%' }} >
                            {
                                initData.GoodsList.map(item =>
                                    <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>

                        <Form.Select label="状态" field='state' style={{ width: '100%' }} >
                            <Form.Select.Option value="正常">正常</Form.Select.Option>
                            <Form.Select.Option value="取消">取消</Form.Select.Option>
                        </Form.Select>

                        <Button variant="contained" type="submit">确认录入</Button>
                    </Form>
                </Modal>
            </Box>

        </Card>
    </Box>
    )
}

export default AutoAllocationList;
