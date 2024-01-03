import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import translations from '../../utils/translations';


const SYQUserFollowUpTaskRecordTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户回访任务记录表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQUserFollowUpTaskRecordTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>


                <Form.Input field={'viplevel'} label={'星级'} />


                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}

                    localeText={translations}
                    columnDefs={[


                        { headerName: "添加时间", field: "addtime" ,width: 200},
                        { headerName: "归属部门", field: "attributiondepartment" ,width: 200},
                        { headerName: "客户类型", field: "customertype" ,width: 200},
                        { headerName: "星级", field: "viplevel" ,width: 200},
                        { headerName: "会员编号", field: "memberid" ,width: 200},
                        { headerName: "姓名", field: "name" ,width: 200},
                        { headerName: "业务员", field: "salesman" ,width: 200},
                        { headerName: "联系电话", field: "telephone" ,width: 200},
                        { headerName: "工作单位", field: "workplace" ,width: 200},
                        { headerName: "省", field: "province" ,width: 200,hide:true},
                        { headerName: "市", field: "city",width: 200,hide:true },
                        { headerName: "区", field: "area" ,width: 200,hide:true},
                        { headerName: "街道", field: "town" ,width: 200,hide:true},
                        { headerName: "地址", field: "address",width: 200 },
                        { headerName: "偏移距离", field: "offsetdistance" ,width: 200},
                        { headerName: "备注", field: "remarks",width: 200 },
                        { headerName: "完成备注", field: "complete_remarks" ,width: 200},
                        { headerName: "完成定位", field: "complete_positioning" ,width: 200},
                        { headerName: "安排时间", field: "arrangetime",width: 200 },
                        { headerName: "反馈时间", field: "feedbacktime",width: 200 },
                        { headerName: "服务人员", field: "serviceope",width: 200 },
                        { headerName: "状态", field: "state" ,width: 200},
                        {
                            headerName: "图片", field: "imgids",width: 200, cellRenderer: function (params) {
                                // 禁止跳转
                                return `<a  href="#">查看图片</a>`
                            }
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
    );
};

export default SYQUserFollowUpTaskRecordTable;


