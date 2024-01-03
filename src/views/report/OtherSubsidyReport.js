import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import translations from "../../utils/translations";
import { toast } from "react-toastify";

const OtherSubsidyReport = () => {
    const [list, setList] = useState([])
    const [title, settitle] = useState([])
    const [detailsList, setdetailsList] = useState([])
    const [show, setshow] = useState(false)
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>其它补贴报表</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.OtherSubsidyReport',
                    ...e
                })
                setList(rew.data.info)
                var arr = []
                if (rew.data.info.length) {
                    for (const rewKey in rew.data.info[0]) {
                        if (rewKey === 'department') {
                            arr.push({ headerName: '部门', field: rewKey })
                        } else if (rewKey === 'workman') {
                            arr.push({ headerName: '涉及工作人员', field: rewKey })
                        } else {
                            arr.push({ headerName: rewKey, field: rewKey })
                        }
                    }
                }

                settitle(arr)



            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    localeText={translations}
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={title}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    // onRowClicked={async ({data}) =>{
                    //     const rew = await request('post','/api/getInfo',{
                    //         url: 'Srapp.Web_Report_Finance_Infos.OtherSubsidyDetailed',
                    //         ...data,
                    //         begintime: api.current.getValue('begintime'),
                    //         endtime: api.current.getValue('endtime'),
                    //     })
                    //     console.log(rew);
                    // }}
                    onCellClicked={async (e, data) => {
                        console.log(e)
                        if (e.column.instanceId <= 1) {
                            return
                        }
                        // var type = Object.keys(e.data)[e.column.instanceId]
                        console.log('type', e.column.headerName)
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Finance_Infos.OtherSubsidyDetailed',
                            ...e.data,
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                            type: e.colDef.headerName
                        })
                        if (rew.data.info.length) {
                            setshow(true)
                            setdetailsList(rew.data.info)
                        }

                    }}
                // onRowClicked={(e,data)=> {
                //     console.log(e)
                //     console.log(data)
                // }}
                />
            </Box>


            <Modal visible={show} onCancel={() => {
                setshow(false)
                setdetailsList([])
            }} footer={<></>} style={{ width: '70vw', top: '10%', left: '5%' }}>
                <Box fontSize={18} mb={3}>补贴明细</Box>
                <Box height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        localeText={translations}
                        className="ag-theme-balham"
                        rowData={detailsList}
                        columnDefs={[
                            { headerName: '类型', field: 'type' },
                            { headerName: '时间', field: 'businesstime' },
                            { headerName: '订单号', field: 'businessserial' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '涉及工作人员', field: 'workman' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '单价', field: 'price' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '楼层', field: 'floor' },
                            { headerName: '地址', field: 'completeaddress' },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true
                        }}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    />
                </Box>

            </Modal>


        </Box>
    );
};

export default OtherSubsidyReport;
