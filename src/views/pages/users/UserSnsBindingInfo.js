import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../../utils/request";
import { toast } from 'react-toastify';

const UserSnsBindingInfo = ({ userinfo }) => {
    const [list, setList] = useState([])
    return (
        <Box bgcolor={'#fff'}  >
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserSnsBindingInfo',
                    userid: userinfo.userid
                })
                setList(rew.data)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={1} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '时间', field: 'addtime' },
                        { headerName: '客户端', field: 'sns' },
                        { headerName: 'snsuserid', field: 'snsuserid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '电话', field: 'telephone' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '地址', field: 'address' },
                        { headerName: '备注', field: 'remarks' },
                        { headerName: '绑定时间', field: 'bindingtime' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '员工', field: 'operator' },
                        { headerName: '取消时间', field: 'cancel_time' },
                        { headerName: '取消部门', field: 'cancel_department' },
                        { headerName: '取消员工', field: 'cancel_operator' },
                        { headerName: '状态', field: 'state' },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) => {
                                // data。state == '正常' 的可以操作解绑
                                if (data.state == '正常') {
                                    return <Button onClick={async () => {
                                        if (data.sns == '水到家') {
                                            toast.error('水到家不可取消')
                                            return false
                                        }
                                        Modal.confirm({
                                            title: '提示',
                                            content: '确认取消？',
                                            onOk: async () => {

                                                const rew = await request('post', '/api/getInfo', {
                                                    url: 'Srapp.Web_User_EditInfo.CancelBindingSnsUserInfo',
                                                    id: data.id,
                                                    sns: data.sns,
                                                    snsuserid: data.snsuserid,
                                                    userid: data.userid,
                                                })
                                                if (rew.data.msg === 'SUCCESS') {
                                                    toast.success('解绑成功')
                                                } else {
                                                    toast.error('解绑失败')
                                                }
                                                // api2.current.submitForm()
                                            }
                                        })

                                    }} size={'small'} >解绑</Button>
                                }
                                return ''
                            }
                        },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default UserSnsBindingInfo;
