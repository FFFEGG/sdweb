import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const SYQGYQUserResidualAirRecord = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const [keys, setKeys] = useState([])
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const pf = (str) => {
          if (srt) {
               return parseFloat(str).toFixed(2)
          }
          return 0
     }
     const api = useRef(null);


     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>商用气工业气用户余气记录</Box>
          <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQGYQUserResidualAirRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman)
               })


               setList(rew.data.info)


          }}>
               <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

               <Form.Select rules={[{ required: true, message: '必填' }]} field="attributiondepartment" label="归属部门" multiple filter maxTagCount={2}>
                    {
                         initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                              <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                         )
                    }
               </Form.Select>


               <Form.Input field="memberid" label="会员号" type="number" />

               <Form.Select field="salesman" label="开户业务员" multiple filter maxTagCount={2}>
                    {
                         initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                              <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                         )
                    }
               </Form.Select>
               <Box>
                    <Button size="small" variant="outlined" type="submit">搜索</Button>

               </Box>



          </Form>

          <Box height={'60vh'} mt={3} overflow={"scroll"}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={

                         [
                              // {
                              //      "addtime": "2023-07-27 08:28:26.000",
                              //      "serial": "800020230727082826911563363",
                              //      "memberid": "811612",
                              //      "type": "退瓶\\存瓶余气",
                              //      "goodsname": "45KG液化气",
                              //      "num": 1,
                              //      "code": "7102398",
                              //      "weight": "13.5",
                              //      "price": null,
                              //      "reason": "",
                              //      "attributiondepartment": "商用气开发二部",
                              //      "salesman": "蒋婵",
                              //      "department": "运输公司",
                              //      "deliveryman": "苏卫"
                              //  }

                              { headerName: '时间', field: 'addtime', width: 150, sortable: true, filter: true },
                              { headerName: '单据号', field: 'serial', width: 150, sortable: true, filter: true },
                              { headerName: '会员号', field: 'memberid', width: 150, sortable: true, filter: true },
                              { headerName: '余气类型', field: 'type', width: 150, sortable: true, filter: true },
                              { headerName: '商品', field: 'goodsname', width: 150, sortable: true, filter: true },
                              { headerName: '数量', field: 'num', width: 150, sortable: true, filter: true },
                              { headerName: '钢瓶号', field: 'code', width: 150, sortable: true, filter: true },
                              { headerName: '重量', field: 'weight', width: 150, sortable: true, filter: true },
                              { headerName: '单价', field: 'price', width: 150, sortable: true, filter: true },
                              { headerName: '余气原因', field: 'reason', width: 150, sortable: true, filter: true },
                              { headerName: '归属部门', field: 'attributiondepartment', width: 150, sortable: true, filter: true },
                              { headerName: '业务员', field: 'salesman', width: 150, sortable: true, filter: true },
                              { headerName: '业务部门', field: 'department', width: 150, sortable: true, filter: true },
                              { headerName: '经手人', field: 'deliveryman', width: 150, sortable: true, filter: true },
                         ]
                    }

               />
          </Box>

     </Box>;
}

export default SYQGYQUserResidualAirRecord;