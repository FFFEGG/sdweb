import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const LSHQdeliverymanCommissionStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     const [show, setShow] = useState(false)
     const [sublist, setSublist] = useState([])
     const [columnDefs, setColumnDefs] = useState([])
     const api = useRef()
     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>零售后勤配送员提成统计</Box>
          <Form onChange={e => {
               setList([])
          }} getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.LSHQdeliverymanCommissionStatistics',
                    ...e,
                    department: JSON.stringify(e.department)
               })
               if (rew.data.info.length) {
                    rew.data.info.map(item => {
                         // 计算小计
                         item.xj = parseFloat(item.kg2num * e.kg2price +
                              item.kg12num * e.kg12price +
                              item.kg12mdnum * e.kg12mdprice +
                              item.kg4num * e.kg4price +
                              item.kg45num * e.kg45price +
                              item.ajbt +
                              item.cgf +
                              item.cyf +
                              item.floortotal +
                              item.aqfkbt +
                              item.kpbhgbt +
                              item.zzfkbt +
                              item.zxgpbt +
                              item.yjbt +
                              item.cybt +
                              item.azjgbt +
                              item.smspbt +
                              item.syq45kgtlbt +
                              item.syq45kgcybt +
                              item.sggpyfbt).toFixed(2)
                         // 液化气提成
                         item.yhqtc = parseFloat(item.kg2num * e.kg2price + item.kg12num * e.kg12price + + item.kg12mdnum * e.kg12mdprice + item.kg4num * e.kg4price + item.kg45num * e.kg45price).toFixed(2)
                         // 补贴合计
                         item.bthj = parseFloat(item.ajbt + item.cgf + item.cyf + item.floortotal + item.aqfkbt + item.kpbhgbt + item.zzfkbt + item.zxgpbt + item.yjbt + item.cybt + item.azjgbt + item.smspbt + item.syq45kgtlbt + item.syq45kgcybt + item.sggpyfbt).toFixed(2)

                    })
                    rew.data.info.push({
                         "department": "合计",
                         "deliveryman": "",
                         "kg2num": rew.data.info.reduce((a, b) => a + b.kg2num, 0),
                         "kg12num": rew.data.info.reduce((a, b) => a + b.kg12num, 0),
                         "kg12mdnum": rew.data.info.reduce((a, b) => a + b.kg12mdnum, 0),
                         "kg4num": rew.data.info.reduce((a, b) => a + b.kg4num, 0),
                         "kg45num": rew.data.info.reduce((a, b) => a + b.kg45num, 0),
                         "yhqtc": rew.data.info.reduce((a, b) => a + parseFloat(b.yhqtc), 0).toFixed(2),
                         "ajnum": rew.data.info.reduce((a, b) => a + b.ajnum, 0),
                         "ajbt": rew.data.info.reduce((a, b) => a + b.ajbt, 0),
                         "cgf": rew.data.info.reduce((a, b) => a + b.cgf, 0),
                         "cyf": rew.data.info.reduce((a, b) => a + b.cyf, 0),
                         "floortotal": rew.data.info.reduce((a, b) => a + b.floortotal, 0),
                         "aqfkbt": rew.data.info.reduce((a, b) => a + b.aqfkbt, 0),
                         "kpbhgbt": rew.data.info.reduce((a, b) => a + b.kpbhgbt, 0),
                         "zzfkbt": rew.data.info.reduce((a, b) => a + b.zzfkbt, 0),
                         "zxgpbt": rew.data.info.reduce((a, b) => a + b.zxgpbt, 0),
                         "yjbt": rew.data.info.reduce((a, b) => a + b.yjbt, 0),
                         "cybt": rew.data.info.reduce((a, b) => a + b.cybt, 0),
                         "azjgbt": rew.data.info.reduce((a, b) => a + b.azjgbt, 0),
                         "smspbt": rew.data.info.reduce((a, b) => a + b.smspbt, 0),
                         "syq45kgtlbt": rew.data.info.reduce((a, b) => a + b.syq45kgtlbt, 0),
                         "syq45kgcybt": rew.data.info.reduce((a, b) => a + b.syq45kgcybt, 0),
                         "sggpyfbt": rew.data.info.reduce((a, b) => a + b.sggpyfbt, 0),
                         "bthj": rew.data.info.reduce((a, b) => a + parseFloat(b.bthj), 0).toFixed(2),
                         "xj": rew.data.info.reduce((a, b) => a + parseFloat(b.xj), 0).toFixed(2),
                    })
               }


               setList(rew.data.info)
          }
          }>
               <Form.Input type="date" field="begintime" label="开始时间" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input type="date" field="endtime" label="结束时间" initValue={moment().format('YYYY-MM-DD')} />
               {/* <Form.Select multiple filter field="department" label="业务部门" maxTagCount={3} placeholder="不传默认全部">
                    {
                         initData.DepartmentList.filter(item => item.type == '业务门店').map((item, index) => {
                              return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                         })
                    }
               </Form.Select> */}


               <Form.TreeSelect multiple leafOnly filterTreeNode field="department" label="业务部门" maxTagCount={3} placeholder="不传默认全部" treeData={new_department_byname} />
               {/* 设置提成单价 */}
               <Form.Input type="number" field="kg2price" label="2KG提成单价" initValue={0} />
               <Form.Input type="number" field="kg12price" label="12KG提成单价" initValue={0} />
               <Form.Input type="number" field="kg4price" label="4KG提成单价" initValue={0} />
               <Form.Input type="number" field="kg45price" label="45KG提成单价" initValue={0} />
               <Form.Input type="number" field="kg12mdprice" label="12KG门代提成单价" initValue={0} />




               <Box>
                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Box>
          </Form>
          <Box mt={3} height={'60vh'} overflow={'scroll'}>
               <AgGridReact
                    className="ag-theme-balham"
                    columnDefs={[
                         // {
                         //      "department": "安吉店",
                         //      "deliveryman": "杨发德",
                         //      "kg12num": 1,
                         //      "kg4num": 0,
                         //      "kg45num": 0,
                         //      "ajnum": 1,
                         //      "cgf": 3,
                         //      "cyf": 0,
                         //      "floortotal": 0.5,
                         //      "aqfkbt": 0,
                         //      "kpbhgbt": 0,
                         //      "psfpbt": 0,
                         //      "zxgpbt": 0,
                         //      "yjbt": 0,
                         //      "cybt": 0,
                         //      "azjgbt": 0,
                         //      "smspbt": 0,
                         //      "syq45kgtlbt": 0,
                         //      "syq45kgcybt": 0
                         //  }
                         // 'kg12num'     => 0,//12KG液化气数量
                         // 'kg4num'      => 0,//4KG液化气数量
                         // 'kg45num'     => 0,//45KG液化气数量
                         // 'ajnum'       => 0,//安检数量  
                         // 'cgf'         => 0,//超高费
                         // 'cyf'         => 0,//超远费
                         // 'floortotal'  => 0,//楼层补贴
                         // 'aqfkbt'      => 0,//安全放空补贴 
                         // 'kpbhgbt'     => 0, //看瓶不合格补贴
                         // 'psfpbt'      => 0,//配送放炮补贴
                         // 'zxgpbt'      => 0,//装卸费补贴
                         // 'yjbt'        => 0,//应急补贴
                         // 'cybt'        => 0,//超远补贴
                         // 'azjgbt'      => 0,//安装胶管补贴
                         // 'smspbt'      => 0,//上门收瓶补贴
                         // 'syq45kgtlbt' => 0,//商用气45KG抬楼补贴
                         // 'syq45kgcybt' => 0,//商用气45KG超远补贴
                         { headerName: '业务部门', field: 'department', sortable: true, filter: true, resizable: true },
                         { headerName: '配送员', field: 'deliveryman', sortable: true, filter: true, resizable: true },
                         { headerName: '2KG', field: 'kg2num', sortable: true, filter: true, resizable: true },
                         { headerName: '12KG', field: 'kg12num', sortable: true, filter: true, resizable: true },
                         { headerName: '12KG门代', field: 'kg12mdnum', sortable: true, filter: true, resizable: true },
                         { headerName: '4KG', field: 'kg4num', sortable: true, filter: true, resizable: true },
                         { headerName: '45KG', field: 'kg45num', sortable: true, filter: true, resizable: true },
                         { headerName: '送气提成', field: 'yhqtc', sortable: true, filter: true, resizable: true },
                         { headerName: '安检数量', field: 'ajnum', sortable: true, filter: true, resizable: true },
                         { headerName: '安检补贴', field: 'ajbt', sortable: true, filter: true, resizable: true },
                         { headerName: '超高费', field: 'cgf', sortable: true, filter: true, resizable: true },
                         { headerName: '超远费', field: 'cyf', sortable: true, filter: true, resizable: true },
                         { headerName: '楼层补贴', field: 'floortotal', sortable: true, filter: true, resizable: true },
                         { headerName: '安全放空补贴', field: 'aqfkbt', sortable: true, filter: true, resizable: true },
                         { headerName: '看瓶不合格补贴', field: 'kpbhgbt', sortable: true, filter: true, resizable: true },
                         { headerName: '自助放空补贴', field: 'zzfkbt', sortable: true, filter: true, resizable: true },
                         { headerName: '装卸费补贴', field: 'zxgpbt', sortable: true, filter: true, resizable: true },
                         { headerName: '应急补贴', field: 'yjbt', sortable: true, filter: true, resizable: true },
                         { headerName: '超远补贴', field: 'cybt', sortable: true, filter: true, resizable: true },
                         { headerName: '安装胶管补贴', field: 'azjgbt', sortable: true, filter: true, resizable: true },
                         { headerName: '上门收瓶补贴', field: 'smspbt', sortable: true, filter: true, resizable: true },
                         { headerName: '商用气45KG抬楼补贴', field: 'syq45kgtlbt', sortable: true, filter: true, resizable: true },
                         { headerName: '商用气45KG超远补贴', field: 'syq45kgcybt', sortable: true, filter: true, resizable: true },
                         { headerName: '收购钢瓶运费补贴', field: 'sggpyfbt', sortable: true, filter: true, resizable: true },
                         { headerName: '补贴', field: 'bthj', sortable: true, filter: true, resizable: true },
                         { headerName: '小计', field: 'xj', sortable: true, filter: true, resizable: true },
                    ]}
                    rowData={list}

                    onCellDoubleClicked={async (e) => {
                         const { data, colDef, value } = e
                         console.log('colDef', colDef)
                         const rew = await request('post', '/api/getInfo', {
                              // begintime	日期	必须			起始时间
                              // endtime	日期	必须			结束时间
                              // field	字符串	必须			字段名
                              // department	字符串	必须			业务部门 (二区店)
                              // deliveryman	字符串	必须			涉及人员
                              url: 'Srapp.Web_Report_Business_Infos.LSHQdeliverymanCommissionStatisticsDetails',
                              begintime: api.current.getValue('begintime'),
                              endtime: api.current.getValue('endtime'),
                              field: colDef.field,
                              department: data.department,
                              deliveryman: data.deliveryman,
                         })
                         if (rew.data?.info.length) {
                              if (colDef.headerName == '收购钢瓶运费补贴') {

                                   setColumnDefs([
                                        { headerName: '日期', field: 'addtime', sortable: true, filter: true, resizable: true },
                                        { headerName: '业务部门', field: 'department', sortable: true, filter: true, resizable: true },
                                        { headerName: '操作员', field: 'operator', sortable: true, filter: true, resizable: true },
                                        { headerName: '配送员', field: 'deliveryman', sortable: true, filter: true, resizable: true },
                                        { headerName: '商品名称', field: 'goodsname', sortable: true, filter: true, resizable: true },
                                        { headerName: '市场价', field: 'marketprice', sortable: true, filter: true, resizable: true },
                                        { headerName: '单价', field: 'price', sortable: true, filter: true, resizable: true },
                                        { headerName: '数量', field: 'num', sortable: true, filter: true, resizable: true },
                                        { headerName: '小计', field: 'total', sortable: true, filter: true, resizable: true },
                                   ])

                              } else {
                                   setColumnDefs(
                                        [
                                             { headerName: '日期', field: 'addtime', sortable: true, filter: true, resizable: true },
                                             { headerName: '业务部门', field: 'department', sortable: true, filter: true, resizable: true },
                                             { headerName: '操作员', field: 'operator', sortable: true, filter: true, resizable: true },
                                             { headerName: '配送员', field: 'deliveryman', sortable: true, filter: true, resizable: true },
                                             { headerName: '商品名称', field: 'goodsname', sortable: true, filter: true, resizable: true },
                                             { headerName: '单价', field: 'price', sortable: true, filter: true, resizable: true },
                                             { headerName: '数量', field: 'num', sortable: true, filter: true, resizable: true },
                                             { headerName: '楼层', field: 'floor', sortable: true, filter: true, resizable: true },
                                             { headerName: '总价', field: 'total', sortable: true, filter: true, resizable: true },
                                             { headerName: '会员号', field: 'memberid', sortable: true, filter: true, resizable: true },
                                             { headerName: '地址', field: 'address', sortable: true, filter: true, resizable: true },
                                        ]
                                   )
                              }


                              setSublist(rew.data.info)
                              setShow(true)
                         }
                    }}
                    onFirstDataRendered={e => {
                         e.api.sizeColumnsToFit();
                    }}
               />
          </Box>

          <Modal size="large" title="零售后勤配送员提成统计 明细" visible={show} footer={null} onOk={() => setShow(false)} onCancel={() => setShow(false)}>
               <Box height="60vh" overflow="auto">
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={sublist}
                         columnDefs={
                              columnDefs
                         }
                    />
               </Box>
          </Modal>

     </Box>;
}

export default LSHQdeliverymanCommissionStatistics;