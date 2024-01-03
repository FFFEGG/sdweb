import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import translations from "../../utils/translations";

const DeliverymanDeliveryDetailedSavepackingtype = () => {
     const [list, setList] = useState([])
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     return (
          <Box p={3} bgcolor={'#fff'} borderRadius={1}>
               <Box fontSize={18} mb={3}>工商用气调进出钢瓶明细表(存瓶)</Box>

               <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.DeliverymanDeliveryDetailedSavepackingtype',
                         ...e,
                         deliveryman: JSON.stringify(e.deliveryman)
                    })
                    setList(rew.data.info)

               }} layout={"horizontal"} labelPosition={"inset"}>
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Select field='deliveryman' label='配送员' multiple filter >
                         {
                              initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                                   <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                              )
                         }
                    </Form.Select>
                    <Form.Select field='mode' label='方式' filter initValue={'正常配送'} >
                         <Form.Select.Option value="正常配送">正常配送</Form.Select.Option>
                         <Form.Select.Option value="不计直调配送">不计直调配送</Form.Select.Option>
                    </Form.Select>
                    <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
               </Form>


               <Box height={'60vh'} mt={3} overflow={"scroll"}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={list}
                         localeText={translations}
                         columnDefs={[
                              { headerName: '时间', field: 'addtime' },
                              { headerName: '线路', field: 'line' },
                              { headerName: '钢瓶号', field: 'code' },
                              { headerName: '配送员', field: 'stockmen' },
                              { headerName: '会员号', field: 'memberid' },
                              { headerName: '包装物', field: 'packingtype' },
                              { headerName: '存瓶', field: 'num' },
                              { headerName: '部门', field: 'department' },
                         ]}
                         defaultColDef={{
                              resizable: true,
                              sortable: true
                         }}
                         onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    />
               </Box>



          </Box>
     );
};

export default DeliverymanDeliveryDetailedSavepackingtype;
