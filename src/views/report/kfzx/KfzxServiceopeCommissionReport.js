import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxServiceopeCommissionReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>客服中心服务人员提成报表</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxServiceopeCommissionReport',
                    ...e,
                    department: JSON.stringify(e.department),
               })
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
                         // "[#1 - 17.75ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Report/Manage/Info.php(1333):    Srapp\\Model\\Curd\\QueryAction::QueryTable()    user_otherservices_record    SELECT serviceope,servicetype,complete_state,partslist,subsidy,evaluate FROM user_otherservices_record WHERE (companyid = '101') AND (feedbacktime>=?) AND (feedbacktime<?) AND (state IN (104)) AND (department = '衡阳店'); -- '2023-01-26', '2023-07-27'"
                         { headerName: "服务人员", field: "serviceope", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "服务类型", field: "servicetype", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "完成状态", field: "complete_state", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "配件清单", field: "partslist", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "补贴", field: "subsidy", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "评价", field: "evaluate", width: 100, sortable: true, filter: true, resizable: true, },
                    ]}

               />
          </Box>
     </Box>;
}

export default KfzxServiceopeCommissionReport;