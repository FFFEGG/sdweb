import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import request from "../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";

const UserExclusiveSalesman = ({ userinfo }) => {
    const [list, setList] = useState([])
    const [show, setshow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef()
    return (
        <Box>
            <Button sx={{ mr: 3 }} variant={"contained"} onClick={async () => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserExclusiveSalesman',
                    userid: userinfo.userid
                })
                setList(rew.data)
            }}>搜索</Button>
            <Button variant={"contained"} onClick={async () => {
                setshow(true)
            }}>新增</Button>




            <Box height={'60vh'} mt={1} overflow={"scroll"}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        { headerName: '添加时间', field: 'addtime' },
                        { headerName: '归属公司', field: 'attributiondepartment' },
                        { headerName: '类型', field: 'cat' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '备注', field: 'remarks' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '业务员工号', field: 'salesmanopeid' },
                        { headerName: '业务员电话', field: 'salesmantelephone' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Button onClick={() => {
                                setshow(true)

                                setTimeout(() => {
                                    api.current.setValues(data)
                                }, 500)

                            }} size={"small"}>编辑</Button>
                        },
                    ]}
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        sortable: true
                    }
                    }
                />
            </Box>


            <Modal style={{ top: '10%' }} visible={show} onCancel={() => setshow(false)} footer={<></>}>
                <Form getFormApi={e => api.current = e} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_User_EditInfo.UserExclusiveSalesman',
                        userid: userinfo.userid,
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('成功')
                    } else {
                        toast.error('失败')
                    }
                    setshow(false)
                    api.current.setValues('')
                }}>
                    <Form.Select field={'catid'} label={'类型id'} style={{ width: '100%' }}>
                        {
                            initData.GoodsCatList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'customertypeid'} label={'用户类型'} style={{ width: '100%' }}>
                        {
                            initData.CustomertypeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'attributiondepartmentid'} label={'归属部门'} style={{ width: '100%' }}>
                        {
                            initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'salesmanopeid'} filter label={'业务员'} style={{ width: '100%' }}>
                        {
                            initData.OperatorList.map(item =>
                                <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'state'} label={'状态'} style={{ width: '100%' }}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>


                    <Button variant={"contained"} type={"submit"}>确认</Button>
                </Form>
            </Modal>
        </Box>

    );
};

export default UserExclusiveSalesman;
