import { Form, Popconfirm } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useState } from "react";
import request from "utils/request";
import translations from '../../utils/translations.json'
import { toast } from "react-toastify";


const GetDistributionSubsidyOfCompanyRecord = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))
     const [list, setList] = useState([])
     const [departmentlist, setdepartmentlist] = useState([])

     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>获取公司配送补贴记录</Box>
          <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetDistributionSubsidyOfCompanyRecord',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment),
                    goodsids: JSON.stringify(e.goodsids),
                    salesman: JSON.stringify(e.salesman)
               })
               setList(rew.data)
          }}>

               <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />

               <Form.Select multiple field="attributiondepartment" label="归属部门" onChange={e => {
                    setdepartmentlist(e)
               }} filter maxTagCount={1}>
                    {
                         initData.DepartmentList.filter(item => item.name.includes('商') || item.name.includes('零售')  ).map(item =>
                              <Form.Select.Option key={item.id} value={item.name}>{item.label}</Form.Select.Option>
                         )
                    }

               </Form.Select>



               <Form.Select multiple filter label="业务员" field="salesman" style={{ width: 150 }} maxTagCount={1} >
                    {
                         initData.OperatorList.filter(item => {
                              if (departmentlist.length > 0) {
                                   return departmentlist.includes(item.department)
                              }
                              return true
                         }).map(item =>
                              <Form.Select.Option key={item.id} value={item.name}>{item.name}</Form.Select.Option>
                         )
                    }
               </Form.Select>

               <Form.TreeSelect treeData={new_goodslist} field="goodsids" label="商品" multiple maxTagCount={1} leafOnly filterTreeNode />

               <Button variant="outlined" size="small" type="submit">搜索</Button>
          </Form>

          <Box height="70vh" overflow="scroll" mt={3}>
               <AgGridReact
                    getRowStyle={(params) => {
                         if (params.data.state === '已完成') {
                              return { color: 'red' }
                         }
                         if (params.data.state === '取消') {
                              return { color: 'pink' }
                         }

                    }}
                    localeText={translations}
                    className="ag-theme-balham"
                    onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    columnDefs={[
                         {
                              headerName: '添加时间', field: 'addtime',

                         },
                         { headerName: '补贴日期', field: 'date' },
                         { headerName: '会员号', field: 'memberid' },
                         { headerName: '部门', field: 'department', floatingFilter: true },
                         { headerName: '商品', field: 'goodsname' },
                         { headerName: '数量', field: 'num' },
                         { headerName: '订单号', field: 'serial' },
                         { headerName: '配送员', field: 'deliveryman' },
                         { headerName: '工作单位', field: 'workplace' },
                         { headerName: '地址', field: 'address' },
                         { headerName: '业务员', field: 'salesman', floatingFilter: true },
                         { headerName: '方式', field: 'mode' },
                         { headerName: '合计', field: 'total' },
                         { headerName: '类型', field: 'type' },
                         { headerName: '状态', field: 'state' },
                         {
                              headerName: '操作', pinned: 'right', width: 150, cellRendererFramework: ({ data }) => (
                                   data?.state === '正常' ? <Box>
                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                             const rew = await request('post', '/api/getInfo', {
                                                  url: 'Srapp.Web_Other_Handle.ConfirmationDistributionSubsidyOfCompanyRecord',
                                                  id: data.id
                                             })
                                             if (rew.data.msg === 'SUCCESS') {
                                                  toast.success('操作成功')
                                             } else {
                                                  toast.error(`操作失败 ${rew.data.tips}`)
                                             }
                                        }}>
                                             <Button>确认</Button>
                                        </Popconfirm>
                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                             const rew = await request('post', '/api/getInfo', {
                                                  url: 'Srapp.Web_Other_Handle.CancelDistributionSubsidyOfCompanyRecord',
                                                  id: data.id
                                             })
                                             if (rew.data.msg === 'SUCCESS') {
                                                  toast.success('操作成功')
                                             } else {
                                                  toast.error(`操作失败 ${rew.data.tips}`)
                                             }
                                        }}>
                                             <Button>取消</Button>
                                        </Popconfirm>
                                   </Box> : ''
                              )
                         },
                    ]}
                    // onRowClicked={({data})=> {
                    //     console.log(data.serial)
                    //     api.current.setValue('serial',data.serial)
                    // }}
                    rowData={list}
                    defaultColDef={{
                         sortable: true,
                         resizable: true,
                         filter: 'agTextColumnFilter',
                    }}
               />
          </Box>

     </Box >;
}

export default GetDistributionSubsidyOfCompanyRecord;