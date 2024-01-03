import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxIncompleteWorkDetail = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>客服中心 未完成作业明细</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxIncompleteWorkDetail',
                    ...e,
                    department: JSON.stringify(e.department),
                    option: JSON.stringify([
                         "钢瓶离火源或灶具太近",
                         "钢瓶存放位置有插座或电源开关",
                         "钢瓶存放位置太密闭，通风不良",
                         "钢瓶放在卫生间使用",
                         "胶管接三通使用",
                         "胶管超长",
                         "胶管老化",
                         "胶管穿墙",
                         "减压阀老化",
                         "减压阀漏气",
                         "胶管与减压阀、灶具连接处未加喉码固定",
                         "热水器放在卫生间",
                         "热水器安装场所通风不良",
                         "热水器未安装烟管使用",
                         "热水器老化破损，超期限使用",
                         "灶具老化破损，超期限使用",
                         "瓶装气、管道气混合使用",
                         "建议安装燃气泄漏报警器",
                         "建议安装一氧化碳报警器",
                         "未安装减压阀使用",
                         "建议按新国标进行整改"
                    ]),

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
                         // "[#1 - 68.33ms - SQL]/www/wwwroot/suda-2-api/src/srapp/Domain/Report/Manage/Info.php(1290):    Srapp\\Model\\Curd\\QueryAction::QueryTable()    user_otherservices_record    SELECT addtime,servicetype,memberid,name,workplace,address,telephone,complete_detailed,num,serviceope,remarks,complete_remarks,partslist,feedbacktime,salesman FROM user_otherservices_record WHERE (companyid = '101') AND (feedbacktime>=?) AND (feedbacktime<?) AND (state IN (104)) AND (department = '朝阳店') AND (complete_state = '未完成'); -- '2023-01-26', '2023-07-27'"
                         { headerName: "日期", field: "addtime", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "业务类型", field: "servicetype", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "会员号", field: "memberid", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "姓名", field: "name", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "工作单位", field: "workplace", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "地址", field: "address", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "电话", field: "telephone", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "完成详情", field: "complete_detailed", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "数量", field: "num", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "服务人员", field: "serviceope", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "备注", field: "remarks", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "完成备注", field: "complete_remarks", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "配件清单", field: "partslist", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "反馈时间", field: "feedbacktime", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "业务员", field: "salesman", width: 100, sortable: true, filter: true, resizable: true, },
                         { headerName: "汇总项目", field: "feedback_project", width: 100, sortable: true, filter: true, resizable: true, },

                    ]}

               />
          </Box>
     </Box>;
}

export default KfzxIncompleteWorkDetail;