import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { toast } from 'react-toastify';


const GetOpeMinLoginRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [snsdata, setData] = useState()
    const [show, setShow] = useState(false)
    const api = useRef()
    const api2 = useRef()

    const [list2, setList2] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>SNS绑定列表</Box>

            <Form getFormApi={e => api2.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetUserApplyBindingSnsRecord',
                    ...e
                })
                setList(rew.data)


            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />



                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-07-13 07:54:45.470",
                        //     "sns": "水到家",
                        //     "snsuserid": "47f19c3b1add9dbd8bf113584d23f603",
                        //     "memberid": "",
                        //     "name": "",
                        //     "telephone": "17677153333",
                        //     "workplace": "",
                        //     "address": "",
                        //     "remarks": "自动绑定:17677153333(手机号)",
                        //     "bindingtime": "2023-07-13 07:54:53.000",
                        //     "department": "三燃水到家(微信小程序)",
                        //     "operator": "水到家",
                        //     "cancel_time": null,
                        //     "cancel_department": "",
                        //     "cancel_operator": "",
                        //     "state": "正常"a
                        // }
                        { headerName: "申请时间", field: "addtime", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "SNS", field: "sns", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "会员号", field: "memberid", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "姓名", field: "name", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "手机号", field: "telephone", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "工作单位", field: "workplace", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "地址", field: "address", width: 100, sortable: true, filter: true, resizable: true, },

                        { headerName: "备注", field: "remarks", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "绑定时间", field: "bindingtime", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "绑定部门", field: "department", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "绑定操作人", field: "operator", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "取消时间", field: "cancel_time", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "取消部门", field: "cancel_department", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "取消操作人", field: "cancel_operator", width: 100, sortable: true, filter: true, resizable: true, },
                        { headerName: "状态", field: "state", width: 100, sortable: true, filter: true, resizable: true, },
                        {
                            headerName: "操作", pinned: 'left', field: "id", width: 100, sortable: true, filter: true, resizable: true,
                            cellRendererFramework: ({ data }) => {
                                if (data.state == '待确认') {
                                    return <Button size={"small"} onClick={() => {
                                        console.log(data)
                                        setData(data)
                                        setShow(true)
                                        setTimeout(() => {
                                            api.current.setValue('keyword', data.memberid)
                                            api.current.submitForm()
                                        }, 300)
                                    }}>绑定</Button>
                                } else {
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
                                                    toast.success('取消成功')
                                                } else {
                                                    toast.error('取消失败')
                                                }
                                                api2.current.submitForm()
                                            }
                                        })


                                    }} size={"small"}>取消</Button>
                                }
                            }
                        }


                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true
                    }}
                    localeText={tanslations}
                />


                <Modal title={'绑定'} size='large' visible={show} onCancel={() => setShow(false)} footer={<></>}>
                    <Form getFormApi={e => api.current = e} onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_User_Infos.VagueQueryUserInfo',
                            ...e,
                            // row: 1
                        })
                        setList2(rew.data)
                        console.log(e)
                    }} labelPosition="inset" layout='horizontal'>
                        <Form.Select field='keytype' initValue={'会员号'} label="查询范围" style={{ width: 300 }}>
                            <Form.Select.Option value="会员号">会员号</Form.Select.Option>
                            <Form.Select.Option value="姓名">姓名</Form.Select.Option>
                            <Form.Select.Option value="电话">电话</Form.Select.Option>
                            <Form.Select.Option value="地址">地址</Form.Select.Option>
                            <Form.Select.Option value="单位">单位</Form.Select.Option>
                        </Form.Select>
                        <Form.Input field="keyword" label="关键字" style={{ width: 300 }} />
                        <Button type="submit" variant="outlined" size="small">搜索</Button>

                    </Form>

                    <Box mt={3} height="60vh" overflow="scroll">
                        <AgGridReact
                            className="ag-theme-balham"
                            rowData={list2}
                            columnDefs={[
                                { headerName: '会员号', field: 'memberid' },
                                { headerName: '姓名', field: 'name' },
                                { headerName: '电话', field: 'telephone' },
                                { headerName: '地址', field: 'address' },
                                { headerName: '单位', field: 'workplace' },
                                { headerName: '楼层', field: 'floor' },
                                { headerName: '状态', field: 'state' },
                                {
                                    headerName: '操作', pinned: "right", cellRendererFramework: ({ data }) => {
                                        return <Button size="small" onClick={async () => {

                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_User_EditInfo.BindingSnsUserInfo',

                                                id: snsdata.id,
                                                userid: data.userid,
                                                sns: snsdata.sns,
                                                snsuserid: snsdata.snsuserid,

                                            })
                                            if (rew.data.msg == 'SUCCESS') {
                                                toast.success('绑定成功')
                                                setShow(false)
                                                setTimeout(() => {
                                                    api2.current.submitForm()
                                                }, 300)
                                            } else {
                                                toast.error(rew.data.tips)
                                            }

                                        }}>确认绑定</Button>

                                    }
                                },
                            ]}
                            defaultColDef={{
                                flex: 1,
                                resizable: true
                            }}

                            onCellClicked={e => {
                                console.log(e)

                            }}
                        />
                    </Box>

                </Modal>
            </Box>



        </Box>
    );
};

export default GetOpeMinLoginRecord;
