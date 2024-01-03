import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const SYQNewUserSalesStatisticsOldTable = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_Opelist = JSON.parse(localStorage.getItem('new_Opelist'))
     const [list, setList] = useState([])
     const [keys, setKeys] = useState([])
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const pf = (str) => {
          if (srt) {
               return parseFloat(str).toFixed(2)
          }
          return 0
     }
     const api = useRef(null);


     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>新户销售统计(旧)</Box>
          <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQNewUserSalesStatisticsOldTable',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    salesman: JSON.stringify(e.salesman)
               })
               if (rew.data.info.length) {
                    let hj = {

                    }

                    rew.data.info.forEach(item => {
                         Object.keys(item).forEach(key => {
                              if (key != 'salesman' && key != 'memberid' && key != 'attributiondepartment') {
                                   hj[key] = ((parseFloat(hj[key]) || 0) + parseFloat(item[key])).toFixed(4)
                              }
                         });
                    })
                    hj.memberid = '合计'
                    hj.attributiondepartment = rew.data.info.length
                    rew.data.info.push(hj)

               }

               setList(rew.data.info)


               let keys = new Set();

               rew.data.info.forEach(item => {
                    Object.keys(item).forEach(key => {
                         keys.add(key);
                    });
               });

               let keysArray = Array.from(keys);
               // console.log(keysArray);
               setKeys(keysArray);
          }}>
               <Form.Input field={'salesbegintime'} label={'销售开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field={'salesendtime'} label={'销售结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field={'accountopenbegintime'} label={'开户开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} rules={[
                    { required: true, message: '必填' }
               ]} />
               <Form.Input field={'accountopenendtime'} label={'开户结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} rules={[
                    { required: true, message: '必填' }
               ]} />
               {/* <Form.Input field="days" label="开户销售间隔天数" type="number" initValue={30} /> */}
               <Form.Select rules={[
                    { required: true, message: '必填' }
               ]} field="attributiondepartment" label="归属部门" multiple filter maxTagCount={2}>
                    {
                         initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                              <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                         )
                    }
               </Form.Select>
               {/* <Form.Select field="salesman" label="开户业务员" multiple filter maxTagCount={2}>
                    {
                         initData.OperatorList.filter(item => item.departmentid === loginuser.login_departmentid).map(item =>
                              <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                         )
                    }
               </Form.Select> */}


               <Form.TreeSelect treeData={new_Opelist} leafOnly field="salesman" label="开户业务员" multiple filterTreeNode maxTagCount={2} />

               <Form.Select field="type" label="类型">
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
               </Form.Select>

               <Box>
                    <Button size="small" variant="outlined" type="submit">搜索</Button>

               </Box>



          </Form>

          <Box height={'60vh'} mt={3} overflow={"scroll"}>
               <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    defaultColDef={{
                         resizable: true,
                         sortable: true,
                    }}
                    columnDefs={
                         keys.filter(item => {


                              if (item.includes('residual_air_weight') || item.includes('suttle')) {
                                   return false
                              }

                              return true
                         }).map(key => {
                              if (key == 'payment') {
                                   return {
                                        headerName: '支付方式',
                                        field: key,
                                        width: 100,
                                   }
                              }

                              if (key == 'attributiondepartment') {
                                   return {
                                        headerName: '归属部门',
                                        field: key,
                                        width: 100,
                                   }
                              }

                              if (key == 'salesman') {
                                   return {
                                        headerName: '业务员',
                                        field: key,
                                        width: 100,
                                   }
                              }

                              if (key == 'memberid') {
                                   return {
                                        headerName: '卡号',
                                        field: key,
                                        width: 100,
                                   }
                              }

                              return {
                                   headerName: key.substring(0, key.length - 5),
                                   field: key,
                                   width: 100,
                                   canclick: true,
                              }


                         }).concat([
                              {
                                   headerName: '残液(吨)',
                                   valueGetter: ({ data }) => {
                                        //合计 key 包含 ‘residual_air_weight’ 的数据
                                        const keys = Object.keys(data).filter(key => key.includes('residual_air_weight'));
                                        //合计
                                        const sum = keys.reduce((prev, key) => {
                                             return prev + parseFloat(data[key] || 0);
                                        }, 0);
                                        return sum.toFixed(4);

                                   }
                              }, {
                                   headerName: '实际销量(吨)',
                                   valueGetter: ({ data }) => {
                                        //合计 key 包含 ‘residual_air_weight’ 的数据
                                        const keys = Object.keys(data).filter(key => key.includes('residual_air_weight'));
                                        //合计
                                        const sum = keys.reduce((prev, key) => {
                                             return prev + parseFloat(data[key] || 0);
                                        }, 0);

                                        // 合计 key 包含 'suttle' 的数据
                                        const keys2 = Object.keys(data).filter(key => key.includes('suttle'));
                                        //合计
                                        const sum2 = keys2.reduce((prev, key) => {
                                             return prev + parseFloat(data[key] || 0);
                                        }, 0);
                                        return (sum2 - sum).toFixed(4);
                                   }

                              }
                         ])
                    }
                    onCellClicked={async (data) => {
                         console.log(data)
                         const colDef = data.colDef;
                         const rowdata = data.data;
                         const rowIndex = data.rowIndex;
                         const canclick = colDef.canclick;
                         if (canclick) {
                              const rew = await request('post', '/api/getInfo', {
                                   url: 'Srapp.Web_Report_Manage_Infos.SYQNewUserSalesOldDetail',
                                   salesbegintime: api.current.getValue('salesbegintime'),
                                   salesendtime: api.current.getValue('salesendtime'),
                                   accountopenbegintime: api.current.getValue('accountopenbegintime'),
                                   accountopenendtime: api.current.getValue('accountopenendtime'),
                                   payment: rowdata.payment,
                                   memberid: rowdata.memberid,
                                   goodsname: colDef.headerName,
                                   salesman: JSON.stringify([rowdata.salesman]),
                                   attributiondepartment: JSON.stringify([rowdata.attributiondepartment]),
                              })
                              setSublist(rew.data.info)
                              setShow(true)
                         }
                    }}

               />
          </Box>

          <Modal title="新户销售明细" visible={show} onCancel={() => setShow(false)} footer={null} width={1000}>
               <Box height={'60vh'} mt={3} overflow={"scroll"}>
                    <AgGridReact

                         className="ag-theme-balham"
                         rowData={sublist}
                         columnDefs={[
                              // "addtime": "2023-05-25 00:00:00.000",
                              // "collection_date": null,
                              // "mode": "商品销售",
                              // "department": "三合店",
                              // "deliveryman": "配送3",
                              // "attributiondepartment": "商用气维护部",
                              // "salesman": "SY0012",
                              // "payment": "现金支付",
                              // "memberid": "875930",
                              // "username": "石",
                              // "workplace": "食堂",
                              // "goodsname": "12KG液化气",
                              // "num": "1.0",
                              // "suttle": "12.0",
                              // "residual_air_weight": "5.0"
                              { headerName: '销售时间', field: 'addtime', width: 100 },
                              { headerName: '收款日期', field: 'collection_date', width: 100 },
                              { headerName: '开户日期', field: 'accountopeningtime', width: 100 },
                              { headerName: '相差天数', field: 'differencedays', width: 100 },
                              { headerName: '销售方式', field: 'mode', width: 100 },
                              { headerName: '部门', field: 'department', width: 100 },
                              { headerName: '配送员', field: 'deliveryman', width: 100 },
                              { headerName: '归属部门', field: 'attributiondepartment', width: 100 },
                              { headerName: '业务员', field: 'salesman', width: 100 },
                              { headerName: '支付方式', field: 'payment', width: 100 },
                              { headerName: '会员号', field: 'memberid', width: 100 },
                              { headerName: '姓名', field: 'username', width: 100 },
                              { headerName: '单位', field: 'workplace', width: 100 },
                              { headerName: '商品名称', field: 'goodsname', width: 100 },
                              { headerName: '数量', field: 'num', width: 100 },
                              { headerName: '净重', field: 'suttle', width: 100 },
                              { headerName: '残液', field: 'residual_air_weight', width: 100 },
                         ]}
                    />
               </Box>
          </Modal>
     </Box>;
}

export default SYQNewUserSalesStatisticsOldTable;