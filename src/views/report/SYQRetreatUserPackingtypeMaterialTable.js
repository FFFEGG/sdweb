import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'


const SYQRetreatUserPackingtypeMaterialTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [departmentid, setdepartmentid] = useState('')
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户办理包装物退物资表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQRetreatUserPackingtypeMaterialTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select rules={[{ required: true, message: '必填' }]} label={'归属部门'} onChange={e => {
                    console.log(e)
                    setdepartmentid(e)
                }} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.filter(item => item.departmentid == departmentid).map(item =>
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
                    localeText={tanslations}
                    columnDefs={[
                        // {
                        //     "userid": "144194",
                        //     "memberid": "165888",
                        //     "name": "雷兆春",
                        //     "customertypeid": "2",
                        //     "viplevel": "3",
                        //     "telephone": "17677153715",
                        //     "workplace": "三燃",
                        //     "completeaddress": "广西壮族自治区南宁市青秀区白沙北四里116号401房",
                        //     "attributiondepartmentid": "91",
                        //     "salesman": "admin",
                        //     "retreat_remarks": "",
                        //     "salesinfo": [
                        //         {
                        //             "goodsname": "4KG液化气",
                        //             "num": "1.0"
                        //         }
                        //     ],
                        //     "customertype": "商业用户",
                        //     "attributiondepartment": "商用气开发二部"
                        // }
                        // { headerName: '用户ID', field: 'userid' },
                        { headerName: '开户时间', field: 'addtime' },
                        { headerName: '办理时间', field: 'processingtime' },

                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '客户类型', field: 'customertype' },
                        { headerName: '星级', field: 'viplevel' },
                        { headerName: '电话', field: 'telephone' },
                        { headerName: '工作单位', field: 'workplace' },
                        { headerName: '地址', field: 'completeaddress' },

                        { headerName: '业务员', field: 'salesman' },

                        {
                            headerName: '上月换气量', children: [

                                { headerName: '45KG', valueGetter: params => params.data.salesinfo.filter(item => item.goodsname == '45KG液化气').map(item => item.num).reduce((a, b) => a + b * 1, 0) },
                                { headerName: '12KG', valueGetter: params => params.data.salesinfo.filter(item => item.goodsname == '12KG液化气').map(item => item.num).reduce((a, b) => a + b * 1, 0) },
                                { headerName: '4KG', valueGetter: params => params.data.salesinfo.filter(item => item.goodsname == '4KG液化气').map(item => item.num).reduce((a, b) => a + b * 1, 0) },


                            ]
                        },

                        { headerName: '退款原因', field: 'retreat_remarks' },

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box >
    );
};

export default SYQRetreatUserPackingtypeMaterialTable;


