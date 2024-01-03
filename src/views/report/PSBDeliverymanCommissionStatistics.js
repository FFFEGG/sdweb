import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";
import printJS from "print-js";

const PSBDeliverymanCommissionStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 配送员送水提成</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSBDeliverymanCommissionStatistics',
                         ...e,
                         deliveryman: JSON.stringify(e.deliveryman),
                         department: JSON.stringify(e.department),
                    })
                    // console.log(rew)
                    rew.data.info.map(item => {
                         item.bigbarrelcommission = parseFloat(item.bigbarrelcommission).toFixed(2)
                        item.smallbarrelcommission = parseFloat(item.smallbarrelcommission).toFixed(2)
                        item.supportingwatercommission = parseFloat(item.supportingwatercommission).toFixed(2)
                        item.verticalwaterdispensercommission = parseFloat(item.verticalwaterdispensercommission).toFixed(2)
                        item.desktopwaterdispensercommission = parseFloat(item.desktopwaterdispensercommission).toFixed(2)
                        item.superhighfee = parseFloat(item.superhighfee).toFixed(2)
                        // valueGetter: params => {
                        //
                        //     let sum = 0
                        //     sum += parseFloat(params.data.bigbarrelcommission)
                        //     sum += parseFloat(params.data.smallbarrelcommission)
                        //     sum += parseFloat(params.data.supportingwatercommission)
                        //     sum += parseFloat(params.data.verticalwaterdispensercommission)
                        //     sum += parseFloat(params.data.desktopwaterdispensercommission)
                        //     sum += parseFloat(params.data.superhighfee)
                        //     return sum.toFixed(2)
                        //
                        // }
                        item.total = (parseFloat(item.bigbarrelcommission) + parseFloat(item.smallbarrelcommission) + parseFloat(item.supportingwatercommission) + parseFloat(item.verticalwaterdispensercommission) + parseFloat(item.desktopwaterdispensercommission) + parseFloat(item.superhighfee)).toFixed(2)


                    })
                    // rew.data.info.push({
                    //      salesman: '合计',
                    //      num: rew.data.info.reduce((a, b) => a + b.num, 0),
                    //      total: rew.data.info.reduce((a, b) => a + b.total, 0),
                    // })
                    if (rew.data.info.length) {
                         rew.data.info.push({
                              department: '合计',
                                deliveryman: '',
                              bigbarrelnum: rew.data.info.reduce((a, b) => a + parseFloat(b.bigbarrelnum), 0),
                              bigbarrelcommission: rew.data.info.reduce((a, b) => a + parseFloat(b.bigbarrelcommission), 0).toFixed(2),
                              smallbarrelnum: rew.data.info.reduce((a, b) => a + parseFloat(b.smallbarrelnum), 0),
                              smallbarrelcommission: rew.data.info.reduce((a, b) => a + parseFloat(b.smallbarrelcommission), 0).toFixed(2),
                              supportingwaternum: rew.data.info.reduce((a, b) => a + parseFloat(b.supportingwaternum), 0),
                              supportingwatercommission: rew.data.info.reduce((a, b) => a + parseFloat(b.supportingwatercommission), 0).toFixed(2),
                              verticalwaterdispensernum: rew.data.info.reduce((a, b) => a + parseFloat(b.verticalwaterdispensernum), 0),
                              verticalwaterdispensercommission: rew.data.info.reduce((a, b) => a + parseFloat(b.verticalwaterdispensercommission), 0).toFixed(2),
                              desktopwaterdispensernum: rew.data.info.reduce((a, b) => a + parseFloat(b.desktopwaterdispensernum), 0),
                              desktopwaterdispensercommission: rew.data.info.reduce((a, b) => a + parseFloat(b.desktopwaterdispensercommission), 0).toFixed(2),
                              superhighfee: rew.data.info.reduce((a, b) => a + parseFloat(b.superhighfee), 0).toFixed(2),
                                total: rew.data.info.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2),
                         })

                    }
                    setList(rew.data.info)
               }}>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Select maxTagCount={2} multiple filter field="department" label="业务部门">
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
                    </Form.Select>
                    <Button variant="contained" type="submit" size="small">查询</Button>
                    <Button variant="contained" type="button" sx={{ml:2}} onClick={()=> {
                        printJS({
                            printable: list,
                            properties: [
                                { field: 'department', displayName: '业务部门' },
                                { field: 'deliveryman', displayName: '配送员' },
                                { field: 'bigbarrelnum', displayName: '大桶数量' },
                                { field: 'bigbarrelcommission', displayName: '大桶提成' },
                                { field: 'smallbarrelnum', displayName: '小桶数量' },
                                { field: 'smallbarrelcommission', displayName: '小桶提成' },
                                { field: 'supportingwaternum', displayName: '支装水' },
                                { field: 'supportingwatercommission', displayName: '支装水提成' },
                                { field: 'verticalwaterdispensernum', displayName: '立式水机数量' },
                                { field: 'verticalwaterdispensercommission', displayName: '立式水机提成' },
                                { field: 'desktopwaterdispensernum', displayName: '台式水机数量' },
                                { field: 'desktopwaterdispensercommission', displayName: '台式水机提成' },
                                { field: 'superhighfee', displayName: '超高费' },
                                { field: 'total', displayName: '合计' },
                            ],
                            type: 'json',
                            header: '<h3 class="custom-h3">配送部 配送员送水提成</h3>',
                            style: '.custom-h3 { color: red; }'
                        })

                    }} size="small">导出</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={[
                              // "department": "安吉店",
                              // "deliveryman": "杨发德",
                              // "bigbarrelnum": 0,
                              // "bigbarrelcommission": 0,
                              // "smallbarrelnum": 0,
                              // "smallbarrelcommission": 0,
                              // "supportingwaternum": 0,
                              // "supportingwatercommission": 0,
                              // "verticalwaterdispensernum": 0,
                              // "verticalwaterdispensercommission": 0,
                              // "desktopwaterdispensernum": 0,
                              // "desktopwaterdispensercommission": 0,
                              // "superhighfee": 0
                              // { field: 'salesman', headerName: '开户员', sortable: true, filter: true, },
                              // { field: 'num', headerName: '数量', sortable: true, filter: true, },
                              // { field: 'price', headerName: '单价', sortable: true, filter: true },
                              // { field: 'total', headerName: '合计', sortable: true, filter: true },
                              { field: 'department', headerName: '业务部门', sortable: true, filter: true, },
                              { field: 'deliveryman', headerName: '配送员', sortable: true, filter: true, },
                              { field: 'bigbarrelnum', headerName: '大桶数量', sortable: true, filter: true, },
                              { field: 'bigbarrelcommission', headerName: '大桶提成', sortable: true, filter: true, },
                              { field: 'smallbarrelnum', headerName: '小桶数量', sortable: true, filter: true, },
                              { field: 'smallbarrelcommission', headerName: '小桶提成', sortable: true, filter: true, },
                              { field: 'supportingwaternum', headerName: '支装水', sortable: true, filter: true, },
                              { field: 'supportingwatercommission', headerName: '支装水提成', sortable: true, filter: true, },
                              { field: 'verticalwaterdispensernum', headerName: '立式水机数量', sortable: true, filter: true, },
                              { field: 'verticalwaterdispensercommission', headerName: '立式水机提成', sortable: true, filter: true, },
                              { field: 'desktopwaterdispensernum', headerName: '台式水机数量', sortable: true, filter: true, },
                              { field: 'desktopwaterdispensercommission', headerName: '台式水机提成', sortable: true, filter: true, },
                              { field: 'superhighfee', headerName: '超高费', sortable: true, filter: true, },
                              {
                                   field: 'total', headerName: '合计', sortable: true, filter: true,

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
          </Box>
     )

}

export default PSBDeliverymanCommissionStatistics;