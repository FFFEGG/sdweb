import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const PSBWaterSummaryOfOutstandingDebts = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 水业务用户欠款汇总</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSBWaterSummaryOfOutstandingDebts',
                         ...e,
                         department: JSON.stringify(e.department)
                    })
                    if (rew.data.info.length) {
                         const hj = {
                              "workplace": "合计",
                              "pay_num": rew.data.info.reduce((a, b) => a + Number(b.pay_num), 0),
                              "pay_total": rew.data.info.reduce((a, b) => a + parseFloat(b.pay_total), 0),
                              "not_pay_num": rew.data.info.reduce((a, b) => a + parseFloat(b.not_pay_num), 0),
                              "not_pay_total": rew.data.info.reduce((a, b) => a + parseFloat(b.not_pay_total), 0),
                              "total": rew.data.info.reduce((a, b) => a + parseFloat(b.total), 0),
                         }

                         rew.data.info.push(hj)
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
                              // {
                              //      "userid": "4",
                              //      "workplace": "3",
                              //      "memberid": "123456",
                              //      "goodstype": "桶装水",
                              //      "pay_num": 0,
                              //      "pay_total": 0,
                              //      "not_pay_num": 9,
                              //      "not_pay_total": 112,
                              //      "total": 112
                              //  }
                              // { field: 'userid', headerName: '业务员ID', sortable: true, filter: true, },
                              { field: 'workplace', headerName: '单位', sortable: true, filter: true, },
                              { field: 'memberid', headerName: '会员号', sortable: true, filter: true, },
                              { field: 'goodstype', headerName: '商品类型', sortable: true, filter: true, },
                              { field: 'pay_num', headerName: '已付数量', sortable: true, filter: true, },
                              { field: 'pay_total', headerName: '已付金额', sortable: true, filter: true, },
                              { field: 'not_pay_num', headerName: '未付数量', sortable: true, filter: true, },
                              { field: 'not_pay_total', headerName: '未付金额', sortable: true, filter: true, },
                              { field: 'total', headerName: '应缴金额', sortable: true, filter: true, },


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

export default PSBWaterSummaryOfOutstandingDebts;