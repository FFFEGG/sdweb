import React from 'react';
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const TransportationOfMaterialsReport = () => {
    const [list, setList] = React.useState([])

    return (
        <Box p={3}
            bgcolor={'#fff'}
            borderColor={'red'}
            position={'relative'}
        >
            <Box fontSize={18} sx={{ mb: 3 }}>门店调出调入</Box>
            <Box>
                <Form layout="horizontal" labelPosition={'inset'} onSubmit={async (e) => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Report_Business_Infos.TransportationOfMaterialsReport',
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
                            //     "department": "二区店",
                            //     "zkg15lldc": 0,
                            //     "zkg15tz": 0,
                            //     "zkg15sjdc": 0,
                            //     "zkg5lldc": 0,
                            //     "zkg5tz": 0,
                            //     "zkg5sjdc": 0,
                            //     "zkg2sjdc": 0,
                            //     "zkg50lldc": 0,
                            //     "zkg50tz": 0,
                            //     "zkg50sjdc": 0,
                            //     "kkg15fk": 0,
                            //     "kkg5fk": 0,
                            //     "kkg50fk": 0,
                            //     "kkg2fk": 0
                            // }

                            // 'zkg15lldc'  => 0, //重15KG理论调出
                            // 'zkg15tz'    => 0, //重15KG退重
                            // 'zkg15sjdc'  => 0, //重15KG实际调出
                            // 'zkg5lldc'   => 0, //重5KG理论调出
                            // 'zkg5tz'     => 0, //重5KG退重
                            // 'zkg5sjdc'   => 0, //重5KG实际调出
                            // 'zkg2sjdc'   => 0, //重2KG实际调出
                            // 'zkg50lldc'  => 0, //重50KG理论调出
                            // 'zkg50tz'    => 0, //重50KG退重
                            // 'zkg50sjdc'  => 0, //重50KG实际调出                

                            // 'kkg15fk'    => 0,//空15KG调入
                            // 'kkg15tk'    => 0,//空15KG退空
                            // 'kkg15sjdr'  => 0,//空15KG实际调入
                            // 'kkg5fk'     => 0,//空5KG调入
                            // 'kkg5tk'    => 0,//空5KG退空
                            // 'kkg5sjdr'  => 0,//空5KG实际调入
                            // 'kkg50fk'    => 0,//空50KG调入
                            // 'kkg50tk'    => 0,//空50KG退空
                            // 'kkg50sjdr'  => 0,//空50KG实际调入
                            // 'kkg2fk'     => 0,//空2KG调入
                            // 'kkg2tk'    => 0,//空2KG退空
                            // 'kkg2sjdr'  => 0,//空2KG实际调入

                            { headerName: '门店', field: 'department' },
                            {
                                headerName: '重', children: [
                                    {
                                        headerName: '15KG', children: [
                                            { headerName: '调出', field: 'zkg15lldc' },
                                            { headerName: '退重', field: 'zkg15tz' },
                                            { headerName: '实际调出', field: 'zkg15sjdc' },
                                        ]
                                    },
                                    {
                                        headerName: '5KG', children: [
                                            { headerName: '调出', field: 'zkg5lldc' },
                                            { headerName: '退重', field: 'zkg5tz' },
                                            { headerName: '实际调出', field: 'zkg5sjdc' },
                                        ]
                                    },


                                    {
                                        headerName: '2KG', children: [
                                            { headerName: '实际调出', field: 'zkg2sjdc' },
                                        ]
                                    },


                                    {
                                        headerName: '50KG', children: [
                                            { headerName: '理论调出', field: 'zkg50lldc' },
                                            { headerName: '退重', field: 'zkg50tz' },
                                            { headerName: '实际调出', field: 'zkg50sjdc' },
                                        ]
                                    },

                                ]
                            },


                            {
                                headerName: '空', children: [
                                    // 'kkg15fk'    => 0,//空15KG调入
                                    // 'kkg15tk'    => 0,//空15KG退空
                                    // 'kkg15sjdr'  => 0,//空15KG实际调入
                                    // 'kkg5fk'     => 0,//空5KG调入
                                    // 'kkg5tk'    => 0,//空5KG退空
                                    // 'kkg5sjdr'  => 0,//空5KG实际调入
                                    // 'kkg50fk'    => 0,//空50KG调入
                                    // 'kkg50tk'    => 0,//空50KG退空
                                    // 'kkg50sjdr'  => 0,//空50KG实际调入
                                    // 'kkg2fk'     => 0,//空2KG调入
                                    // 'kkg2tk'        => 0,//空2KG退空
                                    // 'kkg2sjdr'  => 0,//空2KG实际调入
                                    {
                                        headerName: '调入', children: [
                                            {headerName: '15KG', field: 'kkg15fk'},
                                            {headerName: '5KG', field: 'kkg5fk'},
                                            {headerName: '50KG', field: 'kkg50fk'},
                                            {headerName: '2KG', field: 'kkg2fk'},
                                        ]
                                    },
                                    {
                                        headerName: '退空', children: [
                                            {headerName: '15KG', field: 'kkg15tk'},
                                            {headerName: '5KG', field: 'kkg5tk'},
                                            {headerName: '50KG', field: 'kkg50tk'},
                                            {headerName: '2KG', field: 'kkg2tk'},
                                        ]
                                    },

                                    {
                                        headerName: '实际调入', children: [
                                            {headerName: '15KG', field: 'kkg15sjdr'},
                                            {headerName: '5KG', field: 'kkg5sjdr'},
                                            {headerName: '50KG', field: 'kkg50sjdr'},
                                            {headerName: '2KG', field: 'kkg2sjdr'},

                                        ]
                                    },



                                ]
                            },



                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            flex: 1
                        }}

                    />
                </Box>
            </Box>

        </Box>
    );
};

export default TransportationOfMaterialsReport;