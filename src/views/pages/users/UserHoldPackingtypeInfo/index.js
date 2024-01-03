import React, {useEffect, useState} from 'react';
import {Box, Button} from "@mui/material";
import request from "../../../../utils/request";
import {AgGridReact} from "ag-grid-react";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {toast} from "react-toastify";
import {Form, Modal, Popconfirm} from "@douyinfe/semi-ui";

const UserHoldPackingtypeInfo = ({userinfo}) => {
    console.log(userinfo);
    const [list, setlist] = useState([])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserHoldPackingtypeInfo',
            userid: userinfo.userid
        })
        setlist(rew.data)
    }

    const [open, setOpen] = React.useState(false);
    const [add, setAdd] = React.useState(false);
    const [rowdata, setData] = React.useState('');
    const [newcode, setnewcode] = React.useState('');

    const handleSubmit = async () => {
        const rew = await request('post','/api/getInfo',{
            url: 'Srapp.Web_Material_Handle.ReplaceUserMaterialPackingtypeArchivesCode',
            primary_code: rowdata.code,
            new_code: newcode,
            userid: userinfo.userid,
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('操作成功')
        } else {
            toast.error('操作失败')
        }
        setOpen(false)
        setnewcode('')
        setData('')
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getRowStyle = params => {
        console.log('ccc',params)
        if (params.data.archivesid === '0') {
            return { color: 'red' };
        }
        return ''
    };

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box>
            <Button onClick={getlist} variant="contained">搜索</Button>
            <Button sx={{ ml: 3}} onClick={() => {
                setAdd(true)
            }} variant="contained">新增</Button>
            <Box height="80vh" overflow="scroll" marginTop={1}>
                <AgGridReact
                    getRowStyle={getRowStyle}
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    columnDefs={[
                        {field: 'grant_serial', headerName: '订单号',},
                        {field: 'nature', headerName: '性质',},
                        {field: 'grant_time', headerName: '发重时间',},
                        {field: 'grantee', headerName: '发重人',},
                        {field: 'grant_mode', headerName: '发重模式',},
                        {field: 'grant_department', headerName: '发重门店',},
                        {field: 'code', headerName: '钢瓶编码',},
                        {field: 'packingtype', headerName: '类型',},
                        {headerName: '类型',cellRendererFramework: ({data}) =><Box>
                                {data.archivesid !== '0' ? <Button onClick={() => {
                                        setOpen(true)
                                        setData(data)
                                    }}>修改用户瓶号</Button> :

                                    <Popconfirm style={{width: 300}} title="提示" content="确认操作?" onConfirm={async () => {
                                        const rew = await request('post','/api/getInfo',{
                                            url: 'Srapp.Web_User_EditInfo.CancelOldUserHoldPackingtypeInfo',
                                            id: data.id,
                                            userid: userinfo.userid
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast.success('操作成功')
                                        } else {
                                            toast.error(`操作失败 ${rew.data.tips}`)
                                        }
                                    }}>
                                        <Button>取消</Button>
                                    </Popconfirm>}
                            </Box>},
                    ]}
                    defaultColDef={{
                        // flex: 1
                    }}
                />
            </Box>

            <Modal visible={open} onCancel={()=>setOpen(false)} footer={<></>} style={{top: '10%'}}>
                <Box>修改用户瓶资料</Box>
                <Form initValues={{
                    primary_code: rowdata.code,
                    userid: rowdata.stockmen_opeid
                }} onChange={e=> console.log(e)} onSubmit={async e=>{
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_Material_Handle.ReplaceUserMaterialPackingtypeArchivesCode',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setOpen(false)
                    getlist()
                }}>
                    <Form.Input field={'new_code'} label={'新钢瓶码'} />
                    <Form.Input field={'remarks'} label={'备注'} />
                    <Button type={'submit'}>确定</Button>
                </Form>
            </Modal>

            <Modal visible={add} onCancel={()=> setAdd(false)} footer={<></>} style={{top: '10%'}}>
                <Form onSubmit={async e=>{
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_EditInfo.AddOldUserHoldPackingtypeInfo',
                        ...e,
                        userid: userinfo.userid,
                        memberid: userinfo.memberid,
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error('操作失败')
                    }
                    setAdd(false)
                    getlist()
                    // console.log(rew)
                }}   onChange={e=>console.log(e)}>
                        <Box sx={{ fontSize: 18}}>添加用户持有旧系统瓶号资料</Box>


                        <Form.Select label="包装物类型" rules={[{required: true}]} field='packingtype' style={{ width: '100%'}} zIndex={999999999}>
                            {
                                initData.PackingtypeList.map(item=><Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Input field='code' label="识别码"  rules={[{required: true}]} />
                        <Form.Input field='regnumber' label="钢印号"  rules={[{required: true}]} />
                        <Form.Select label="添加原因" field='mode'  rules={[{required: true}]} style={{ width: '100%'}} zIndex={999999999}>
                            <Form.Select.Option value="送错">送错</Form.Select.Option>
                            <Form.Select.Option value="混用">混用</Form.Select.Option>
                        </Form.Select>

                        <Form.Select label="涉及部门"  rules={[{required: true}]}  field='department' style={{ width: '100%'}} filter zIndex={999999999}>
                            {
                                initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            }
                        </Form.Select>
                        <Form.Select label="经手人"  rules={[{required: true}]}  field='handler' style={{ width: '100%'}} zIndex={999999999}>
                            {
                                initData.OperatorList.map(item=><Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                            }
                        </Form.Select>

                        <Form.Input field='remarks'  rules={[{required: true}]}  label="备注" />

                        <Button variant={"contained"} type="submit">确认</Button>
                </Form>
            </Modal>
        </Box>
    );
};

export default UserHoldPackingtypeInfo;
