import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const PSBNewUserStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 开户统计</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSBNewUserStatistics',
                         ...e,
                         deliveryman: JSON.stringify(e.deliveryman),
                         department: JSON.stringify(e.department),
                    })
                    // console.log(rew)
                    // rew.data.info.map(item => {
                    //      item.price = 15
                    //      item.num = item.num * 1
                    //      item.total = item.num * item.price
                    // })
                    // rew.data.info.push({
                    //      salesman: '合计',
                    //      num: rew.data.info.reduce((a, b) => a + b.num, 0),
                    //      total: rew.data.info.reduce((a, b) => a + b.total, 0),
                    // })
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
                    </Form.Select>
                    <Form.Select maxTagCount={2} multiple filter field="deliveryman" label="配送员">
                         {
                              initData.OperatorList.map((item, index) => {
                                   return <Form.Select.Option key={index} value={item.name}>{item.name}</Form.Select.Option>
                              })
                         }
                    </Form.Select> */}
                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={[
                              {
                                   headerName: `统计时间${api?.current?.getValue('begintime')}-${api?.current?.getValue('endtime')}`, children: [
                                        {
                                             headerName: `新开户数：${list.khnum}户`, children: [
                                                  {
                                                       headerName: `新开户销量: ${list.brand?.map(item => {
                                                            return item.goodsbrand + ':开户' + item.khnum
                                                       }).join(',')}`, children: [
                                                            {
                                                                 headerName: `门店开户数: ${list.department?.map(item => {
                                                                      return item.department + ':开户' + item.khnum
                                                                 }).join(',')}`, children: [
                                                                      // {
                                                                      //      "department": null,
                                                                      //      "userid": "28",
                                                                      //      "memberid": "678678678",
                                                                      //      "goodsbrand": "娃哈哈",
                                                                      //      "goodsname": "哇哈哈桶装水12L",
                                                                      //      "num": "1.0"
                                                                      //  }
                                                                      { field: 'memberid', headerName: '会员号', sortable: true, filter: true },
                                                                      { field: 'department', headerName: '部门', sortable: true, filter: true },
                                                                      { field: 'goodsbrand', headerName: '品牌', sortable: true, filter: true },
                                                                      { field: 'goodsname', headerName: '商品', sortable: true, filter: true },
                                                                      { field: 'num', headerName: '数量', sortable: true, filter: true },

                                                                 ]
                                                            }
                                                       ]
                                                  }
                                             ]
                                        },
                                   ]
                              },
                         ]}
                         defaultColDef={{
                              resizable: true,
                              sortable: true,
                         }}
                         rowData={list.user}

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
                              defaultColDef={{
                                   resizable: true,
                                   sortable: true,
                              }}
                         />
                    </Box>
               </Modal>
          </Box>
     )

}

export default PSBNewUserStatistics;