import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { toast } from 'react-toastify';


const GetSnsAppointmentRepairRecord = () => {
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
            <Box fontSize={18} mb={3}>获取SNS 预约维修\清洗业务记录</Box>

            <Form getFormApi={e => api2.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetSnsAppointmentRepairRecord',
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
                    columnDefs={
                        [
                            // id,serial,memberid,telephone,name,addressid,workplace,province,city,area,town,address,floor,housingproperty,longitude,latitude,appointmenttime,mode,object,appointmentremarks,handletime,handledepartment,handleoperator,handleremarks,state
                            // { headerName: "id", field: "id", width: 100 },
                            { headerName: "订单号", field: "serial", width: 100 },
                            { headerName: "会员号", field: "memberid", width: 100 },
                            { headerName: "手机号", field: "telephone", width: 100 },
                            { headerName: "姓名", field: "name", width: 100 },
                            // { headerName: "地址ID", field: "addressid", width: 100 },
                            { headerName: "工作单位", field: "workplace", width: 100 },
                            // { headerName: "省", field: "province", width: 100 },
                            // { headerName: "市", field: "city", width: 100 },
                            // { headerName: "区", field: "area", width: 100 },
                            // { headerName: "镇", field: "town", width: 100 },
                            { headerName: "地址", field: "address", width: 100 },
                            { headerName: "楼层", field: "floor", width: 100 },
                            { headerName: "住宅类型", field: "housingproperty", width: 100 },
                            // { headerName: "经度", field: "longitude", width: 100 },
                            // { headerName: "纬度", field: "latitude", width: 100 },
                            { headerName: "预约时间", field: "appointmenttime", width: 100 },
                            { headerName: "方式", field: "mode", width: 100 },
                            { headerName: "对象", field: "object", width: 100 },
                            { headerName: "预约备注", field: "appointmentremarks", width: 100 },
                            { headerName: "处理时间", field: "handletime", width: 100 },
                            { headerName: "处理部门", field: "handledepartment", width: 100 },
                            { headerName: "处理人", field: "handleoperator", width: 100 },
                            { headerName: "处理备注", field: "handleremarks", width: 100 },
                            { headerName: "状态", field: "state", width: 100 },
                            {
                                headerName: "操作", pinned: 'right', cellRendererFramework: ({ data }) => data.state == '正常' && <Button size='small' onClick={() => {
                                    setShow(true)
                                    setData(data)
                                }}>完成</Button>,
                            }


                        ]
                    }
                    defaultColDef={{
                        sortable: true,
                        resizable: true
                    }}
                    localeText={tanslations}
                />


            </Box>


            <Modal visible={show} title={'完成'} onCancel={() => setShow(false)} footer={<></>} >
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Other_Handle.HandleSnsAppointmentRepairRecord',
                        id: snsdata.id,
                        remarks: e.remarks,
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('完成成功')
                        setShow(false)
                        api2.current.submitForm()
                    } else {
                        toast.error('完成失败')
                    }
                }}>
                    <Form.Input field='remarks' label={'备注'} />
                    <Button type="submit" variant="contained">确认</Button>
                </Form>
            </Modal>

        </Box>
    );
};

export default GetSnsAppointmentRepairRecord;
