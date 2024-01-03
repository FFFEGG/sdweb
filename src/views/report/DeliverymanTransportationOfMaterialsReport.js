import React, { useRef } from 'react';
import { Box, Button } from "@mui/material";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const DeliverymanTransportationOfMaterialsReport = () => {
    const [list, setList] = React.useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef(null);
    return (
        <Box p={3}
            bgcolor={'#fff'}
            borderColor={'red'}
            position={'relative'}
        >
            <Box fontSize={18} sx={{ mb: 3 }}>零售调拨运费装卸费统计</Box>
            <Box>
                <Form layout="horizontal" labelPosition={'inset'} onChange={e => {
                    const keywords = e.values?.keyword || ''
                    api.current.api.setQuickFilter(keywords)
                }} onSubmit={async (e) => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Report_Business_Infos.DeliverymanTransportationOfMaterialsReport',
                        ...e
                    })
                    setList(rew.data.info)
                }}>
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    {/* <Form.Select field='dockingdepartment' label={'对接部门'} multiple filter ></Form.Select> */}

                    {/* 关键字搜索 */}
                    <Form.Input field='keyword' label={'关键字搜索'} type={'text'} initValue={''} />
                    <Button variant="contained" type={'submit'} color="primary" size={'small'}>查询</Button>
                </Form>


                <Box mt={3} height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list}
                        ref={api}
                        columnDefs={[
                            // 'department'     => $value['department'],
                            // 'deliveryman'    => $value['deliveryman'],
                            // 'departmentgls'  => 0,//门店公里数
                            // 'departmentjbyj' => 0,//门店基本运价  
                            // 'zzddj'          => 0,//重折吨单价
                            // 'kzddj'          => 0,//空折吨单价
                            // 'kg12znum'       => 0,//12KG重瓶数量
                            // 'kg4znum'        => 0,//4KG重瓶数量
                            // 'kg45znum'       => 0,//45KG重瓶数量
                            // 'zzd'            => 0,//重折吨
                            // 'kg12knum'       => 0,//12KG空瓶数量
                            // 'kg4knum'        => 0,//4KG空瓶数量
                            // 'kg45knum'       => 0,//45KG空瓶数量
                            // 'kzd'            => 0,//空折吨
                            // 'yfxj'           => 0,//运费小计
                            // 'kg12zzxf'       => 0,//12kg重装卸费单价   
                            // 'kg4zzxf'        => 0,//4kg重装卸费单价
                            // 'kg45zzxf'       => 0,//45kg重装卸费单价
                            // 'kg2zzxf'        => 0,//2kg重装卸费单价
                            // 'kg12kzxf'       => 0,//12kg空装卸费单价   
                            // 'kg4kzxf'        => 0,//4kg空装卸费单价
                            // 'kg45kzxf'       => 0,//45kg空装卸费单价
                            // 'kg2kzxf'        => 0,//2kg空装卸费单价                
                            // 'zxfxj'          => 0,//装卸费小计

                            { headerName: '门店', field: 'department' },
                            { headerName: '司机', field: 'deliveryman' },
                            { headerName: '门店公里数', field: 'departmentgls' },
                            { headerName: '门店基本运价', field: 'departmentjbyj' },
                            { headerName: '重折吨单价', field: 'zzddj' },
                            { headerName: '空折吨单价', field: 'kzddj' },

                            {
                                headerName: '重瓶数量', children: [
                                    { headerName: '12KG', field: 'kg12znum' },
                                    { headerName: '4KG', field: 'kg4znum' },
                                    { headerName: '45KG', field: 'kg45znum' },
                                    { headerName: '重折吨', field: 'zzd' },
                                ]
                            },

                            {
                                headerName: '空瓶数量', children: [
                                    { headerName: '12KG', field: 'kg12knum' },
                                    { headerName: '4KG', field: 'kg4knum' },
                                    { headerName: '45KG', field: 'kg45knum' },
                                    { headerName: '空折吨', field: 'kzd' },
                                ]
                            },

                            { headerName: '运费小计', field: 'yfxj' },

                            {
                                headerName: '装卸费单价', children: [
                                    { headerName: '12kg重', field: 'kg12zzxf' },
                                    { headerName: '4kg重', field: 'kg4zzxf' },
                                    { headerName: '45kg重', field: 'kg45zzxf' },
                                    { headerName: '2kg重', field: 'kg2zzxf' },
                                    { headerName: '12kg空', field: 'kg12kzxf' },
                                    { headerName: '4kg空', field: 'kg4kzxf' },
                                    { headerName: '45kg空', field: 'kg45kzxf' },
                                    { headerName: '2kg空', field: 'kg2kzxf' },
                                    { headerName: '装卸费小计', field: 'zxfxj' },
                                ]
                            }

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

export default DeliverymanTransportationOfMaterialsReport;