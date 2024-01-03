import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const SYQSalesKit = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>商业气销售简报</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.SYQSalesKit',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment)
               })
               setList(rew.data.info)
          }}>
               <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select rules={[
                    { required: true, message: '必填' }
               ]} field="type" label="类型" placeholder="配送指完成配送，销售指已回款">
                    <Form.Select.Option value="配送">配送</Form.Select.Option>
                    <Form.Select.Option value="销售">销售</Form.Select.Option>
               </Form.Select>
               <Form.Select multiple filter field="attributiondepartment" label="归属部门" placeholder="不传默认全部">
                    {
                         initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                              <Form.Select.Option key={item.id} value={item.name}>{item.label}</Form.Select.Option>
                         )
                    }
               </Form.Select>
               <Button variant="contained" size="small" type="submit">查询</Button>
          </Form>
          <Box mt={3} height={'60vh'} overflow={'scroll'}>

               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                         { headerName: '商品', field: 'goodsname' },
                         { headerName: '数量', field: 'num' },
                    ]}
                    defaultColDef={{
                         sortable: true,
                         filter: true,
                         resizable: true,
                    }}
               />
          </Box>

     </Box>;
}

export default SYQSalesKit;