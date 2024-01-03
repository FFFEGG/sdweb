import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'

const GetOpeMinLoginRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setList] = useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取员工当天第一条登录记录列表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Other_Infos.GetOpeMinLoginRecord',
                    ...e,
                    department: JSON.stringify(e.department)
                })
                setList(rew.data)


            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200}}>
                    {

                        ( loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' ) ?

                            initData.DepartmentList.map(item=><Form.Select.Option value={item.name}>{ item.label }</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{ loginuser.login_department }</Form.Select.Option>
                    }

                </Form.Select>

                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName: '登录时间',field: 'addtime'},
                        {headerName: '部门',field: 'department'},
                        {headerName: '姓名',field: 'name'},
                        {headerName: '工号',field: 'opeid'},
                        {headerName: '角色',field: 'quarters'},
                        {headerName: '登录端',field: 'soure'},
                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true
                    }}
                    localeText={tanslations}
                />
            </Box>



        </Box>
    );
};

export default GetOpeMinLoginRecord;
