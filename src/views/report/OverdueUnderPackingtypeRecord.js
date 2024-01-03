import React, {useRef, useState} from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const OverdueUnderPackingtypeRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const ref = useRef()
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>超期欠包装物记录</Typography>
            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.OverdueUnderPackingtypeRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    department: JSON.stringify(e.department),

                })
                rew.data.info.push({
                    salesman: '合计',
                    num: rew.data.info.reduce((a, b) => a + parseInt(b.num), 0),
                    returnnum: rew.data.info.reduce((a, b) => a + parseInt(b.returnnum), 0),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>

                <Form.Select field='attributiondepartment' maxTagCount={1} multiple label="用户归属部门" filter style={{ width: 250 }}>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }

                </Form.Select>



                {/* <Form.Input field='date' type="date" label="核定基准时间(含)" initValue={moment().format('YYYY-MM-DD')} style={{ width: 250 }} /> */}
                <Form.Input field='days' type="number" label="超期天数(含)" style={{ width: 200 }} />


                <Form.Select field='retreattype' label="类型" filter style={{ width: 150 }}>
                    <Form.Select.Option value='全部'>全部</Form.Select.Option>
                    <Form.Select.Option value='票据-暂存'>票据-暂存</Form.Select.Option>
                    <Form.Select.Option value='票据-押金'>票据-押金</Form.Select.Option>
                    <Form.Select.Option value='票据-带入'>票据-带入</Form.Select.Option>
                </Form.Select>



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
                        // "[#1 - 30.23ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Report/Business/Info.php(305):    Srapp\\Model\\Curd\\QueryAction::QuerySQL()    curd_queryaction    select salesman,memberid,mode,packingtype,usetime,num,retreat_type,retreat_time,returnnum=case when retreat_type!='' then num else 0 end,1 as determine  from user_packingtype_warehouse where companyid=:companyid  and usetime>=:begintime and usetime<:endtime and mode=:mode   and ( (state=9 and  DATEDIFF(Day,usetime,retreat_time)>=1  ) or (state=8 and usetime<='2023-07-27' )  ); -- '101', '2023-07-28', '2023-07-29', '借用'"
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '方式', field: 'mode' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '欠瓶日期', field: 'usetime',valueGetter:({data}) => {
                            if (data.usetime) {
                                return data.usetime.substring(0, 10)
                            }
                            return  ''
                            } },
                        { headerName: '欠瓶数量', field: 'num' },
                        { headerName: '还瓶类型', field: 'retreat_type' },
                        { headerName: '还瓶时间', field: 'retreat_time' ,valueGetter:({data}) => {
                            if (data.retreat_time) {
                                return data.retreat_time.substring(0, 10)
                            }
                            return  ''
                            }},
                        { headerName: '回空数量', field: 'returnnum' },
                        // { headerName: '超期天数', field: 'days' },
                        // { headerName: '是否超期', field: 'determine' },
                    ]}
                />
            </Box>
        </Box>
    );
};

export default OverdueUnderPackingtypeRecord;
