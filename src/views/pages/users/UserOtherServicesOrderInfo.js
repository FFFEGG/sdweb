import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { Form, Image, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../../utils/request";
import translations from '../../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";

const UserOtherServicesOrderInfo = ({ userinfo }) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])

    const [imgOpen, setImgOpen] = useState(false)
    const [imgurlList, setImgurl] = useState([])

    return (
        <Box mt={3}>
            <Form layout={"horizontal"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserOtherServicesOrderInfo',
                    userid: userinfo.userid,
                    ...e,
                    state: JSON.stringify(e.state)
                })
                setList(rew.data)
                // console.log(rew);
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={'1999-01-01'} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select label={'状态'} field={'state'} maxTagCount={2} multiple style={{ width: 300 }} initValue={['正常', '已安排', '已接单', '已完成', '已汇总', '取消']}>
                    <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                    <Form.Select.Option value={'已安排'}>已安排</Form.Select.Option>
                    <Form.Select.Option value={'已接单'}>已接单</Form.Select.Option>
                    <Form.Select.Option value={'已完成'}>已完成</Form.Select.Option>
                    <Form.Select.Option value={'已汇总'}>已汇总</Form.Select.Option>
                    <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                </Form.Select>
                <Box display={"flex"} alignItems={"end"}>
                    <Button type={'submit'} variant={"contained"}>搜索</Button>
                </Box>

            </Form>


            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    getRowStyle={params => {
                        if (params.data && params.data.state === '已安排') {
                            return { color: "red" }
                        }
                        if (params.data && params.data.state === '已完成') {
                            return { color: "blue" }
                        }

                        if (params.data && params.data.state === '已汇总') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.state === '已接单') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.state === '取消') {
                            return { color: "pink" }
                        }
                        return { color: "black" }
                    }}
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={[
                        { field: 'addtime', headerName: '添加时间' },
                        { field: 'memberid', headerName: '卡号' },
                        { field: 'name', headerName: '姓名' },
                        { field: 'telephone', headerName: '电话' },
                        { field: 'address', headerName: '地址' },
                        { field: 'remarks', headerName: '备注' },
                        { field: 'complete_detailed', headerName: '服务结果明细' },
                        { field: 'servicetype', headerName: '类型' },
                        { field: 'booking_operator', headerName: '预约人' },
                        { field: 'department', headerName: '部门' },
                        { field: 'serviceope', headerName: '维修员' },
                        { field: 'cancel_operator', headerName: '取消人' },
                        { field: 'cancel_time', headerName: '取消时间' },
                        { field: 'cancel_remarks', headerName: '取消原因' },
                        { field: 'state', headerName: '状态' },
                        {
                            headerName: '操作', cellRendererFramework: ({ data }) => <Button variant={"text"} size="small" onClick={async () => {
                                setImgOpen(true)
                                /*
                                data.imgids = [
                                    {
                                        "explan": "热水器安装不合格",
                                        "imgids": [
                                        "104"
                                        ]
                                    }]
                                循环取出imgids组成数组
                                */
                                let imgids = []
                                data.imgids.forEach(item => {
                                    item.imgids.forEach(item2 => {
                                        imgids.push(item2)
                                    })
                                })
                                // console.log(imgids);

                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Action.GetImgList',
                                    id: JSON.stringify(imgids),
                                })
                                console.log(rew);
                                setImgurl(rew.data)

                            }}>查看安检图片</Button>
                        },
                    ]}
                    defaultColDef={{
                        flex: 1,
                        resizable: true
                    }}
                />
            </Box>

            <Modal title="安检图片" visible={imgOpen} onCancel={() => {
                setImgOpen(false)
                setImgurl([])
            }} footer={<></>} style={{ top: 200 }}>
                <Box>
                    {
                        imgurlList.map(item =>
                            <Box>
                                <h2>{item.imgtype}</h2>
                                <Image src={item.imgurl} width={400} height={400} />
                            </Box>
                        )
                    }

                </Box>
            </Modal >

        </Box >
    );
};

export default UserOtherServicesOrderInfo;
