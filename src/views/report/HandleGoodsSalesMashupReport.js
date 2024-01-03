import React from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const HandleGoodsSalesMashupReport = () => {
    const [list, setList] = React.useState([])
    const [show, setShow] = React.useState(false)
    const [detaillist, setDetaillist] = React.useState([])
    const getlist = async (e) => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Report_Business_Infos.HandleGoodsSalesMashupReport', ...e,
        })
        setList(rew.data.info)
    }
    const api = React.useRef()

    return (<Box p={3} bgcolor={'#fff'} borderRadius={1}>
        <Box fontSize={18} mb={3}>商品捆绑促销方案销售统计报表</Box>
        <Form getFormApi={e => api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={e => getlist(e)}>
            <Form.Input field='begintime' label='开始时间' type='date' initValue={moment().format('YYYY-MM-DD')} />
            <Form.Input field='endtime' label='结束时间' type='date' initValue={moment().format('YYYY-MM-DD')} />
            <Button variant={'contained'} size={'small'} type={'submit'}>搜索</Button>
        </Form>
        <Box mt={3} height={'60vh'} overflow={'scroll'}>
            <AgGridReact
                className={'ag-theme-balham'}
                rowData={list}
                columnDefs={[// {
                    //     "department": "际鱼塘店",
                    //     "goodsname": "哇哈哈套餐",
                    //     "price": "30.0000",
                    //     "num": "1.0",
                    //     "total": "30.0000"
                    // }

                    { field: 'department', headerName: '部门', width: 150 }, {
                        field: 'goodsname',
                        headerName: '商品',
                        width: 150
                    }, { field: 'price', headerName: '单价', width: 150 }, {
                        field: 'num',
                        headerName: '数量',
                        width: 150
                    }, { field: 'total', headerName: '金额', width: 150 },
                    { field: 'remarks', headerName: '备注', width: 150 },
                    {
                        headerName: '操作',
                        cellRendererFramework: ({ data }) => <Button size={'small'} onClick={async () => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_Report_Business_Infos.HandleGoodsSalesMashupReportDetailed',
                                department: data.department,
                                goodsname: data.goodsname,
                                begintime: api.current.getValue('begintime'),
                                endtime: api.current.getValue('endtime'),
                            })

                            setDetaillist(rew.data.info)
                            setShow(true)
                        }} variant={'text'}>详情</Button>
                    }]}

                defaultColDef={{
                    sortable: true, resizable: true,
                }}
            />


            <Modal title={'详情'} size={'large'} visible={show} footer={() => <></>} style={{ top: '10%' }} onCancel={() => setShow(false)}>
                <Box height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className={'ag-theme-balham'}
                        rowData={detaillist}
                        columnDefs={[
                            // {
                            //     "addtime": "2023-06-09 11:17:57.613",
                            //     "department": "水部",
                            //     "operator": "admin",
                            //     "memberid": "test001",
                            //     "goodsname": "娃哈哈漏水赠送",
                            //     "price": ".0000",
                            //     "num": "1.0",
                            //     "total": ".0000",
                            //     "remarks": "漏水"
                            // }
                            //
                            { field: 'addtime', headerName: '时间', width: 150 },
                            { field: 'department', headerName: '部门', width: 150 },
                            { field: 'goodsname', headerName: '商品', width: 150 },
                            { field: 'price', headerName: '单价', width: 150 },
                            { field: 'num', headerName: '数量', width: 150 },
                            { field: 'total', headerName: '金额', width: 150 },
                            { field: 'remarks', headerName: '备注', width: 150 },
                            { field: 'operator', headerName: '操作员', width: 150 },


                        ]}

                        defaultColDef={{
                            sortable: true, resizable: true,
                        }}
                    />
                </Box>

            </Modal>
        </Box>
    </Box>);
};

export default HandleGoodsSalesMashupReport;