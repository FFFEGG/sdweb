import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'
import { toast } from 'react-toastify';


const BorrowPackingtypeOfUserReport = () => {
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [show, setShow] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取借用包装物报表(用户)</Box>

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.BorrowPackingtypeOfUserReport',
                    ...e,
                    salesman: JSON.stringify(e.salesman),
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />



                <Form.Select label={'办理部门'} multiple filter field={'department'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'归属部门'} multiple filter field={'attributiondepartment'} >
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} field={'salesman'} multiple filter maxTagCount={3}>
                    {
                        initData.OperatorList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>

                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[

                        // {
                        //     "userid": "8898",
                        //     "memberid": "017369",
                        //     "packingtype": "[\"5加仑PC桶\"]",
                        //     "beforetimeuse": 1,
                        //     "currenttimeuse": 0,
                        //     "currenttimeretreat": 0,
                        //     "surplus": 1
                        // }
                        { headerName: '用户ID', field: 'userid', hide: true },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '期间前使用', field: 'beforetimeuse' },
                        { headerName: '期间使用', field: 'currenttimeuse' },
                        { headerName: '期间退物资', field: 'currenttimeretreat' },
                        { headerName: '期末', field: 'surplus' },


                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    localeText={tanslations}
                    onCellDoubleClicked={async e => {
                        console.log(e);
                        //         url Srapp.Web_Report_Material_Infos.BorrowPackingtypeOfUserReportDetailed
                        //         userid	整型	必须			userid
                        //         begintime	日期	必须			起始时间
                        //         endtime	日期	必须			结束时间
                        //         project	枚举类型	必须		范围：期间前使用/期间使用/期间退物资	项目
                        // packingtype	字符串	必须			包装物名称 YSP118型钢瓶,18.6L水桶
                        if (e.colDef.headerName == '期间前使用' || e.colDef.headerName == '期间使用' || e.colDef.headerName == '期间退物资') {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_Report_Material_Infos.BorrowPackingtypeOfUserReportDetailed',
                                userid: e.data.userid,
                                begintime: api.current.getValue('begintime'),
                                endtime: api.current.getValue('endtime'),
                                project: e.colDef.headerName,
                                packingtype: e.data.packingtype
                            })
                            setsubList(rew.data.info)
                            setShow(true)
                        }

                    }}
                />
            </Box>

            <Modal visible={show} size="full-width" title={'详细信息'} onCancel={() => setShow(false)} footer={<></>}>
                <Box height={'60vh'} overflow={"scroll"}>
                    <AgGridReact

                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={[
                            // {
                            //     "addtime": "2023-07-27 16:33:17.017",
                            //     "mode": "借用",
                            //     "billno": "2869737922733714",
                            //     "name": "15KG借用",
                            //     "packingtype": "[\"YSP35.5型钢瓶\",\"YSP28.6型钢瓶\"]",
                            //     "num": "1",
                            //     "memberid": "049307",
                            //     "attributiondepartment": "零售青秀分公司",
                            //     "salesman": "",
                            //     "department": "七塘店",
                            //     "operator": "卢萍",
                            //     "remarks": ".",
                            //     "retreat_type": "",
                            //     "retreat_time": null,
                            //     "retreat_department": "",
                            //     "retreat_ope": "",
                            //     "refund_time": null,
                            //     "refund_department": "",
                            //     "refund_ope": "",
                            //     "refund_remarks": "",
                            //     "state": "已使用"
                            // }
                            { headerName: '时间', field: 'addtime' },
                            { headerName: '模式', field: 'mode' },
                            { headerName: '单据号', field: 'billno' },
                            { headerName: '名称', field: 'name' },
                            { headerName: '包装物类型', field: 'packingtype' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '归属部门', field: 'attributiondepartment' },
                            { headerName: '业务员', field: 'salesman' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '操作员', field: 'operator' },
                            { headerName: '备注', field: 'remarks' },
                            { headerName: '退物资类型', field: 'retreat_type' },
                            { headerName: '退物资时间', field: 'retreat_time' },
                            { headerName: '退物资部门', field: 'retreat_department' },
                            { headerName: '退物资操作员', field: 'retreat_ope' },
                            { headerName: '退款时间', field: 'refund_time' },
                            { headerName: '退款部门', field: 'refund_department' },
                            { headerName: '退款操作员', field: 'refund_ope' },
                            { headerName: '退款备注', field: 'refund_remarks' },
                            { headerName: '状态', field: 'state' },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true
                        }}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                        localeText={tanslations}
                    />
                </Box>
            </Modal>



        </Box>
    );
};

export default BorrowPackingtypeOfUserReport;

