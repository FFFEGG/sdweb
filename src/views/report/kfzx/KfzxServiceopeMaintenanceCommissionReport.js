import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxServiceopeMaintenanceCommissionReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>维修人员提成</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxServiceopeMaintenanceCommissionReport',
                    ...e,
                    department: JSON.stringify(e.department),
               })
               if (rew.data.info.length) {
                    rew.data.info.map((item) => {
                         // 格式化数据

                         item.maintenancenum = item.maintenancenum * 1
                         item.maintenancecommission = parseFloat(item.maintenancecommission).toFixed(2)
                         item.indoor = item.indoor * 1
                         item.indoorcommission = parseFloat(item.indoorcommission).toFixed(2)
                         item.total = parseFloat(item.total).toFixed(2)

                         // return item
                    })
                    rew.data.info.push({
                         serviceope: '合计',
                         maintenancenum: rew.data.info.reduce((total, item) => total + parseFloat(item.maintenancenum), 0),
                         maintenancecommission: rew.data.info.reduce((total, item) => total + parseFloat(item.maintenancecommission), 0).toFixed(2),
                         indoor: rew.data.info.reduce((total, item) => total + item.indoor, 0),
                         indoorcommission: rew.data.info.reduce((total, item) => total + parseFloat(item.indoorcommission), 0).toFixed(2),
                         total: rew.data.info.reduce((total, item) => total + parseFloat(item.total), 0).toFixed(2),
                    })
               }
               setList(rew.data.info)

          }}>
               {
                    /*  begintime	日期	必须			起始时间
                         endtime	日期	必须			结束时间
                         department	字符串	可选			业务部门(默认本部门) JSON ["鲤湾店","二区店"] 
                    */
               }
               <Form.Input label="起始时间" field="begintime" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input label="结束时间" field="endtime" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.TreeSelect label="业务部门" field="department" multiple leafOnly treeData={new_department_byname} maxTagCount={1} />
               <Button variant="contained" size="small" type="submit">查询</Button>

          </Form>


          <Box mt={3} height={'60vh'} overflow={'scroll'}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                         // $temp=array(
                         //      'serviceope'            => $value['serviceope'],
                         //      'maintenancenum'        => $value['num'], //维修数量
                         //      'maintenancecommission' => $value['num']*11.21, //维修提成
                         //      'indoor'                => 0, //上门次数
                         //      'indoorcommission'      => 0, //上门提成
                         //      'total'                 => 0,  
                         //  );
                         { headerName: '业务员', field: 'serviceope' },
                         { headerName: '维修数量', field: 'maintenancenum' },
                         { headerName: '维修提成', field: 'maintenancecommission' },
                         { headerName: '上门次数', field: 'indoor' },
                         { headerName: '上门提成', field: 'indoorcommission' },
                         { headerName: '小计', field: 'total' },




                    ]}
                    defaultColDef={{
                         flex: 1,
                         // minWidth: 100,
                         resizable: true,
                         sortable: true,
                    }}

               />
          </Box>
     </Box>;
}

export default KfzxServiceopeMaintenanceCommissionReport;