import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import request from "../../../utils/request";
import { Form, Modal } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";

const UserInvoiceInfo = ({ userinfo }) => {
    const [show, setshow] = useState(false)
    const [list, setlist] = useState([])
    const api = useRef();
    return (
        <Box>
            <Box display="flex">
                <Button variant={"contained"} onClick={async () => {
                    const rew = await request('post', '/api/getInfo', {
                        userid: userinfo.userid,
                        url: 'Srapp.Web_Invoice_Infos.UserInvoiceInfo'
                    })
                    setlist(rew.data)
                }}>搜索</Button>

                <Button variant={"contained"} sx={{ ml: 1 }} onClick={() => {
                    setshow(true)
                }}>新增</Button>
            </Box>



            <Modal visible={show} onCancel={() => setshow(false)} footer={<></>} style={{ top: '10%' }} >
                <Form getFormApi={formApi => api.current = formApi} initValues={{
                    action: 'ADD',
                    id: 0,
                    userid: userinfo.userid
                }} onSubmit={async e => {

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Invoice_Handle.EditUserInvoiceInfo',
                        ...e
                    })

                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('成功')
                    } else {
                        toast.error('失败')
                    }
                    setshow(false)

                }}>
                    <Form.Input field={'taxnumber'} label={'纳税人识别号'} />
                    <Form.Input field={'name'} label={'开票名称'} />
                    <Form.Input field={'addresstelephone'} label={'地址,电话'} />
                    {/*<Form.Input field={'addresstelephone1'} label={'地址'} />*/}
                    {/*<Form.Input field={'addresstelephone2'} label={'电话'} />*/}
                    <Form.Input field={'bankaccount'} label={'开户行,账号'} />
                    {/*<Form.Input field={'bankaccount1'} label={'开户行'} />*/}
                    {/*<Form.Input field={'bankaccount2'} label={'账号'} />*/}
                    <Form.Input field={'contact'} label={'电子邮箱/手机号码'} />
                    <Form.Select label={'状态'} field={'state'} style={{ zIndex: 99999 }} initValue={'正常'}>
                        <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>


                    <Button type={"submit"} variant={"contained"}>提交</Button>
                </Form>


            </Modal>



            <Box height={'60vh'} overflow={"scroll"} mt={1}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        { headerName: '纳税人识别号', field: 'taxnumber' },
                        { headerName: '开票名称', field: 'name' },
                        { headerName: '地址、电话', field: 'addresstelephone' },
                        { headerName: '开户行及账号', field: 'bankaccount' },
                        { headerName: '电子邮箱/手机号码', field: 'contact' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', pinned: 'left', cellRendererFramework: ({ data }) => <Button size={"small"} variant={"outlined"} onClick={() => {
                                setshow(true)
                                setTimeout(() => {
                                    api.current.setValues(data)
                                    api.current.setValue('action', 'UPDATE')
                                    api.current.setValue('id', data.id)
                                }, 500)

                            }}>编辑</Button>
                        },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default UserInvoiceInfo;
