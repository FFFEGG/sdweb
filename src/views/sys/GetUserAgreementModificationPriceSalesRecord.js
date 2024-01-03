import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import request from "utils/request";

const GetUserAgreementModificationPriceSalesRecord = () => {
     const [list, setList] = useState([]);
     const [configidlist, setConfigidlist] = useState([]);
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const new_department = JSON.parse(localStorage.getItem('new_department'))
     const [open, setOpen] = useState(false);
     const [rowData, setRowData] = useState({});
     useEffect(async () => {
          const rew = await request('post', '/api/getInfo', {
               url: 'Srapp.Web_SystemInfo.UserAgreementModificationPriceConfigList',
          })
          if (rew.data.msg === 'SUCCESS') {
               setConfigidlist(rew.data.info)
          }
     }, [])

     return (
          <Box p={3} borderRadius={1} bgcolor={'#fff'}>
               <Box fontSize={18} mb={3}>获取设置特别调整价格用户销售记录(仅限现金支付\现结欠款)</Box>
               <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    //  configid	整型	必须			参数ID
                    //  begintime	日期	必须			开始时间
                    //  endtime	日期	必须			结束时间
                    //  department	字符串	可选			涉及部门(不传默认全部) JSON ["二区店","二桥店"]
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Other_Infos.GetUserAgreementModificationPriceSalesRecord',
                         configid: e.configid,
                         begintime: e.begintime,
                         endtime: e.endtime,
                         department: JSON.stringify(e.department)
                    })
                    setList(rew.data)
               }}>

                    <Form.Select rules={[{ required: true, message: '必填' }]} label="参数ID" field="configid" filter style={{ width: 200 }}>
                         {
                              configidlist.map((item, index) => {
                                   return <Form.Select.Option key={index} value={item.id}>{item.name}</Form.Select.Option>
                              })
                         }
                    </Form.Select>
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} label="开始时间" field="begintime" style={{ width: 200 }} />
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} label="结束时间" field="endtime" style={{ width: 200 }} />
                    <Form.TreeSelect treeData={new_department} leafOnly filterTreeNode label="涉及部门" field="department" multiple maxTagCount={1} filter style={{ width: 200 }} />

                    <Button type="submit" variant="contained" size="small">获取</Button>
               </Form>

               <Box mt={3} height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={list}
                         columnDefs={[

                              // { headerName: "序号", field: "serial", sortable: true, filter: true },
                              { headerName: "时间", field: "addtime", sortable: true, filter: true },
                              // { headerName: "用户ID", field: "userid", sortable: true, filter: true },
                              { headerName: "会员号", field: "memberid", sortable: true, filter: true },
                              { headerName: "姓名", field: "username", sortable: true, filter: true },
                              { headerName: "电话", field: "telephone", sortable: true, filter: true },
                              { headerName: "工作单位", field: "workplace", sortable: true, filter: true },
                              { headerName: "地址", field: "address", sortable: true, filter: true },
                              { headerName: "归属部门", field: "attributiondepartment", sortable: true, filter: true },
                              { headerName: "业务员", field: "salesman", sortable: true, filter: true },
                              // { headerName: "商品ID", field: "goodsid", sortable: true, filter: true },
                              { headerName: "商品名称", field: "goodsname", sortable: true, filter: true },
                              { headerName: "数量", field: "num", sortable: true, filter: true },
                              { headerName: "部门", field: "department", sortable: true, filter: true },
                              { headerName: "操作员", field: "operator", sortable: true, filter: true },
                              { headerName: "配送员", field: "deliveryman", sortable: true, filter: true },
                              { headerName: "单价", field: "price", sortable: true, filter: true },
                              { headerName: "协议价格", field: "adjustprice", sortable: true, filter: true },
                              {
                                   headerName: "操作", cellRendererFramework: (params) => {
                                        return <Button size="small" onClick={async () => {
                                             Modal.confirm({
                                                  title: '提示',
                                                  content: '确认？',
                                                  onOk: async () => {
                                                       const rew = await request('post', '/api/getInfo', {
                                                            url: 'Srapp.Web_Other_Handle.HandleUserAgreementModificationPriceSalesRecord',
                                                            id: params.data.id,
                                                            serial: params.data.serial,
                                                            userid: params.data.userid,
                                                            adjustprice: params.data.adjustprice
                                                       })
                                                       if (rew.data.msg === 'SUCCESS') {
                                                            toast.success('确认成功')
                                                            setOpen(false)
                                                       } else {
                                                            toast.error(rew.data.tips)
                                                       }
                                                  }
                                             })

                                             // setRowData(params.data)
                                             // setOpen(true)
                                        }}>确认</Button>
                                   }

                              },

                         ]}

                    />
               </Box>


               <Modal title="编辑" visible={open} onCancel={() => setOpen(false)} footer={<></>}>
                    <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
                         // Srapp.Web_Other_Handle.HandleUserAgreementModificationPriceSalesRecord
                         // 处理特别调整价格用户销售记录
                         // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Other_Handle.HandleUserAgreementModificationPriceSalesRecord
                         // POST
                         // 接口描述：

                         // 接口参数
                         // 参数名字	类型	是否必须	默认值	其他	说明
                         // id	整型	必须			记录ID
                         // serial	字符串	必须			子订单单据号 8002
                         // userid	整型	必须			USERID
                         // adjustprice	浮点型	必须			调整后的价格
                         const rew = await request('post', '/api/getInfo', {
                              url: 'Srapp.Web_Other_Handle.HandleUserAgreementModificationPriceSalesRecord',
                              id: rowData.id,
                              serial: rowData.serial,
                              userid: rowData.userid,
                              adjustprice: e.adjustprice
                         })
                         if (rew.data.msg === 'SUCCESS') {
                              toast.success('修改成功')
                              setOpen(false)
                         } else {
                              toast.error(rew.data.tips)
                         }
                    }}>


                         <Form.Input initValue={rowData.adjustprice} field="adjustprice" label="调整后的价格" />
                         <Button type="submit" variant="contained" size="small">提交</Button>
                    </Form>
               </Modal>

          </Box>
     );
}

export default GetUserAgreementModificationPriceSalesRecord;