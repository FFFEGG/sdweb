import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const PSByyzxCommissionStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 预约中心接线员提成</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSByyzxCommissionStatistics',
                         ...e,
                         department: JSON.stringify(e.department)
                    })
                    if (rew.data.info.length) {
                         rew.data.info.map(item => {
                              item.wirenum = Number(item.wirenum)
                              item.wireprice = parseFloat(item.wireprice).toFixed(2)
                              item.wirecommission = parseFloat(item.wirecommission).toFixed(2)
                         })
                         rew.data.info.push({
                              "operator": "合计",
                              "wirenum": rew.data.info.reduce((a, b) => a + Number(b.wirenum), 0),

                              "wirecommission": rew.data.info.reduce((a, b) => a + parseFloat(b.wirecommission), 0).toFixed(2),
                              "newusersalestotal": rew.data.info.reduce((a, b) => a + parseFloat(b.newusersalestotal), 0),

                              "newusersalescommission": rew.data.info.reduce((a, b) => a + parseFloat(b.newusersalescommission), 0).toFixed(2)
                         })
                    }
                    setList(rew.data.info)
               }}>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />

                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={[
                              // 'operator'               => $value['operator'],
                              // 'wirenum'                => 0,//接线数量
                              // 'wireprice'              => $wireprice,//接线单价
                              // 'wirecommission'         => 0,//接线提成
                              // 'newusersalestotal'      => 0,//新开用户消费总金额
                              // 'newusersaleparameter'   => $newusersaleparameter,//新开用户消费提成参数
                              // 'newusersalescommission' => 0,//新开用户消费提成
                              { field: 'operator', headerName: '接线员', sortable: true, filter: true, },
                              { field: 'wirenum', headerName: '接线数量', sortable: true, filter: true, },
                              { field: 'wireprice', headerName: '接线单价', sortable: true, filter: true, },
                              { field: 'wirecommission', headerName: '接线提成', sortable: true, filter: true, },
                              { field: 'newusersalestotal', headerName: '新开用户消费总金额', sortable: true, filter: true, },
                              { field: 'newusersaleparameter', headerName: '新开用户消费提成参数', sortable: true, filter: true, },
                              { field: 'newusersalescommission', headerName: '新开用户消费提成', sortable: true, filter: true, },
                              {
                                   headerName: '合计', sortable: true, filter: true, valueGetter: ({ data }) => (parseFloat(data.wirecommission) + parseFloat(data.newusersalescommission)).toFixed(2)
                              }

                         ]}
                         rowData={list}
                    // onCellDoubleClicked={async e => {
                    //      const { colDef, value } = e
                    //      if (colDef.field === 'salesman') {
                    //           const rew = await request('post', '/api/getInfo', {
                    //                url: 'Srapp.Web_Report_Business_Infos.LSHQUserNewAccountStatisticsDetails',
                    //                begintime: api.current.getValue('begintime'),
                    //                endtime: api.current.getValue('endtime'),
                    //                salesman: value
                    //           })
                    //           setShow(true)
                    //           setSublist(rew.data.info)
                    //      }
                    // }}
                    />
               </Box>



               <Modal title="开户详情" visible={show} footer={null} size="large" onCancel={() => setShow(false)} onOk={() => setShow(false)}>
                    <Box height={'60vh'}>
                         <AgGridReact
                              className="ag-theme-balham"
                              columnDefs={[
                                   // {
                                   //      "addtime": "2023-06-10 00:00:00.000",
                                   //      "memberid": "4918348",
                                   //      "username": "爱爱",
                                   //      "customertype": "家庭用户",
                                   //      "address": "菠萝岭",
                                   //      "goodsname": "12KG液化气",
                                   //      "marketprice": "110.0000",
                                   //      "price": "110.0000",
                                   //      "salesprice": "110.0",
                                   //      "num": "1.0",
                                   //      "attributiondepartment": "零售江南分公司",
                                   //      "department": "二区店",
                                   //      "deliveryman": "梁正铜",
                                   //      "accountopeningtime": "2023-04-07 10:38:05.880",
                                   //      "developsalesman": "营业员",
                                   //      "rowid": "1"
                                   // }
                                   { field: 'addtime', headerName: '开户时间', sortable: true, filter: true, },
                                   { field: 'memberid', headerName: '会员号', sortable: true, filter: true, },
                                   { field: 'username', headerName: '用户名', sortable: true, filter: true, },
                                   { field: 'customertype', headerName: '客户类型', sortable: true, filter: true, },
                                   { field: 'address', headerName: '地址', sortable: true, filter: true, },
                                   { field: 'goodsname', headerName: '商品名称', sortable: true, filter: true, },
                                   { field: 'marketprice', headerName: '市场价', sortable: true, filter: true, },
                                   { field: 'price', headerName: '单价', sortable: true, filter: true, },
                                   { field: 'salesprice', headerName: '销售价', sortable: true, filter: true, },
                                   { field: 'num', headerName: '数量', sortable: true, filter: true, },
                                   { field: 'attributiondepartment', headerName: '归属部门', sortable: true, filter: true, },
                                   { field: 'department', headerName: '业务部门', sortable: true, filter: true, },
                                   { field: 'deliveryman', headerName: '送气工', sortable: true, filter: true, },
                                   { field: 'accountopeningtime', headerName: '开户时间', sortable: true, filter: true, },
                                   { field: 'developsalesman', headerName: '开户员', sortable: true, filter: true, },


                              ]}
                              rowData={sublist}
                         />
                    </Box>
               </Modal>
          </Box >
     )

}

export default PSByyzxCommissionStatistics;