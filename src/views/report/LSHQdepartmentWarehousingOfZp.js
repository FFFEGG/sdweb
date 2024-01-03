import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const LSHQdepartmentWarehousingOfZp = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>零售后勤 门店入库重瓶小计</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.LSHQdepartmentWarehousingOfZp',
                    ...e,
                    department: JSON.stringify(e.department)
               })
               console.log(rew)
               rew.data.info.map(item => {
                    item.price = 0.5
                    item.num = item.num * 1
                    item.total = item.num * item.price
               })
               rew.data.info.push({
                    department: '合计',
                    num: rew.data.info.reduce((a, b) => a + b.num, 0),
                    total: rew.data.info.reduce((a, b) => a + b.total, 0),
               })

               setList(rew.data.info)
          }}>
               <Form.Input type="date" field="begintime" label="开始时间" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input type="date" field="endtime" label="结束时间" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select multiple field="department" label="业务部门" filter>
                    {
                         initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }
               </Form.Select>
               <Button variant="contained" size="small" type="submit">查询</Button>
          </Form>
          <Box mt={3} height={'60vh'}>
               <AgGridReact
                    rowData={list}
                    className="ag-theme-balham"
                    columnDefs={[
                         { field: 'department', headerName: '门店', sortable: true, filter: true, },
                         { field: 'num', headerName: '数量', sortable: true, filter: true, },
                         { field: 'price', headerName: '单价', sortable: true, filter: true, },
                         { field: 'total', headerName: '合计', sortable: true, filter: true },
                    ]}
               />
          </Box>


     </Box>;
}

export default LSHQdepartmentWarehousingOfZp;