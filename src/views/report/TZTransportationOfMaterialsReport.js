import React from 'react';
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const TzTransportationOfMaterialsReport = () => {
    const [list, setList] = React.useState([])
    return (
        <Box p={3}
            bgcolor={'#fff'}
            borderColor={'red'}
            position={'relative'}
        >
            <Box fontSize={18} sx={{ mb: 3 }}>司机代销用户运费和装卸费报表</Box>
            <Box>
                <Form layout="horizontal" labelPosition={'inset'} onSubmit={async (e) => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Report_Business_Infos.TzTransportationOfMaterialsReport',
                        ...e
                    })
                    setList(rew.data.info)
                }}>
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Button variant="contained" type={'submit'} color="primary" size={'small'}>查询</Button>
                </Form>


                <Box mt={3} height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list}
                        columnDefs={[
                            // {
                            //     "deliveryman": "SJ001",
                            //     "line": null,
                            //     "kg12znum": 12,
                            //     "kg4znum": 0,
                            //     "kg45znum": 7,
                            //     "kg12knum": 12,
                            //     "kg4knum": 0,
                            //     "kg45knum": 7,
                            //     "zxf": 0,
                            //     "yf": 0
                            // }
                            // { headerName: '司机', field: 'driver' },
                            // { headerName: '运费模式', filed: 'freightmode' },
                            // { headerName: '15/12KG重数量', field: '' },
                            // { headerName: '4KG重数量', field: '' },
                            // { headerName: '45KG重数量', field: '' },
                            // { headerName: '15/12KG空数量', field: '' },
                            // { headerName: '4KG空数量', field: '' },
                            // { headerName: '45KG空数量', field: '' },
                            // { headerName: '空运费小计', field: '' },
                            // { headerName: '重运费小计', field: '' },
                            // { headerName: '钢瓶类型', field: 'packingtype',width: 150 },
                            // { headerName: '类型', field: 'type',width: 150 },
                            // { headerName: '调入数量', field: 'in_num',width: 150 },
                            // { headerName: '调出数量', field: 'out_num',width: 150 },
                            // { headerName: '调拨数量', field: 'transfer_num',width: 150 },

                            { headerName: '司机', field: 'deliveryman' },
                            { headerName: '线路', field: 'line' },
                            { headerName: '15/12KG重数量', field: 'kg12znum' },
                            { headerName: '4KG重数量', field: 'kg4znum' },
                            { headerName: '45KG重数量', field: 'kg45znum' },
                            { headerName: '15/12KG空数量', field: 'kg12knum' },
                            { headerName: '4KG空数量', field: 'kg4knum' },
                            { headerName: '45KG空数量', field: 'kg45knum' },
                            { headerName: '装卸费', field: 'zxf' },
                            { headerName: '运费', field: 'yf' },
                        ]}

                    />
                </Box>
            </Box>

        </Box>
    );
};

export default TzTransportationOfMaterialsReport;