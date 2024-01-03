import { Form, Modal } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import { toast } from 'react-toastify';
import request from 'utils/request';

const UserNoDirectCostList = () => {
    const [list, setList] = React.useState([]);
    const [add, setAdd] = React.useState(false);
    const [userinfo, setUserInfo] = React.useState({});
    return (
        <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
            <Button variant="outlined" onClick={async () => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserNoDirectCostList'
                })
                setList(rew.data)
            }}>搜索</Button>

            <Button sx={{ ml: 1 }} variant="outlined" onClick={async () => {
                setAdd(true)
            }}>新增</Button>

            <Box mt={3} overflow={'scroll'} height={'60vh'}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '手机号', field: 'telephone' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '地址', field: 'address' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '操作', cellRendererFramework:({data})=> <Button onClick={()=>{
                                Modal.confirm({
                                    title: '确认取消吗',
                                    onOk:async ()=>{
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_User_EditInfo.CancelNoDirectCost',
                                            userid: data.userid
                                        })
                                        if(rew.data.msg==='SUCCESS'){
                                            toast.success('取消成功')
                                        }else{
                                            toast.error('取消失败')
                                        }
                                    }
                                })

                            }}>取消</Button> },
                    ]}

                />
            </Box>


            <Modal visible={add} title="新增" okText='确认添加' onCancel={() => setAdd(false)} onOk={async () => {
                if (userinfo.userid === undefined) {
                    toast.error('请先搜索会员')
                    return
                }
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_EditInfo.SettingNoDirectCost',
                    userid: userinfo.userid,
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('添加成功')
                    setAdd(false)
                    setUserInfo({})
                } else {
                    toast.error('添加失败')
                }
            }}>
                <Form>
                    <Form.Input field='memberid' label="会员号" placeholder={'回车搜索'} onKeyDown={async e => {
                        if (e.keyCode === 13) {
                            console.log(e.target.value)
                            const rew = await request('post', '/api/getInfo', {
                                memberid: e.target.value,
                                url: 'Srapp.Web_User_Infos.UserBasicInfo'
                            })
                            setUserInfo(rew.data)

                        }
                    }} />
                </Form>

                {/* 显示会员信息 */}
                <Box>
                    <Box>会员号：{userinfo.memberid}</Box>
                    <Box>姓名：{userinfo.name}</Box>
                    <Box>手机号：{userinfo.telephone}</Box>
                    <Box>地址：{userinfo.address}</Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default UserNoDirectCostList;