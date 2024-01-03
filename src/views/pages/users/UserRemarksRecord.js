import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import request from "utils/request";

const UserRemarksRecord = ({ userinfo }) => {

     const [show, setShow] = useState(false)
     const [list, setList] = useState([])
     const getlist = async () => {
          // Srapp.Web_User_Infos.UserRemarksRecord
          // 获取用户备注记录
          // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_User_Infos.UserRemarksRecord
          // POST
          // 接口描述：

          // 接口参数
          // 参数名字	类型	是否必须	默认值	其他	说明
          // userid	字符串	必须			userid
          // begintime	日期	必须			开始时间
          // endtime	日期	必须			结束时间
          // row	整型	可选	0		单页行数
          // page	整型	可选	1		页码
          const rew = await request('post', '/api/getInfo', {
               url: 'Srapp.Web_User_Infos.UserRemarksRecord',
               userid: userinfo.userid,
               begintime: '2021-09-01',
               endtime: moment().format('YYYY-MM-DD'),
          })
          setList(rew.data)

     }

     const api = useRef(null)

     return <Box pt={1}>
          <Box>
               <Button onClick={getlist} sx={{ mr: 1 }} variant={"outlined"} size={"small"}>获取备注信息</Button>
               <Button onClick={() => {
                    setShow(true)
               }} variant={"outlined"} size={"small"}>添加备注</Button>


               <Modal title={'添加备注'} visible={show} onCancel={() => {
                    setShow(false)
               }} onOk={() => {
                    api.current.submitForm()
               }}>
                    <Form getFormApi={e => api.current = e} onSubmit={async e => {
                         // Srapp.Web_User_EditInfo.AddUserRemarks
                         // 添加用户备注记录
                         // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_User_EditInfo.AddUserRemarks
                         // POST
                         // 接口描述：

                         // 接口参数
                         // 参数名字	类型	是否必须	默认值	其他	说明
                         // userid	整型	必须			userid
                         // remarks	字符串	必须			备注
                         const rew = await request('post', '/api/getInfo', {
                              url: 'Srapp.Web_User_EditInfo.AddUserRemarks',
                              userid: userinfo.userid,
                              remarks: e.remark
                         })
                         if (rew.data.msg === 'SUCCESS') {
                              toast.success('添加成功')
                              setShow(false)
                              getlist()
                         } else {
                              toast.error('添加失败')
                         }
                    }}>
                         <Form.Input field={'remark'} label={'备注'} />
                    </Form>
               </Modal>


               <Box height={'60vh'} mt={1} overflow={"scroll"}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={list}
                         columnDefs={[
                              // {
                              //      "id": "1",
                              //      "addtime": "2023-08-22 09:53:13.333",
                              //      "userid": "144194",
                              //      "remarks": "123456",
                              //      "department": "槎路店",
                              //      "operator": "胡东CD",
                              //      "canceltime": null,
                              //      "canceldepartment": null,
                              //      "canceloperator": null,
                              //      "state": "正常"
                              //  }
                              { headerName: '添加时间', field: 'addtime' },
                              { headerName: '备注', field: 'remarks' },
                              { headerName: '添加部门', field: 'department' },
                              { headerName: '添加人', field: 'operator' },
                              { headerName: '取消时间', field: 'canceltime' },
                              { headerName: '取消部门', field: 'canceldepartment' },
                              { headerName: '取消人', field: 'canceloperator' },
                              { headerName: '状态', field: 'state' },
                              {
                                   headerName: '操作', cellRendererFramework: ({ data }) => data.state && <Button size="small" onClick={async () => {
                                        // Srapp.Web_User_EditInfo.CancelUserRemarks
                                        // 取消用户备注记录
                                        // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_User_EditInfo.CancelUserRemarks
                                        // POST
                                        // 接口描述：

                                        // 接口参数
                                        // 参数名字	类型	是否必须	默认值	其他	说明
                                        // id	整型	必须			id
                                        // userid	整型	必须			userid

                                        const rew = await request('post', '/api/getInfo', {
                                             url: 'Srapp.Web_User_EditInfo.CancelUserRemarks',
                                             id: data.id,
                                             userid: userinfo.userid
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                             toast.success('取消成功')
                                             getlist()
                                        } else {
                                             toast.error('取消失败')
                                        }


                                   }}>取消</Button>
                              },
                         ]}
                    />
               </Box>
          </Box>
     </Box>
}

export default UserRemarksRecord;