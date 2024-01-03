import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Dialog, Modal, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import translations from '../../utils/translations.json'

const WiringSalesReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [keys, setKeys] = useState([])
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const api = useRef()
    const [open, setOpen] = useState(false)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>接线销售报表</Typography>
            <Form getFormApi={form => { api.current = form }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.WiringSalesReport',
                    ...e,
                    booking_department: JSON.stringify(e.booking_department),
                    booking_operator: JSON.stringify(e.booking_operator),
                })

                if (rew.data.info.length) {
                    rew.data.info.forEach(item => {
                        // 合计所有字段
                        item['小计'] = Object.values(item).reduce((a, b) => {
                            console.log('小计字段', (b * 1));
                            return (a) + (isNaN(b * 1) ? 0 : (b * 1))
                        }, 0)
                    })
                    let hj = {

                    }

                    Object.keys(rew.data.info[0]).forEach(key => {
                        hj[key] = rew.data.info.reduce((a, b) => {
                            return a + (isNaN(b[key] * 1) ? 0 : (b[key] * 1))
                        }, 0)
                        hj['booking_department'] = '合计'
                    })

                    rew.data.info.push(hj)


                }

                setList(rew.data.info)


                let keys = new Set();

                rew.data.info.forEach(item => {

                    Object.keys(item).forEach(key => {

                        keys.add(key.replace('.', ','));
                        item[key.replace('.', ',')] = item[key];
                    });
                });

                let keysArray = Array.from(keys);
                console.log(keysArray);
                setKeys(keysArray);


            }} layout='horizontal' labelPosition="inset">
                <Form.Select field='booking_department' maxTagCount={1} multiple filter label="预约部门" style={{ width: 200 }}>
                    {
                        initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>
                <Form.Select field='booking_operator' maxTagCount={1} multiple label="预约人" style={{ width: 200 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field={'type'} label={'类型'} initValue={'商品数量'} style={{ width: 200 }}>
                    <Form.Select.Option value={'商品数量'}>商品数量</Form.Select.Option>
                    <Form.Select.Option value={'子订单条数'}>子订单条数</Form.Select.Option>
                </Form.Select>

                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />

                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={
                        keys.map(key => {
                            if (key === 'booking_department') {

                                return {
                                    headerName: '预约部门',
                                    field: key,
                                }
                            }
                            if (key === 'booking_operator') {

                                return {
                                    headerName: '预约人',
                                    field: key,
                                }
                            }
                            return {
                                headerName: key.replace(',', '.'),
                                field: key.toString(),
                            }
                        })
                        // [
                        //     { headerName: '18.9L巴马丽琅矿泉水', field: '18.9L\u5df4\u9a6c\u4e3d\u7405\u77ff\u6cc9\u6c34' },
                        // ]
                    }
                    onCellDoubleClicked={async e => {
                        console.log(e)
                        const post = api.current.getValues()

                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Business_Infos.WiringSalesReportDetailed',
                            ...post,
                            uniquekey: e.colDef.headerName,
                            booking_department: JSON.stringify([e.data.booking_department]),
                            booking_operator: JSON.stringify([e.data.booking_operator]),
                        })

                        setsubList(rew.data.info)
                        setOpen(true)
                    }}
                    defaultColDef={{
                        // flex: 1,
                        resizable: true,
                        sortable: true,
                    }}
                    onFirstDataRendered={(params) => {
                        params.api.sizeColumnsToFit();
                    }
                    }
                />
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    ...style,
                    bgcolor: '#fff',
                    overflow: 'scroll',
                    height: '60vh'
                }}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={[
                            { headerName: '时间', field: 'addtime' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '商品', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '单价', field: 'price' },
                            { headerName: '预约部门', field: 'booking_department' },
                            { headerName: '预约人', field: 'booking_ope' },
                        ]}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default WiringSalesReport;
