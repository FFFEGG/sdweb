import React, { useRef } from 'react';
import { Box, Button } from "@mui/material";
import { Form, Modal, Input } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from 'react-toastify';

const TZUserSalesDetailed = () => {
    const [list, setList] = React.useState([])

    const api = useRef()
    return (
        <Box p={3}
            bgcolor={'#fff'}
            borderColor={'red'}
            position={'relative'}
        >
            <Box fontSize={18} sx={{ mb: 3 }}>拓展销售明细</Box>
            <Box>
                <Form layout="horizontal" labelPosition={'inset'} onSubmit={async (e) => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_Report_Business_Infos.TZUserSalesDetailed',
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
                            //     "id": "1815",
                            //     "addtime": "2023-06-09 00:00:00.000",
                            //     "serial": "800220230609120553529819306",
                            //     "deliveryman": "SJ001",
                            //     "memberid": "tzb709",
                            //     "workplace": "",
                            //     "address": "槎路268号",
                            //     "line": null,
                            //     "goodsname": "12KG液化气(代)",
                            //     "num": "1.0",
                            //     "return_num": "1"
                            // }
                            // { headerName: '序号', field: 'id' },
                            { headerName: '销售时间', field: 'addtime' },
                            { headerName: '订单号', field: 'serial' },
                            { headerName: '司机', field: 'deliveryman' },
                            { headerName: '会员', field: 'memberid' },
                            { headerName: '工作单位', field: 'workplace' },
                            { headerName: '地址', field: 'address' },
                            { headerName: '线路', field: 'line' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '回空数量', field: 'return_num' },
                            {
                                headerName: '操作', pinned: 'right', width: 100, cellRendererFramework: ({ data }) => <Button size="small" onClick={async () => {


                                    Modal.confirm({
                                        title: '修改回空数量',
                                        content:

                                            <Form getFormApi={es => api.current = es} onSubmit={async row => {
                                                const rew = await request('post', '/api/getInfo', {
                                                    url: 'Srapp.Web_BusinessProcessing_Handle.UpdateFMCGUserSalesReturnNum',
                                                    id: data.id,
                                                    serial: data.serial,
                                                    num: row.num
                                                })
                                                if (rew.data.msg === 'SUCCESS') {
                                                    toast.success('修改成功')

                                                } else {
                                                    toast.error('修改失败' + rew.data.tips)
                                                }
                                            }}>
                                                <Form.Input field={'num'} label={'回空数量'} type={'number'} initValue={data.return_num} />
                                            </Form>,
                                        onOk: async (e) => {
                                            api.current.submitForm()
                                        }
                                    })
                                }}>修改</Button>
                            },


                        ]}

                    />
                </Box>
            </Box>

        </Box>
    );
};

export default TZUserSalesDetailed;