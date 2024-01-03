import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import request from "utils/request";

const OpeHoldPackingtypeInfo = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setlist] = useState([])
     const [list2, setlist2] = useState([])
     const [errcodes, seterrcodes] = useState([])
     const [open, setopen] = useState(false)
     const gridRef = useRef()
     const api = useRef()
     const onSelectionChanged = useCallback(() => {
          const selectedRows = gridRef.current.api.getSelectedRows();
          console.log(selectedRows);
          setlist2(selectedRows)
     }, []);
     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>更换员工包装物持有人</Box>
          <Form getFormApi={e => api.current = e} onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Material_Infos.OpeHoldRecord',
                    code: JSON.stringify(e.code)
               })
               setlist(rew.data.list)
               seterrcodes(rew.data.errcodes)
          }}>
               <Form.TagInput field={'code'} label={'批量搜索钢瓶码（回车确认）'} style={{ width: '100%' }} />
               <Button type="submit" variant="contained" sx={{ mt: 1 }}>搜索</Button>

          </Form>
          {
               list2.length ? <Button type="button" onClick={async () => {
                    setopen(true)
               }} variant="contained" sx={{ mt: 1 }}>批量转移</Button> : ''
          }
          <Modal title="批量转移" visible={open} onCancel={() => setopen(false)} footer={<></>} >
               <Form onSubmit={async e => {
                    for (let i = 0; i < list2.length; i++) {
                         const element = list2[i];
                         setTimeout(async () => {
                              console.log(element);
                              // Srapp.Web_Material_Handle.OpeExchangeOpeMaterial
                              // 转移员工物资至另一员工
                              // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Material_Handle.OpeExchangeOpeMaterial
                              // POST
                              // 接口描述：

                              // 接口参数
                              // 参数名字	类型	是否必须	默认值	其他	说明
                              // serial	字符串	可选			单据号
                              // receiver_opeid	字符串	必须			接收OPEID
                              // grantee_opeid	字符串	必须			发出OPEID
                              // id	整型	必须			记录ID
                              // remarks	字符串	可选		最大：150	备注
                              const rew = await request('post', '/api/getInfo', {
                                   url: 'Srapp.Web_Material_Handle.OpeExchangeOpeMaterial',
                                   receiver_opeid: e.receiver_opeid,
                                   grantee_opeid: element.stockmen_opeid,
                                   id: element.id,
                                   serial: element.grant_serial,
                                   remarks: '批量转移'
                              })
                              if (rew.data.msg === 'SUCCESS') {
                                   toast.success('操作成功')
                              } else {
                                   toast.error(`操作失败 ${rew.data.tips}`)
                              }
                         }, 500 * i);
                         if (i === list2.length - 1) {
                              // toast.success('操作完成')
                              setopen(false)
                              // api.current.submitForm()
                         }
                    }


               }}>
                    <Form.Select label={'接收人'} filter initValue={loginuser.opeid} field={'receiver_opeid'} style={{ width: '100%' }}>
                         {
                              initData.OperatorList.map(item =>
                                   <Form.Select.Option value={item.opeid} >{item.name}</Form.Select.Option>
                              )
                         }
                    </Form.Select>
                    <Button type="submit" variant="contained" sx={{ mt: 1 }}>确认</Button>
               </Form>
          </Modal>

          <Box mt={3}>
               <Box overflow={'scroll'} height={'40vh'}>
                    <AgGridReact
                         ref={gridRef}
                         rowSelection="multiple"
                         className="ag-theme-balham"
                         rowData={list}
                         onSelectionChanged={onSelectionChanged}
                         columnDefs={[

                              {
                                   field: 'code', headerName: '钢瓶码', flex: 1, checkboxSelection: true,
                                   //全选
                                   headerCheckboxSelection: true,
                              },
                              { field: 'department', headerName: '部门', flex: 1 },
                              { field: 'stockmen', headerName: '持有人', flex: 1 },
                              { field: 'packingtype', headerName: '包装物', flex: 1 },
                              { field: 'stockmen_opeid', headerName: '持有人opeid', flex: 1 },
                              { field: 'state', headerName: '状态', flex: 1 },

                         ]}
                    />
               </Box>

               <Box fontSize={18} mt={3}>
                    未建档钢瓶码：{errcodes.join(',')}
               </Box>
          </Box>
     </Box >;
}

export default OpeHoldPackingtypeInfo;