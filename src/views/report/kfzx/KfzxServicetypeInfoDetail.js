import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxServicetypeInfoDetail = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>客服中心服务类型情况表(明细)</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxServicetypeInfoDetail',
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
               <Form.Select label="服务类型" field="servicetype" >
                    {
                         initData.ServiceTypeList.filter(item => item.type == 2).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

               </Form.Select>
               <Button variant="contained" size="small" type="submit">查询</Button>

          </Form>


          <Box mt={3} height={'60vh'} overflow={'scroll'}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                         // "[#1 - 18.92ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Report/Manage/Info.php(1314):    Srapp\\Model\\Curd\\QueryAction::QueryTable()    user_otherservices_record    SELECT arrivetime,servicetype,serviceope,memberid,telephone,address,complete_detailed,complete_remarks FROM user_otherservices_record WHERE (companyid = '101') AND (arrivetime>=?) AND (arrivetime<?) AND (state IN (104)) AND (department = '衡阳店'); -- '2023-07-26', '2023-07-27'"
                         { headerName: "日期", field: "arrivetime", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "服务类型", field: "servicetype", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "服务人员", field: "serviceope", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "会员编号", field: "memberid", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "电话", field: "telephone", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "地址", field: "address", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "作业内容", field: "complete_detailed", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "完成备注", field: "complete_remarks", width: 100, sortable: true, filter: true, resizable: true, },

                    ]}

               />
          </Box>
     </Box>;
}

export default KfzxServicetypeInfoDetail;