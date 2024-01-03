import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from 'ag-grid-react';

const OpeAbnormalExchangeRecord = () => {
    const [list, setlist] = useState([])
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Box mb={2} fontSize={18}>员工异常交换记录</Box>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Material_Infos.OpeAbnormalExchangeRecord',
                    ...e
                })
                console.log(rew);
                setlist(rew.data)
            }}>
                <Form.Input type={'date'} field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type={'date'} field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Button type={"submit"} variant={"outlined"} size={"small"}>搜索</Button>

            </Form>

            <Box mt={2} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-08-04 01:09:26.367",
                        //     "serial": "800020230804010935721858889",
                        //     "error_department": "三津店",
                        //     "error_ope": "兰春艳2",
                        //     "error_opeid": "JN888",
                        //     "error_archivesid": "4236",
                        //     "error_code": "SR99000699",
                        //     "error_packingtype": "YSP35.5型钢瓶",
                        //     "docking_department": "富源店",
                        //     "docking_ope": "唐燕平",
                        //     "docking_opeid": "JN004",
                        //     "exchange_time": null,
                        //     "exchange_department": "",
                        //     "exchange_ope": "",
                        //     "exchange_opeid": "",
                        //     "exchange_archivesid": "0",
                        //     "exchange_code": "",
                        //     "exchange_packingtype": "",
                        //     "state": "正常"
                        // }
                        { headerName: '添加时间', field: 'addtime' },
                        { headerName: '流水号', field: 'serial' },
                        { headerName: '异常部门', field: 'error_department' },
                        { headerName: '异常操作员', field: 'error_ope' },
                        { headerName: '异常操作员id', field: 'error_opeid' },
                        { headerName: '异常档案id', field: 'error_archivesid' },
                        { headerName: '异常编码', field: 'error_code' },
                        { headerName: '异常包装类型', field: 'error_packingtype' },
                        { headerName: '对接部门', field: 'docking_department' },
                        { headerName: '对接操作员', field: 'docking_ope' },
                        { headerName: '对接操作员id', field: 'docking_opeid' },
                        { headerName: '交换时间', field: 'exchange_time' },
                        { headerName: '交换部门', field: 'exchange_department' },
                        { headerName: '交换操作员', field: 'exchange_ope' },
                        { headerName: '交换操作员id', field: 'exchange_opeid' },
                        { headerName: '交换档案id', field: 'exchange_archivesid' },
                        { headerName: '交换编码', field: 'exchange_code' },
                        { headerName: '交换包装类型', field: 'exchange_packingtype' },
                        { headerName: '状态', field: 'state' },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default OpeAbnormalExchangeRecord;
