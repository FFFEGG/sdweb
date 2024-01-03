import { ArrayField, Form, Modal, Button as Btn } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import request from "utils/request";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { set } from "react-hook-form";
import moment from "moment";

const UserAgreementModificationPriceConfigList = () => {
     const [list, setList] = useState([])
     const [open, setOpen] = useState(false)
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const api = useRef(null)
     const getlist = async () => {
          const rew = await request('post', '/api/getInfo', {
               url: 'Srapp.Web_SystemInfo.UserAgreementModificationPriceConfigList',
          })
          if (rew.data.msg === 'SUCCESS') {
               setList(rew.data.info)
          }
     }
     return (
          <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
               <Box fontSize={18} mb={3}>特别调整用户价格参数列表</Box>
               <Box display={'flex'}>
                    <Button variant="contained" onClick={() => getlist()} size="small" sx={{ mr: 2 }}>刷新</Button>
                    <Button onClick={() => setOpen(true)} variant="contained" size="small">新增</Button>
               </Box>
               <Modal
                    title="新增特别调整用户价格参数"
                    visible={open}
                    onCancel={() => setOpen(false)}
                    onOk={() => api.current.submitForm()}
                    maskClosable={false}
               >
                    <Form initValues={{
                         action: 'ADD',
                         id: 0
                    }} getFormApi={e => api.current = e} onSubmit={async e => {
                         // Srapp.Web_SystemSetting.SettinguserAgreementModificationPriceConfig
                         // 设置特别调整用户价格参数
                         // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_SystemSetting.SettinguserAgreementModificationPriceConfig
                         // POST
                         // 接口描述：

                         // 接口参数
                         // 参数名字	类型	是否必须	默认值	其他	说明
                         // action	枚举类型	必须		范围：ADD/UPDATE	状态（ADD,UPDATE）
                         // id	整型	可选	0		ID
                         // name	字符串	必须			配置名称
                         // contactperson	字符串	必须			对接人
                         // users	字符串	必须			用户memberid JSON ["1223132","11111210"]
                         // goods	字符串	必须			商品 JSON [{"goodsid":1,"price":100}]
                         // begintime	日期	必须			方案生效开始日期
                         // endtime	日期	必须			方案生效结束日期
                         // state	枚举类型	必须		范围：正常/取消	状态（正常,取消）
                         const rew = await request('post', '/api/getInfo', {
                              url: 'Srapp.Web_SystemSetting.SettinguserAgreementModificationPriceConfig',
                              ...e,
                              goods: JSON.stringify(e.goods),
                              users: JSON.stringify(e.users),
                         })
                         if (rew.data.msg === 'SUCCESS') {
                              setOpen(false)
                              toast.success('操作成功')
                              api.current.reset()
                         } else {
                              toast.error(rew.data.tips)
                         }
                    }}>

                         <Form.Input rules={[{ required: true, message: '必填' }]} label="配置名称" field="name" placeholder="请输入配置名称" />
                         <Form.Select rules={[{ required: true, message: '必填' }]} filter label="对接人" field="contactperson" placeholder="请输入对接人" style={{ width: '100%' }} >
                              {
                                   initData?.OperatorList.map((item, index) => {
                                        return <Form.Select.Option key={index} value={item.name}>{item.name}</Form.Select.Option>
                                   }
                                   )
                              }
                         </Form.Select>
                         <Form.TagInput label="用户memberid" field="users" placeholder="请输入用户memberid,回车多个" />

                         <ArrayField field='goods' >
                              {({ add, arrayFields, addWithInitValue }) => (
                                   <>
                                        <Btn onClick={add} theme='light'>新增</Btn>
                                        {
                                             arrayFields.map(({ field, key, remove }, i) => (
                                                  <div key={key} style={{ width: 1000, display: 'flex' }}>

                                                       <Form.Select
                                                            field={`${field}[goodsid]`}
                                                            label={`商品`}
                                                            style={{ width: 200, marginRight: 2 }}
                                                            filter
                                                            rules={[{ required: true, message: '请选择商品' }]}
                                                            optionList={initData?.GoodsList.map((item, index) => {
                                                                 return { label: item.name, value: item.id }
                                                            })}
                                                       >
                                                       </Form.Select>
                                                       <Form.Input
                                                            field={`${field}[price]`}
                                                            label={`单价（固定单价）`}
                                                            rules={[{ required: true, message: '请输入单价' }]}
                                                       >
                                                       </Form.Input>
                                                       <Btn
                                                            type='danger'
                                                            theme='borderless'
                                                            icon={<IconMinusCircle />}
                                                            onClick={remove}
                                                            style={{ marginLeft: 1, marginTop: 10 }}
                                                       />
                                                  </div>
                                             ))
                                        }
                                   </>
                              )}
                         </ArrayField>
                         <Form.Input type="date" rules={[{ required: true, message: '必填' }]} label="方案生效开始日期" field="begintime" placeholder="请选择方案生效开始日期" />
                         <Form.Input type="date" rules={[{ required: true, message: '必填' }]} label="方案生效结束日期" field="endtime" placeholder="请选择方案生效结束日期" />
                         <Form.Select label="状态" rules={[{ required: true, message: '必填' }]} field="state" placeholder="请选择状态" >
                              <Form.Select.Option value="正常">正常</Form.Select.Option>
                              <Form.Select.Option value="取消">取消</Form.Select.Option>
                         </Form.Select>
                    </Form>
               </Modal>
               <Box mt={3} height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowData={list}
                         columnDefs={[
                              // {
                              //      "id": "1",
                              //      "companyid": "101",
                              //      "name": "商业用户",
                              //      "contactperson": "胡东CD",
                              //      "users": [
                              //          "165888"
                              //      ],
                              //      "goods": [
                              //          {
                              //              "goodsid": "2",
                              //              "goodsname": "12KG液化气",
                              //              "price": "105"
                              //          }
                              //      ],
                              //      "begintime": "2023-08-20 16:00:00.000",
                              //      "endtime": "2024-08-30 16:00:00.000",
                              //      "state": "正常"
                              //  }
                              { headerName: "配置名称", field: "name", sortable: true, filter: true, resizable: true, width: 200 },
                              { headerName: "对接人", field: "contactperson", sortable: true, filter: true, resizable: true, width: 200 },
                              { headerName: "用户memberid", field: "users", sortable: true, filter: true, resizable: true, width: 200, valueGetter: ({ data }) => data.users.join(',') },
                              {
                                   headerName: "商品", field: "goods", sortable: true, filter: true, resizable: true, width: 200, valueGetter: ({ data }) => data.goods.map(item => item.goodsname + '|单价' + item.price).join
                                        (',')
                              },
                              { headerName: "方案生效开始日期", field: "begintime", sortable: true, filter: true, resizable: true, width: 200 },
                              { headerName: "方案生效结束日期", field: "endtime", sortable: true, filter: true, resizable: true, width: 200 },
                              { headerName: "状态", field: "state", sortable: true, filter: true, resizable: true, width: 200 },
                              {
                                   headerName: "操作", pinned: 'right', cellRendererFramework: (params) => {
                                        return <Button size="small" onClick={() => {
                                             setOpen(true)
                                             setTimeout(() => {
                                                  console.log(params.data.begintime.substr(0, 10))
                                                  api.current.setValue('id', params.data.id)
                                                  api.current.setValue('action', 'UPDATE')
                                                  api.current.setValue('goods', params.data.goods)
                                                  api.current.setValues({ ...params.data })
                                                  api.current.setValue('begintime', moment(params.data.begintime.substr(0, 10)).format('YYYY-MM-DD'))
                                                  api.current.setValue('endtime', moment(params.data.endtime.substr(0, 10)).format('YYYY-MM-DD'))

                                             }, 100);
                                        }}>编辑</Button>
                                   }
                              },
                         ]}

                    />
               </Box>

          </Box>
     );
}

export default UserAgreementModificationPriceConfigList;