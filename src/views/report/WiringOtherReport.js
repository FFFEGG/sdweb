import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";

const WiringOtherReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setlist] = useState([])
     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>接线综合报表</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.WiringOtherReport',
                    ...e,
                    booking_operator: JSON.stringify(e.booking_operator),
                    booking_department: JSON.stringify(e.booking_department)
               })
               if (rew.data.info.length) {
                    rew.data.info.forEach(item => {
                         // 合计所有字段
                         item['xj'] = item.yhqkh * 7 + item.tzskh * 5 + item.wjykh + item.smsp + item.bind
                    })


                    let hj = {
                    }

                    Object.keys(rew.data.info[0]).forEach(key => {
                         hj[key] = rew.data.info.reduce((a, b) => {
                              return a + (isNaN(b[key] * 1) ? 0 : (b[key] * 1))
                         }, 0)
                         hj['operator'] = '合计'
                    })

                    rew.data.info.push(hj)


               }
               setlist(rew.data.info)
          }}>
               <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select maxTagCount={2} multiple filter field="booking_department" label="预约部门">
                    {
                         initData.DepartmentList.map((item, index) => {
                              return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                         })
                    }
               </Form.Select>
               {/* booking_operator	字符串	可选			预约人(不传默认全部) JSON ["张山","李四"] */}
               <Form.Select maxTagCount={2} multiple filter field="booking_operator" label="预约人">
                    {
                         initData.OperatorList.map((item, index) => {
                              return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                         })
                    }
               </Form.Select>
               <Button variant="contained" type="submit" size="small">查询</Button>

          </Form>

          <Box mt={3} height={'60vh'}>
               <AgGridReact
                    className="ag-theme-balham"
                    columnDefs={[
                         // {
                         //      "operator": "胡东",
                         //      "yhqkh": 7,
                         //      "tzskh": 4,
                         //      "wjykh": 9,
                         //      "smsp": 7,
                         //      "bind": 0
                         // }
                         { headerName: '预约人', field: 'operator', sortable: true, filter: true, },
                         { headerName: '液化气开户', field: 'yhqkh', sortable: true, filter: true, },
                         { headerName: '桶装水开户', field: 'tzskh', sortable: true, filter: true, },
                         { headerName: '未交易用户', field: 'wjykh', sortable: true, filter: true, },
                         { headerName: '上门收瓶', field: 'smsp', sortable: true, filter: true, },
                         { headerName: '绑定', field: 'bind', sortable: true, filter: true, },
                         { headerName: '小计', field: 'xj', sortable: true, filter: true, },

                    ]}
                    rowData={list}
               />
          </Box>
     </Box>;
}

export default WiringOtherReport;