import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'

const SyqkhcxTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气客户查询表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQKHCXTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman),
                    customertypeid: JSON.stringify(e.customertypeid),
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Select label={'归属部门'} initValue={loginuser.login_departmentid} showClear={true} filter style={{ width: 200 }} field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>
                <Form.Select label={'用户类型'} maxTagCount={1} multiple placeholder="不选默认全部" showClear={true} filter style={{ width: 300 }} field={'customertypeid'} >
                    {
                        initData.CustomertypeList.map(item =>
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Select label={'业务员'} multiple maxTagCount={1} showClear={true} filter style={{ width: 200 }} field={'salesman'} >
                    {
                        initData.OperatorList.filter(item => item.department == loginuser.login_department).map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>

                <Form.Input field={'viplevel'} label={'vip等级'} width={100} />

                <Form.Select label={'状态'} field={'state'} initValue={'正常'} >
                    <Form.Select.Option value="正常">正常</Form.Select.Option>
                    <Form.Select.Option value="冻结">冻结</Form.Select.Option>
                </Form.Select>

                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        { headerName: '开户时间', field: 'addtime' },
                        { headerName: '移交时间', field: 'lasttransfertime' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'name' },
                        { headerName: '电话', field: 'telephone' },
                        { headerName: '工作单位', field: 'workplace' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '用户类型', field: 'customertype' },
                        { headerName: '星级', field: 'viplevel' },
                        { headerName: '最后交易时间', field: 'lasttransactiontime' },
                        { headerName: '回访信息', field: 'returnvisitinfo' },
                        { headerName: '最后回访时间1', field: 'returnvisittime1' },
                        { headerName: '最后回访时间2', field: 'returnvisittime2' },
                        { headerName: '最后安检时间', field: 'securitychecktime' },
                        { headerName: '状态', field: 'state' },
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    localeText={tanslations}
                />
            </Box>



        </Box>
    );
};

export default SyqkhcxTable;
