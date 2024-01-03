import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import tanslations from '../../utils/translations.json'


const SYQKHYHCXTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气客户查询表</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQKHYHCXTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                setList(rew.data.info)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'memberid'} label={'会员号'} width={150} />
                <Form.Input field={'workplace'} label={'工作单位'} width={150} />
                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>
                <Form.Select label={'用户类型'} field={'customertypeid'} >
                    {
                        initData.CustomertypeList.map(item =>
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>


                <Form.Input field={'viplevel'} label={'vip等级'} width={100} />

                <Form.Select label={'商品'} field={'goodsid'} >
                    {
                        initData.GoodsList.map(item =>
                            <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>
                <Form.Select label={'业务员'} field={'salesman'} multiple filter maxTagCount={3}>
                    {
                        initData.OperatorList.filter(item => item.quarters == '业务员').map(item =>
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
                    columnDefs={[

                        { headerName: '会员号', field: 'memberid' },
                        { headerName: '姓名', field: 'username' },
                        { headerName: '单位', field: 'workplace' },
                        { headerName: '地址', field: 'address' },
                        { headerName: '楼层', field: 'floor' },
                        { headerName: '超远补贴', field: 'addresssubsidy' },
                        { headerName: '归属部门', field: 'attributiondepartment' },
                        { headerName: '业务员', field: 'salesman' },
                        { headerName: '商品', field: 'goodsname' },
                        { headerName: '数量', field: 'num' },
                        { headerName: '小计', field: 'total' },
                        { headerName: '平均单价', field: 'averageunitprice' },

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

export default SYQKHYHCXTable;

