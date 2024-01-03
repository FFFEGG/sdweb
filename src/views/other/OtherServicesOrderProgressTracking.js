import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {Button} from "@mui/material";

const OtherServicesOrderProgressTracking = () => {
        const initData = JSON.parse(localStorage.getItem('initData'))
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>服务订单进度跟踪查询</Box>
            {/*Srapp.Web_OtherServices_Infos.OtherServicesOrderProgressTracking*/}
            {/*获取服务订单进度跟踪查询*/}
            {/*接口地址：http://113.16.193.82:8203/?s=Srapp.Web_OtherServices_Infos.OtherServicesOrderProgressTracking*/}
            {/*POST*/}
            {/*接口描述：*/}

            {/*接口参数*/}
            {/*参数名字	类型	是否必须	默认值	其他	说明*/}
            {/*memberid	字符串	可选			会员号*/}
            {/*begintime	日期	必须			起始时间*/}
            {/*endtime	日期	必须			结束时间*/}
            {/*attributiondepartment	字符串	可选			用户归属部门(不传默认全部) JSON ["商用气开发一部","商用气开发二部"]*/}
            {/*salesman	字符串	可选			业务员*/}
            {/*workplace	字符串	可选			工作单位*/}

            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                console.log(e)
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_OtherServices_Infos.OtherServicesOrderProgressTracking',
                    ...e
                })
                setList(rew.data)
                }}>
                <Form.Input field={'memberid'} label={'会员号'} rules={[{required: true}]} />
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field={'attributiondepartment'} maxTagCount={1} multiple label={'用户归属部门'} style={{width:300}} filter>
                    {
                        initData?.DepartmentList?.filter(item=>item.name.includes('商')).map((item,index)=><Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select>
                <Form.Select field={'salesman'} multiple label={'业务员'} maxTagCount={2} style={{width:200}} filter>
                    {
                        initData?.OperatorList?.filter(item=>item.department.includes('商')).map((item,index)=><Form.Select.Option key={index} value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>
                <Form.Input field={'workplace'} label={'工作单位'} />
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>
            </Form>

            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "memberid": "778720",
                        //     "name": "王京强",
                        //     "telephone": "18078185989",
                        //     "workplace": "",
                        //     "address": "燕子岭小学饭堂（21已发承诺书）",
                        //     "attributiondepartment": "零售友爱分公司",
                        //     "salesman": "",
                        //     "booking_department": "预约中心",
                        //     "booking_operator": "周光平",
                        //     "arrangetime": "2023-12-07 12:28:01.000",
                        //     "accepttime": "2023-12-07 12:59:23.000",
                        //     "state": "已接单",
                        //     "imgids": [],
                        //     "serviceope": "李东刚",
                        //     "feedbacktime": null,
                        //     "feedback_remarks": ""
                        // }
                        {field: 'memberid', headerName: '会员号'},
                        {field: 'name', headerName: '姓名'},
                        {field: 'telephone', headerName: '电话'},
                        {field: 'workplace', headerName: '工作单位'},
                        {field: 'address', headerName: '地址'},
                        {field: 'attributiondepartment', headerName: '用户归属部门'},
                        {field: 'salesman', headerName: '业务员'},
                        {field: 'booking_department', headerName: '预约部门'},
                        {field: 'booking_operator', headerName: '预约人'},
                        {field: 'arrangetime', headerName: '安排时间'},
                        {field: 'accepttime', headerName: '接单时间'},
                        {field: 'state', headerName: '状态'},
                        // {field: 'imgids', headerName: '图片'},
                        {field: 'serviceope', headerName: '服务人员'},
                        {field: 'feedbacktime', headerName: '反馈时间'},
                        {field: 'feedback_remarks', headerName: '反馈备注'},
                        
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
                />
            </Box>
        </Box>
    );
};

export default OtherServicesOrderProgressTracking;
