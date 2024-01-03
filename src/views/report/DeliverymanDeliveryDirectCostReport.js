import React from 'react';
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const DeliverymanDeliveryDirectCostReport = () => {
    const [list, setList] = React.useState([])
    return (
        <Box p={3}
            bgcolor={'#fff'}
            borderColor={'red'}
            position={'relative'}
        >
            <Box fontSize={18} sx={{ mb: 3 }}>运输公司工商气运费报表</Box>
            <Box>
                <Form layout="horizontal" labelPosition={'inset'} onSubmit={async (e) => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Report_Business_Infos.DeliverymanDeliveryDirectCostReport',
                        ...e
                    })
                    setList(rew.data.info)
                }}>
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Button variant="contained" type={'submit'} color="primary" size={'small'}>查询</Button>
                </Form>


                <Box mt={3} >
                    <table className={'my-table'}>
                        <thead>
                            <tr>
                                <td rowSpan={2}>配送员</td>
                                <td rowSpan={2}>线路</td>
                                <td colSpan={4}>重瓶</td>
                                <td colSpan={4}>空瓶</td>
                                <td colSpan={4}>运费</td>
                            </tr>
                            <tr>
                                <td >12kg</td>
                                <td >4kg</td>
                                <td >50kg</td>
                                <td >2kg</td>
                                <td >12kg</td>
                                <td >4kg</td>
                                <td >50kg</td>
                                <td >2kg</td>
                                <td>运费</td>
                                <td>装卸费</td>

                            </tr>

                        </thead>
                        <tbody>
                            {
                                list.map((item, index) => {
                                    return (
                                        // {
                                        //     "deliveryman": "SJ001",
                                        //     "line": null,
                                        //     "kg12znum": 8,
                                        //     "kg4znum": 0,
                                        //     "kg45znum": 50,
                                        //     "kg2znum": 0,
                                        //     "kg12knum": 1,
                                        //     "kg4knum": 0,
                                        //     "kg45knum": 22,
                                        //     "kg2knum": 0,
                                        //     "zxf": 0,
                                        //     "yf": 0
                                        // }
                                        <tr key={index}>
                                            <td>{item.deliveryman}</td>
                                            <td>{item.line}</td>
                                            <td>{item.kg12znum}</td>
                                            <td>{item.kg4znum}</td>
                                            <td>{item.kg45znum}</td>
                                            <td>{item.kg2znum}</td>
                                            <td>{item.kg12knum}</td>
                                            <td>{item.kg4knum}</td>
                                            <td>{item.kg45knum}</td>
                                            <td>{item.kg2knum}</td>
                                            <td>{item.yf}</td>
                                            <td>{item.zxf}</td>

                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={14}>注：运费参数，车辆性质不同，参数也不同；运费=数量*单价</td>

                            </tr>
                            <tr>
                                <td colSpan={14}>
                                    一.12kg重空=12KG液化气+15KG液化气（B）<br />
                                    二.50kg重空=45KG液化气+45KG液化气(液相)+49KG大口径液化气(D)
                                    <br /> &nbsp; &nbsp; +49KG小口径液化气(D)+大口径液相液化气单头瓶45KG+45KG液化气(B)
                                    <br /> &nbsp; &nbsp; +40KG液化气(B)+30KG液化气(B)+49KG液化气(B)
                                    <br /> 三.不计直调客户，不按瓶提运费，不统计进此报表；
                                </td>
                            </tr>
                        </tbody>



                    </table>
                </Box>
            </Box>

        </Box>
    );
};

export default DeliverymanDeliveryDirectCostReport;