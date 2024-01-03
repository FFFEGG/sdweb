import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const LSHQUserSalesDetailsStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>零售后勤 销售详情统计报表</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.LSHQUserSalesDetailsStatistics',
                         ...e,
                         department: JSON.stringify(e.department)
                    })
                    console.log(rew)
                    rew.data.info.map(item => {
                         item.xj = item.lsjt + item.lssy + item.syq
                    })

                    rew.data.info.push({
                         department: '合计',
                         lsjt: rew.data.info.reduce((a, b) => a + b.lsjt, 0),
                         lssy: rew.data.info.reduce((a, b) => a + b.lssy, 0),
                         syq: rew.data.info.reduce((a, b) => a + b.syq, 0),
                         xj: rew.data.info.reduce((a, b) => a + b.xj, 0),

                    })
                    setList(rew.data.info)
               }}>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    {/* <Form.Select maxTagCount={2} multiple filter field="department" label="业务部门">
                         {
                              initData.DepartmentList.map((item, index) => {
                                   return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                              })
                         }
                    </Form.Select> */}
                    <Form.TreeSelect field="department" label="业务部门" treeData={new_department_byname} maxTagCount={2} multiple leafOnly filterTreeNode />
                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={[
                              // {
                              //      "department": "爱华店",
                              //      "goodsname": "12KG液化气",
                              //      "lsjt": 0,
                              //      "lssy": 0,
                              //      "syq": 0
                              // }

                              { field: 'department', headerName: '部门', sortable: true, filter: true, },
                              { field: 'goodsname', headerName: '商品名称', sortable: true, filter: true, },
                              { field: 'lsjt', headerName: '零售家庭', sortable: true, filter: true, },
                              { field: 'lssy', headerName: '零售商业', sortable: true, filter: true, },
                              { field: 'syq', headerName: '商用气', sortable: true, filter: true, },
                              { field: 'xj', headerName: '小计', sortable: true, filter: true, },

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
          </Box>
     )

}

export default LSHQUserSalesDetailsStatistics;