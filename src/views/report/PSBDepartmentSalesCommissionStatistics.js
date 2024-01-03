import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const PSBDepartmentSalesCommissionStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 部门销售配送提成</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSBDepartmentSalesCommissionStatistics',
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
                    if (rew.data.info.length) {
                         // { headerName: '业务部门', field: 'department' },
                         // { headerName: '开户数量', field: 'khnum' },
                         // { headerName: '开户金额', field: 'khtotal' },
                         // { headerName: '开户提成', field: 'khcommission' },
                         // { headerName: '桶装水销售量', field: 'wsalesnum' },
                         // { headerName: '桶装水销售提成', field: 'wsalescommission' },
                         // { headerName: '配送员配送大桶数量', field: 'psybigbarrelnum' },
                         // { headerName: '配送员配送小桶数量', field: 'psysmallbarrelnum' },
                         // { headerName: '配送员配送支装水数量', field: 'psysupportingwaternum' },
                         // { headerName: '配送员配送立式饮水机数量', field: 'psyverticalwaterdispensernum' },
                         // { headerName: '配送员配送台式饮水机数量', field: 'psydesktopwaterdispensernum' },
                         // { headerName: '配送员配送超高费金额', field: 'psycsuperhighfee' },
                         // { headerName: '配送员提成', field: 'psycommission' },
                         // { headerName: '销售立式饮水机数量', field: 'salesverticalwaterdispensernum' },
                         // { headerName: '销售台式饮水机数量', field: 'salesdesktopwaterdispensernum' },
                         // { headerName: '饮水机', field: 'waterdispensernum' },
                         // { headerName: '桶差价合计', field: 'barrelpricedifference' },
                         // { headerName: '桶差价提成', field: 'barrelpricedifferencecommission' },
                         rew.data.info.map(item => {
                              item.khnum = item.khnum * 1
                              item.khtotal = parseFloat(item.khtotal).toFixed(2)
                              item.khcommission = parseFloat(item.khcommission).toFixed(2)
                              item.wsalesnum = item.wsalesnum * 1
                              item.wsalescommission = parseFloat(item.wsalescommission).toFixed(2)
                              item.psybigbarrelnum = item.psybigbarrelnum * 1
                              item.psysmallbarrelnum = item.psysmallbarrelnum * 1
                              item.psysupportingwaternum = item.psysupportingwaternum * 1
                              item.psyverticalwaterdispensernum = item.psyverticalwaterdispensernum * 1
                              item.psydesktopwaterdispensernum = item.psydesktopwaterdispensernum * 1
                              item.psycsuperhighfee = parseFloat(item.psycsuperhighfee).toFixed(2)
                              item.psycommission = parseFloat(item.psycommission).toFixed(2)
                              item.salesverticalwaterdispensernum = item.salesverticalwaterdispensernum * 1
                              item.salesdesktopwaterdispensernum = item.salesdesktopwaterdispensernum * 1
                              item.waterdispensernum = item.waterdispensernum * 1
                              item.barrelpricedifference = parseFloat(item.barrelpricedifference).toFixed(2)
                              item.barrelpricedifferencecommission = parseFloat(item.barrelpricedifferencecommission).toFixed(2)

                              //提成小计
                              item.tc_total = parseFloat(item.khcommission) + parseFloat(item.wsalescommission) + parseFloat(item.psycommission) + parseFloat(item.barrelpricedifferencecommission)
                              item.tc_total = item.tc_total.toFixed(2)
                         })

                         rew.data.info.push({
                              department: '合计',
                              khnum: rew.data.info.reduce((a, b) => a + b.khnum, 0) * 1,
                              khtotal: rew.data.info.reduce((a, b) => a + b.khtotal * 1, 0).toFixed(2),
                              khcommission: rew.data.info.reduce((a, b) => a + b.khcommission * 1, 0).toFixed(2),
                              wsalesnum: rew.data.info.reduce((a, b) => a + b.wsalesnum, 0) * 1,
                              wsalescommission: rew.data.info.reduce((a, b) => a + b.wsalescommission * 1, 0).toFixed(2),
                              psybigbarrelnum: rew.data.info.reduce((a, b) => a + b.psybigbarrelnum, 0) * 1,
                              psysmallbarrelnum: rew.data.info.reduce((a, b) => a + b.psysmallbarrelnum, 0) * 1,
                              psysupportingwaternum: rew.data.info.reduce((a, b) => a + b.psysupportingwaternum, 0) * 1,
                              psyverticalwaterdispensernum: rew.data.info.reduce((a, b) => a + b.psyverticalwaterdispensernum, 0) * 1,
                              psydesktopwaterdispensernum: rew.data.info.reduce((a, b) => a + b.psydesktopwaterdispensernum, 0) * 1,
                              psycsuperhighfee: rew.data.info.reduce((a, b) => a + b.psycsuperhighfee * 1, 0).toFixed(2),
                              psycommission: rew.data.info.reduce((a, b) => a + b.psycommission * 1, 0).toFixed(2),
                              salesverticalwaterdispensernum: rew.data.info.reduce((a, b) => a + b.salesverticalwaterdispensernum, 0) * 1,
                              salesdesktopwaterdispensernum: rew.data.info.reduce((a, b) => a + b.salesdesktopwaterdispensernum, 0) * 1,
                              waterdispensernum: rew.data.info.reduce((a, b) => a + b.waterdispensernum, 0) * 1,
                              barrelpricedifference: rew.data.info.reduce((a, b) => a + b.barrelpricedifference * 1, 0).toFixed(2),
                              barrelpricedifferencecommission: rew.data.info.reduce((a, b) => a + b.barrelpricedifferencecommission * 1, 0).toFixed(2),
                              tc_total: rew.data.info.reduce((a, b) => a + b.tc_total * 1, 0).toFixed(2),





                         })
                    }
                    setList(rew.data.info)
               }
               }>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Select maxTagCount={2} multiple filter field="department" label="业务部门">
                         {
                              initData.DepartmentList.map((item, index) => {
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
                              // 'department'                      => $value['department'],
                              // 'khnum'                           => 0,//开户数量
                              // 'khtotal'                         => 0,//开户金额
                              // 'khcommission'                    => 0,//开户提成
                              // 'wsalesnum'                       => 0,//桶装水销售量
                              // 'wsalescommission'                => 0,//桶装水销售提成
                              // 'psybigbarrelnum'                 => 0,//配送员配送大桶数量
                              // 'psysmallbarrelnum'               => 0,//配送员配送小桶数量
                              // 'psysupportingwaternum'           => 0,//配送员配送支装水数量
                              // 'psyverticalwaterdispensernum'    => 0,//配送员配送立式饮水机数量
                              // 'psydesktopwaterdispensernum'     => 0,//配送员配送台式饮水机数量
                              // 'psycsuperhighfee'                => 0,//配送员配送超高费金额
                              // 'psycommission'                   => 0,//配送员提成
                              // 'salesverticalwaterdispensernum'  => 0,//销售立式饮水机数量
                              // 'salesdesktopwaterdispensernum'   => 0,//销售台式饮水机数量
                              // 'barrelpricedifference'           => 0,//桶差价合计
                              // 'barrelpricedifferencecommission' => 0,//桶差价提成
                              { headerName: '业务部门', field: 'department' },
                              {
                                   headerName: '开户', children: [
                                        { headerName: '总金额', field: 'khtotal' },
                                        { headerName: '开户', field: 'khnum' },
                                        { headerName: '提成', field: 'khcommission' },
                                   ]
                              },


                              {
                                   headerName: '水销售', children: [
                                        { headerName: '数量', field: 'wsalesnum' },
                                        { headerName: '提成', field: 'wsalescommission' },
                                   ]
                              },

                              {
                                   headerName: '配送员提成', children: [
                                        { headerName: '大桶', field: 'psybigbarrelnum' },
                                        { headerName: '小桶', field: 'psysmallbarrelnum' },
                                        { headerName: '支装水', field: 'psysupportingwaternum' },
                                        { headerName: '立式', field: 'psyverticalwaterdispensernum' },
                                        { headerName: '台式', field: 'psydesktopwaterdispensernum' },
                                        { headerName: '超高', field: 'psycsuperhighfee' },
                                        { headerName: '提成', field: 'psycommission' },
                                   ]
                              },

                              {
                                   headerName: '销量', children: [
                                        { headerName: '立式', field: 'salesverticalwaterdispensernum' },
                                        { headerName: '台式', field: 'salesdesktopwaterdispensernum' },
                                        { headerName: '饮水机', field: 'waterdispensernum' },
                                   ]
                              },
                              {
                                   headerName: '桶差价提成', children: [
                                        { headerName: '合计', field: 'barrelpricedifference' },
                                        { headerName: '提成', field: 'barrelpricedifferencecommission' },
                                   ]
                              },

                              { headerName: '提成小计', field: 'tc_total' },


                         ]}
                         onFirstDataRendered={(e) => {
                              // console.log(e)
                              e.api.sizeColumnsToFit()

                         }}
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

export default PSBDepartmentSalesCommissionStatistics;