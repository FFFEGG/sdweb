import React, {useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button, Typography} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const OverdueSalesArrearsRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const ref = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>超期销售欠款记录</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.OverdueSalesArrearsRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department),

                })
                rew.data.info.map(item => {
                    item.state = item.collection_date ? '已回款': '未回款'
                    // item.determine = item.determine ? '是' : '否'
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Select field='department' filter maxTagCount={1} multiple label="业务部门" style={{width: 200}}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option
                                value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option
                                value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='attributiondepartment' maxTagCount={1} multiple label="用户归属部门" filter
                             style={{width: 250}}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option
                            value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>

                <Form.Select field='settlementmethod' label="欠款方式" initValue={'现结'} style={{width: 200}}>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
                </Form.Select>

                <Form.Select field='type' label="属性" style={{width: 200}}>
                    <Form.Select.Option value="全部">全部</Form.Select.Option>
                    <Form.Select.Option value="已回款">已回款</Form.Select.Option>
                    <Form.Select.Option value="未回款">未回款</Form.Select.Option>
                </Form.Select>

                {/* <Form.Input field='date' type="date" label="核定基准时间(含)" initValue={moment().format('YYYY-MM-DD')} style={{ width: 250 }} /> */}
                <Form.Input field='days' type="number" label="超期天数(含)" style={{width: 200}}/>


                <Button type="submit" variant="contained" size="small">搜索</Button>
                <Button sx={{ml:1}} onClick={()=>{
                    ref.current.api.exportDataAsCsv()
                }} type="button" variant="contained" size="small">导出</Button>

            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    ref={ref}
                    columnDefs={[
                        // "[#1 - 21.53ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Report/Business/Info.php(273):    Srapp\\Model\\Curd\\QueryAction::QuerySQL()    curd_queryaction    select addtime,memberid,workplace,attributiondepartment,salesman,pay_arrears+pay_cash-residual_air_total as total,collection_date,collection_department,collection_ope,8 as determine from business_sale_record where companyid=:companyid  and state=:state  and addtime>=:begintime and addtime<:endtime  and payment='月结支付'  and ( (collection_serial!='' and  DATEDIFF(Day,addtime,collection_date)>=8  ) or (collection_serial='' and addtime<='2023-07-20' )  ); -- '101', 1, '2023-01-28', '2023-07-29'"

                        {headerName: '时间', field: 'addtime',valueGetter:({data}) => data.addtime.substring(0,10)},
                        {headerName: '会员号', field: 'memberid'},
                        {headerName: '工作地点', field: 'workplace'},
                        {headerName: '用户归属部门', field: 'attributiondepartment'},
                        {headerName: '业务员', field: 'salesman'},
                        {headerName: '欠款金额', field: 'total'},
                        {headerName: '回款时间', field: 'collection_date',valueGetter:({data}) => {
                            if (data.collection_date) {
                                return data.collection_date.substring(0,10)
                            } else {
                                return ''
                            }
                            }
                    },
                        {headerName: '回款部门', field: 'collection_department'},
                        {headerName: '回款操作员', field: 'collection_ope'},
                        {headerName: '判断天数', field: 'determine'},
                        {
                            headerName: '计算天数', valueGetter: ({data}) => {
                                // {
                                //     "addtime": "2023-09-02 00:00:00.000",
                                //     "memberid": "851342",
                                //     "workplace": "山嘢烧烤",
                                //     "attributiondepartment": "商用气开发一部",
                                //     "salesman": "莫志明",
                                //     "total": "90.0000",
                                //     "collection_date": "2023-09-11 09:24:10.000",
                                //     "collection_department": "商用气开发一部",
                                //     "collection_ope": "唐运强",
                                //     "determine": "8"
                                // }
                                const collection_date = moment(data.collection_date).format('YYYY-MM-DD')
                                const addtime = moment(data.addtime).format('YYYY-MM-DD')
                                const days = moment(collection_date).diff(moment(addtime), 'days')
                                return days
                            }
                        },
                        {
                            headerName: '状态', field: 'state'
                        },

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

export default OverdueSalesArrearsRecord;
