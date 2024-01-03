import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SCBResidualAirRecord = () => {

    const [list,setlist] = useState([])
    return (
        <Box>
            <Box fontSize={18} mb={3}>市场部查询运输公司余气记录</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Manage_Infos.SCBResidualAirRecord',
                    ...e
                })
                // console.log(rew.data
                setlist(rew.data.info)
            }}>
                {/*begintime	日期	必须			开始时间*/}
                {/*endtime	日期	必须			结束时间*/}
                {/*memberid	字符串	可选			会员号*/}
                {/*attributiondepartment	字符串	必须			归属部门 JSON ["商用气开发一部","商用气开发二部"]*/}
                {/*salesman	字符串	可选			业务员 JSON ["张三","李四"]*/}
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>

                <Button variant={'contained'} size={'small'} type={'submit'}>查询</Button>

            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "addtime": "2023-10-07 21:03:22.000",
                        //     "memberid": "845231",
                        //     "goodsname": "45KG液化气",
                        //     "deliveryman": "黄孙华",
                        //     "residual_air_remarks": "[{\"id\":\"1760396\",\"code\":\"996397\",\"weight\":1.4,\"grant_serial\":\"800220231007160902472669268\",\"reason\":\"正常残留\"}]",
                        //     "address": "邕宁区新邕路198号君华锦云16栋",
                        //     "weight": 1.4,
                        //     "code": "996397",
                        //     "reason": "正常残留",
                        //     "life": "2020-10-26 10:29:00.000"
                        // }
                        {field: 'addtime', headerName: '订单时间', },
                        {field: 'memberid', headerName: '会员号', },
                        {field: 'goodsname', headerName: '商品名称', },
                        {field: 'weight', headerName: '重量', },
                        {field: 'reason', headerName: '退残原因', },
                        {field: 'deliveryman', headerName: '司机', },

                        {field: 'code', headerName: '钢瓶编码', },

                        {field: 'life', headerName: '生产日期', },
                        {field: 'address', headerName: '地址', },

                        {field: 'telephone', headerName: '电话', },
                        {field: 'accountopeningtime', headerName: '开始时间', },
                        {field: 'viplevel', headerName: '等级', },




                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>

        </Box>
    );
};

export default SCBResidualAirRecord;
