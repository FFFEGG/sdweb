import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";


const SYQUserFollowUpTable = () => {
    const [list,setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气用户回访统计表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Manage_Infos.SYQUserFollowUpTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item=>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.map(item=>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>


                <Form.Input field={'viplevel'} label={'星级'}   />


                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName:'业务员',field: 'serviceope'},
                        {headerName:'钢瓶修漏',field: '钢瓶修漏'},

                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e=>e.api.sizeColumnsToFit()}
                />
            </Box>



        </Box>
    );
};

export default SYQUserFollowUpTable;


