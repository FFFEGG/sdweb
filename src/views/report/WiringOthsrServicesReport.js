import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";

const test = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [show, setShow] = useState(false)
    const [datalist, setDatalist] = useState([])

    const [keys, setKeys] = useState([])
    const api = useRef(null)

    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>接线售后服务报表</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.WiringOtherServicesReport',
                    ...e,
                    booking_department: JSON.stringify(e.booking_department),
                    booking_operator: JSON.stringify(e.booking_operator),
                })

                if (rew.data.info.length) {
                    rew.data.info.forEach(item => {
                        // 合计所有字段
                        item['小计'] = Object.values(item).reduce((a, b) => {
                            //console.log('小计字段', (b * 1));
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
                        keys.add(key);
                    });
                });

                let keysArray = Array.from(keys);
                console.log(keysArray);
                setKeys(keysArray);


            }} layout={"horizontal"} labelPosition={"inset"} onChange={e => console.log(e)}>

                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select onChange={e => {
                    // booking_operator自动选择 department 包含对应门店的人  e["二区店","二桥店"]]
                    const department = e
                    // console.log(department)
                    const operator = initData.OperatorList.filter(item => department.includes(item.department)).map(item => item.name)
                    // console.log(operator)

                    // const operator = initData.OperatorList.filter(item => item.department == e).map(item => item.name)
                    api.current.setValue('booking_operator', operator)


                }} field={'booking_department'} label={'预约部门'} multiple filter maxTagCount={3}>
                    {initData.DepartmentList.map((item, index) => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)}
                </Form.Select>
                <Form.Select field={'booking_operator'} label={'预约人'} multiple filter maxTagCount={3}>
                    {initData.OperatorList.map((item, index) => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)}
                </Form.Select>

                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={
                        keys.map(item => {
                            if (item === 'booking_department') {
                                return {
                                    headerName: '预约部门',
                                    field: item,
                                }
                            }
                            if (item === 'booking_operator') {
                                return {
                                    headerName: '预约人',
                                    field: item,
                                }
                            }

                            return {
                                headerName: item,
                                field: item,
                            }
                        })
                    }
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}

                    onCellDoubleClicked={async e => {
                        console.log(e)
                        if (e.column.instanceId > 1) {
                            // begintime	日期	必须			起始时间
                            // endtime	日期	必须			结束时间
                            // servicetype	字符串	可选			服务名称　json(["上门安检","预算"])
                            // booking_department	字符串	可选			预约部门(不传默认全部) JSON ["二区店","二桥店"]
                            // booking_operator	字符串	可选			预约人(不传默认全部) JSON ["张山","李四"]
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_Report_Business_Infos.WiringOtherServicesReportDetailed',
                                begintime: api.current.getValue('begintime'),
                                endtime: api.current.getValue('endtime'),
                                servicetype: JSON.stringify([e.colDef.field]),
                                booking_department: JSON.stringify([e.data.booking_department]),
                                booking_operator: JSON.stringify([e.data.booking_operator]),
                            })
                            setDatalist(rew.data.info)
                            setShow(true)


                        }
                    }}
                />

            </Box>
            <Modal title={'详细信息'} size="large" visible={show} footer={<></>} onCancel={() => setShow(false)} onOk={() => setShow(false)}>
                <Box width="100%" height="60vh" overflow={'scroll'}>
                    <AgGridReact

                        className="ag-theme-balham"
                        rowData={datalist}
                        columnDefs={

                            [

                                { headerName: '添加时间', field: 'addtime', },
                                { headerName: '预约部门', field: 'booking_department', },
                                { headerName: '预约人', field: 'booking_operator', },
                                { headerName: '服务类型', field: 'servicetype', },
                                { headerName: '数量', field: 'num', },
                                { headerName: '会员号', field: 'memberid', },
                                { headerName: '客户类型', field: 'customertype', },
                                { headerName: '客户姓名', field: 'name', },
                                { headerName: '客户地址', field: 'address', },
                                { headerName: '门店', field: 'department', },

                            ]
                        }
                    />
                </Box>

            </Modal>


        </Box>
    );
};

export default test;
