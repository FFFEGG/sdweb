import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const SYQSalesRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setlist] = useState([])
    return (
        <Box>
            <Box fontSize={18} mb={3}>商用气销售记录</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Manage_Infos.SYQSalesRecord',
                    ...e,
                    attributiondepartment:JSON.stringify(e.attributiondepartment),
                    salesman:JSON.stringify(e.salesman)
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
                <Form.Input field={'memberid'} label={'会员号'} type={'text'}/>
                <Form.Select field={'attributiondepartment'} rules={[{required: true}]} style={{width: 200}} multiple maxTagCount={2} label={'归属部门'} filter>
                    {
                        initData.DepartmentList.filter(item => item.name.includes('商')).map(item =>
                            <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                        )
                    }
                </Form.Select>
                <Form.Select field={'salesman'} style={{width: 200}} multiple maxTagCount={2} label={'业务员'} filter>
                    {
                        initData.OperatorList.filter(item=>item.department.includes('商')).map(item =>
                            <Form.Select.Option value={item.name}>{item.department}-{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select>
                <Button variant={'contained'} size={'small'} type={'submit'}>查询</Button>

            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "attributiondepartment": "商用气开发一部",
                        //     "month": "10",
                        //     "memberid": "838586",
                        //     "goodsname": "12KG液化气",
                        //     "num": "1.0",
                        //     "residual_air_weight": "0.0",
                        //     "marketprice": "125.0000",
                        //     "price": "95.0000",
                        //     "total": "95.0000",
                        //     "pay_coupon": "5.0000",
                        //     "pay_online": "90.0000",
                        //     "username": "刘光寿",
                        //     "telephone": "13878061178",
                        //     "workplace": "遵义羊肉粉",
                        //     "address": "淡村店旁遵义羊肉粉",
                        //     "salesman": "黄丹梦",
                        //     "developsalesman": "黎惠红"
                        // }
                        {headerName: '归属部门',field:'attributiondepartment'},
                        {headerName: '月份',field:'month'},
                        {headerName: '会员号',field:'memberid'},
                        {headerName: '商品名称',field:'goodsname'},
                        {headerName: '数量',field:'num'},
                        {headerName: '退残重量',field:'residual_air_weight'},
                        {headerName: '零售价',field:'marketprice'},
                        {headerName: '实际交易单价',field:'price'},
                        {headerName: '实际换气金额',field:'total'},
                        {headerName: '优惠券',field:'pay_coupon'},
                        // {headerName: '优惠金额',valueGetter: params => parseFloat(params.data.marketprice) - parseFloat(params.data.price),width:80},
                        //
                        {headerName: '微信支付金额',field:'pay_online'},
                        {headerName: '姓名',field:'username'},
                        {headerName: '电话',field:'telephone'},
                        {headerName: '工作单位',field:'workplace'},
                        {headerName: '地址',field:'address'},
                        {headerName: '业务员',field:'salesman'},
                        {headerName: '开户业务员',field:'developsalesman'},
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

export default SYQSalesRecord;
