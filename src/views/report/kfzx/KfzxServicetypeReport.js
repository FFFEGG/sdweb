import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const KfzxServicetypeReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     const transformData = (originalData) => {
          const result = {};

          originalData.forEach((item) => {
               const { serviceope, attributiondepartment, ordernum, state } = item;

               const name = serviceope || " "; // 如果姓名为空则标记为"未命名"

               if (!result[name]) {
                    result[name] = {
                         serviceope: name,
                         all_sy: 0, all_ls: 0, all_other: 0,
                         hz_sy: 0, hz_ls: 0, hz_other: 0,
                         qx_sy: 0, qx_ls: 0, qx_other: 0,
                         whz_sy: 0, whz_ls: 0, whz_other: 0,
                    };
               }

               const category = attributiondepartment.startsWith("商用") ? "sy"
                    : attributiondepartment.startsWith("零售") ? "ls"
                         : "other";

               const orderNum = parseInt(ordernum, 10);

               result[name][`all_${category}`] += orderNum;

               if (state === "已汇总") {
                    result[name][`hz_${category}`] += orderNum;
               } else if (state === "取消") {
                    result[name][`qx_${category}`] += orderNum;
               } else {
                    result[name][`whz_${category}`] += orderNum;
               }
          });

          return Object.values(result);
     };

     return <Box bgcolor={'white'} borderRadius={1} p={3}>
          <Box fontSize={18} mb={3}>客服中心服务类型情况表</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.KfzxServicetypeReport',
                    ...e,
                    department: JSON.stringify(e.department),
               })
               const arr = transformData(rew.data.info)
               if (arr.length) {
                    arr.push({
                         serviceope: '合计',
                         all_sy: arr.reduce((a, b) => a + b.all_sy, 0),
                         all_ls: arr.reduce((a, b) => a + b.all_ls, 0),
                         all_other: arr.reduce((a, b) => a + b.all_other, 0),
                         hz_sy: arr.reduce((a, b) => a + b.hz_sy, 0),
                         hz_ls: arr.reduce((a, b) => a + b.hz_ls, 0),
                         hz_other: arr.reduce((a, b) => a + b.hz_other, 0),
                         qx_sy: arr.reduce((a, b) => a + b.qx_sy, 0),
                         qx_ls: arr.reduce((a, b) => a + b.qx_ls, 0),
                         qx_other: arr.reduce((a, b) => a + b.qx_other, 0),
                         whz_sy: arr.reduce((a, b) => a + b.whz_sy, 0),
                         whz_ls: arr.reduce((a, b) => a + b.whz_ls, 0),
                         whz_other: arr.reduce((a, b) => a + b.whz_other, 0),
                    })

               }
               // console.log('arr', arr);
               setList(arr)

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
                         // {
                         //      "serviceope": "姓名",
                         //   "all_sy": "当月接单商用数量",
                         //   "all_ls": "当月接单零售数量",
                         //   "all_other": "当月接单其他数量",
                         //   "hz_sy": "当月汇总商用数量",
                         //   "hz_ls": "当月汇总零售数量",
                         //   "hz_other": "当月汇总其他数量",
                         //   "qx_sy": "当月取消商用数量",
                         //   "qx_ls": "当月取消零售数量",
                         //   "qx_other": "当月取消其他数量",
                         //   "whz_sy": "当月未汇总商用数量",
                         //   "whz_ls": "当月未汇总零售数量",
                         //   "whz_other": "当月未汇总其他数量",
                         // }
                         { headerName: "姓名", field: "serviceope" },
                         {
                              headerName: "当月接单数量", children: [
                                   { headerName: "商用", field: "all_sy" },
                                   { headerName: "零售", field: "all_ls" },
                                   { headerName: "其他", field: "all_other" },
                              ],

                         },
                         {
                              headerName: "当月汇总数量", children: [
                                   { headerName: "商用", field: "hz_sy" },
                                   { headerName: "零售", field: "hz_ls" },
                                   { headerName: "其他", field: "hz_other" },
                              ],
                         },
                         {
                              headerName: "当月取消数量", children: [
                                   { headerName: "商用", field: "qx_sy" },
                                   { headerName: "零售", field: "qx_ls" },
                                   { headerName: "其他", field: "qx_other" },
                              ],
                         },
                         {
                              headerName: "当月未汇总数量", children: [
                                   { headerName: "商用", field: "whz_sy" },
                                   { headerName: "零售", field: "whz_ls" },
                                   { headerName: "其他", field: "whz_other" },
                              ],
                         },

                    ]}
                    defaultColDef={{

                         resizable: true,
                         sortable: true,
                         flex: 1
                    }}

               />
          </Box>
     </Box>;
}

export default KfzxServicetypeReport;