import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal, Popconfirm } from "@douyinfe/semi-ui";
import { Button } from "@mui/material";
import moment from "moment";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'

import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";

const SignTransportRecord = () => {

    const [list, setlist] = useState([]);
    const [open, setopen] = useState(false)
    const [maindata, setmaindata] = useState([])

    return (
        <Box p={3} bgcolor={'#FFF'}>
            <Box fontSize={20} mb={3}>签封调运记录</Box>

            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                console.log(e);
                const rew = await request('post', '/api/getInfo', {
                    ...e,
                    url: 'Srapp.Web_Material_Infos.SignTransportRecord'
                })

                setlist(rew.data)
            }} initValues={{
                begintime: moment().format('YYYY-MM-DD'),
                endtime: moment().format('YYYY-MM-DD'),
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} />
                <Form.Input field={'batchnumber'} label={'车次单据号'} />
                <Form.Input field={'carno'} label={'车号'} />
                <Button type={"submit"} variant={"contained"} size={"small"}>搜索</Button>




            </Form>


            <Box height={'60vh'} overflow={"scroll"} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    masterDetail="true"
                    localeText={tanslations}
                    embedFullWidthRows="true"
                    columnDefs={[
                        { headerName: '添加时间', field: 'addtime', enableRowGroup: true, cellRenderer: 'agGroupCellRenderer' },
                        { headerName: '车号', field: 'car_no' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '经手人', field: 'handler' },
                        { headerName: '发起人', field: 'operator' },
                        { headerName: '订单号', field: 'serial' },
                    ]}

                    detailCellRendererParams={{
                        detailGridOptions: {
                            columnDefs: [
                                { field: 'inorout', headerName: '入出' },
                                { field: 'department', headerName: '部门' },
                                { field: 'num', headerName: '数量' },
                                { field: 'operator', headerName: '经手人' },
                                { field: 'packingtype', headerName: '瓶型' },
                                { field: 'receive_num', headerName: '接收数量' },
                                { field: 'type', headerName: '类型' },
                                { field: 'state', headerName: '状态' },
                                {
                                    headerName: '操作', cellRendererFramework: ({ data }) => data.state === '待确认入库' ? <Button onClick={e => {
                                        setopen(true)
                                        setmaindata(data.detailed)
                                    }}>修改</Button> : ''
                                },
                            ],
                            defaultColDef: {
                                // flex: 1,
                                resizable: true
                            },
                        },
                        getDetailRowData: (params) => {

                            params.successCallback(params.data.sub);
                        },

                    }}
                />

            </Box>


            <Modal visible={open} onCancel={() => setopen(false)} footer={<></>} style={{ width: '60vw', top: '10%' }}>

                <Box height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={maindata}
                        masterDetail="true"
                        embedFullWidthRows="true"
                        columnDefs={[

                            { headerName: '条码', field: 'code' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '订单号', field: 'serial' },
                            {
                                headerName: '操作', cellRendererFramework: ({ data }) => data.use === 0 ? <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Material_Handle.UpdateSignTransportSubRecordState',
                                        id: data.stockrecordid,
                                        serial: data.serial
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('操作成功')
                                        setopen(false)
                                        setmaindata([])
                                    } else {
                                        toast.error(`操作失败 ${rew.data.tips}`)
                                    }
                                }}><Button>恢复正常</Button></Popconfirm> : ''
                            },
                        ]}
                    />
                </Box>

            </Modal>
        </Box>
    );
};

export default SignTransportRecord;
