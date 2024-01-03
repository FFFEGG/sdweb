import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const LSHQUserNewAccountSalesStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const [list, setList] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const [salesinfo, setSalesinfo] = useState([])
     const [usercustomertypelist, setUsercustomertypelist] = useState([])


     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>零售后勤 个人开户及换气量统计</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.LSHQUserNewAccountSalesStatistics',
                         ...e,
                         department: JSON.stringify(e.department),
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
                    <Form.TreeSelect maxTagCount={2} multiple filter field="department" label="开户部门" leafOnly filterTreeNode treeData={new_department_byname} />
                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={[

                              { field: 'department', headerName: '开户部门', sortable: true, filter: true, },
                              { field: 'salesman', headerName: '开户员', sortable: true, filter: true, },
                              { field: '家庭用户[khnum]', headerName: '家庭用户(户)', sortable: true, filter: true, },
                              { field: '家庭用户[salesnum]', headerName: '家庭换气数', sortable: true, filter: true, },
                              { field: '商业用户[khnum]', headerName: '商业用户(户)', sortable: true, filter: true, },
                              { field: '商业用户[salesnum]', headerName: '商业换气数', sortable: true, filter: true, },

                         ]}
                         rowData={list}
                         onCellDoubleClicked={async e => {
                              const { colDef, value } = e
                              let type = '开户'
                              let salesman = '家庭用户'
                              if (colDef.field === '家庭用户[khnum]' || colDef.field === '商业用户[khnum]') {
                                   type = '开户'
                              } else {
                                   type = '销售'
                              }
                              if (colDef.field === '家庭用户[khnum]' || colDef.field === '家庭用户[salesnum]') {
                                   salesman = '家庭用户'
                              } else {
                                   salesman = '商业用户'
                              }

                              if (colDef.field !== 'salesman') {
                                   const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Report_Business_Infos.LSHQUserNewAccountSalesStatisticsDetails',
                                        begintime: api.current.getValue('begintime'),
                                        endtime: api.current.getValue('endtime'),
                                        customertype: salesman,
                                        salesman: e.data.salesman,
                                        department: JSON.stringify([e.data.department]),
                                        type,
                                   })
                                   setShow(true)
                                   setSublist(rew.data.info)
                              }
                         }}
                    />
               </Box>



               <Modal title="开户详情" visible={show} footer={null} size="large" onCancel={() => setShow(false)} onOk={() => setShow(false)}>
                    <Box height={'60vh'}>
                         <AgGridReact
                              className="ag-theme-balham"
                              columnDefs={[

                                   { field: 'addtime', headerName: '换气时间', sortable: true, filter: true, },
                                   { field: 'accountopeningdepartment', headerName: '换气时间', sortable: true, filter: true, },
                                   { field: 'accountopeningtime', headerName: '开户时间', sortable: true, filter: true, },
                                   { field: 'salesman', headerName: '开户员', sortable: true, filter: true, },
                                   { field: 'customertype', headerName: '客户类型', sortable: true, filter: true, },
                                   { field: 'memberid', headerName: '会员号', sortable: true, filter: true, },
                                   { field: 'username', headerName: '姓名', sortable: true, filter: true, },
                                   { field: 'address', headerName: '地址', sortable: true, filter: true, },
                                   { field: 'goodsname', headerName: '商品名称', sortable: true, filter: true, },
                                   { field: 'num', headerName: '数量', sortable: true, filter: true, },
                                   { field: 'department', headerName: '业务部门', sortable: true, filter: true, },
                                   { field: 'deliveryman', headerName: '配送员', sortable: true, filter: true, },



                              ]}
                              rowData={sublist}
                         />
                    </Box>
               </Modal>
          </Box>
     )

}

export default LSHQUserNewAccountSalesStatistics;