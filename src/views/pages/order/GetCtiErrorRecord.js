import React, {useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form, Input, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../../utils/request";
import {toast} from "react-toastify";

const GetCtiErrorRecord = () => {
    const [list,setList] = useState([])
    const api = useRef()
    const remarks = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取自助错误信息</Box>

            <Form getFormApi={e=>api.current = e } onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Log_Infos.GetCtiErrorRecord',
                    ...e
                })
                setList(rew.data)

            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName:'时间',field: 'addtime'},
                        {headerName:'会员号',field: 'memberid'},
                        {headerName:'手机',field: 'telephone'},
                        {headerName:'地址',field: 'address'},
                        {headerName:'商品',field: 'goodsname'},
                        {headerName:'数量',field: 'num'},
                        {headerName:'预约上门时间',field: 'appointmenttime'},
                        {headerName:'错误信息',field: 'res.tips'},
                        {headerName:'备注',field: 'remarks'},
                        {headerName:'状态',field: 'state'},
                        {headerName:'操作', cellRendererFramework: ({data})=>data.state === '正常' ? <Button size={"small"} onClick={async ()=>{
                                Modal.confirm({
                                    title: '提示',
                                    content: <div>
                                        <Input prefix={'添加备注信息'} onChange={(e)=> remarks.current = e} />

                                    </div>,
                                    onOk: async () => {
                                        const rew =await  request('post','/api/getInfo',{
                                            url: 'Srapp.Web_Log_Handle.CtiErrorUpdate',
                                            id: data.id,
                                            remarks: remarks.current,
                                        })
                                        if (rew.data.msg === 'SUCCESS') {

                                            toast.success('操作成功')
                                            api.current.submitForm()
                                        } else {
                                            toast.error(`操作失败 ${rew.data.tips}`)
                                        }
                                    }
                                })

                            }}>更新</Button> : ''} ,
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e=>e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default GetCtiErrorRecord;
