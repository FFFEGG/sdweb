import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxServiceopeInstallationBudgetCommissionReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>安装预算提成报表</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxServiceopeInstallationBudgetCommissionReport',
                    ...e,
                    department: JSON.stringify(e.department),
               })
               if (rew.data.info.length) {
                    rew.data.info.map((item) => {
                         // 格式化数据
                         item.securitycheck = item.securitycheck * 1
                         item.budget = item.budget * 1
                         item.galvanizedpipe = parseFloat(item.galvanizedpipe).toFixed(2)
                         item.aluminumplasticpipe = parseFloat(item.aluminumplasticpipe).toFixed(2)
                         item.rubberhose = parseFloat(item.rubberhose).toFixed(2)
                         item.alarm = parseFloat(item.alarm).toFixed(2)
                            item.manipulator = parseFloat(item.manipulator).toFixed(2)
                         item.completebudget = item.completebudget * 1
                         item.checkandaccept = item.checkandaccept * 1
                         item.subsidy = item.subsidy * 1
                         item.total = parseFloat(item.total).toFixed(2)
                         // return item
                    })
                    rew.data.info.push({
                         serviceope: '合计',
                         securitycheck: rew.data.info.reduce((total, item) => total + item.securitycheck, 0),
                         budget: rew.data.info.reduce((total, item) => total + item.budget, 0),
                         galvanizedpipe: rew.data.info.reduce((total, item) => total + item.galvanizedpipe * 1, 0).toFixed(2),
                         aluminumplasticpipe: rew.data.info.reduce((total, item) => total + item.aluminumplasticpipe * 1, 0).toFixed(2),
                         rubberhose: rew.data.info.reduce((total, item) => total + item.rubberhose * 1, 0).toFixed(2),
                       alarm: rew.data.info.reduce((total, item) => total + item.alarm * 1, 0).toFixed(2),
                       manipulator: rew.data.info.reduce((total, item) => total + item.manipulator * 1, 0).toFixed(2),
                         completebudget: rew.data.info.reduce((total, item) => total + item.completebudget, 0),
                         checkandaccept: rew.data.info.reduce((total, item) => total + item.checkandaccept, 0),
                         subsidy: rew.data.info.reduce((total, item) => total + item.subsidy, 0),
                         total: rew.data.info.reduce((total, item) => total + item.total * 1, 0).toFixed(2),
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
                         //      'serviceope'          => $value['serviceope'],
                         //      'securitycheck'             => 0, //安检
                         //      'budget'              => 0, //预算
                         //      'galvanizedpipe'      => 0, //镀锌管
                         //      'aluminumplasticpipe' => 0, //铝塑管
                         //      'rubberhose'          => 0, //胶管
                         //      'completebudget'      => 0,//完成预算
                         //      'checkandaccept'      => 0, //验收
                         //      'subsidy'             => $value['subsidy'], //补贴
                         //      'total'               => 0,
                         //  );

                         { headerName: '业务员', field: 'serviceope' },
                         { headerName: '安检', field: 'securitycheck' },
                         { headerName: '预算', field: 'budget' },
                         { headerName: '镀锌管', field: 'galvanizedpipe' },
                         { headerName: '铝塑管', field: 'aluminumplasticpipe' },
                         { headerName: '胶管', field: 'rubberhose' },
                            { headerName: '报警器', field: 'alarm' },
                            { headerName: '机械手', field: 'manipulator' },
                         { headerName: '完成预算', field: 'completebudget' },
                         { headerName: '验收', field: 'checkandaccept' },
                         { headerName: '补贴', field: 'subsidy' },
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

export default KfzxServiceopeInstallationBudgetCommissionReport;