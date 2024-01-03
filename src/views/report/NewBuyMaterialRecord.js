import { Form, Modal, Upload, Button as Buttons } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { IconUpload } from '@douyinfe/semi-icons';
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import request from "utils/request";
import translations from "../../utils/translations.json"
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";

const NewBuyMaterialRecord = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const [gaslist, setgaslist] = useState([])
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const [gasshow, setgasshow] = useState(false)
     const handleFileUpload = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsText(file);

          reader.onload = () => {
               const fileContent = reader.result;
               const jsonData = JSON.parse(fileContent);
               console.log('jsonData', jsonData)
               // this.setState({ jsonData });
               // const arr1 = jsonData.map(item => {
               //      return {
               //           packagingType: item.packagingType,
               //           productionYear: item.productionYear * 1,
               //           inspectionYear: item.inspectionYear * 1,
               //           isOwnUnit: item.isOwnUnit === "false" ? false : true,
               //           price: item.price * 1
               //      }
               // })
               // // 合并cylinders,和arr1 并去重
               // const arr2 = [...cylinders, ...arr1]
               // const uniqueArr = Array.from(new Set(arr2.map((obj) => JSON.stringify(obj)))).map((str) => JSON.parse(str));
               // console.log('uniqueArr', uniqueArr)
               // setCylinders(uniqueArr)
          };
     };

     const getDate = (dates) => {
          const dateNum = dates
          const date = XLSX.SSF.parse_date_code(dateNum)
          const lasttestdate = date ? new Date(date.y, date.m - 1, date.d, date.H, date.M, date.S) : null
          return moment(lasttestdate).format('YYYY-MM-DD')
     }
     const [invoicelist, setInvoice] = useState([])
     const gridRef = useRef();

     const onSelectionChanged = useCallback(() => {
          const selectedRows = gridRef.current.api.getSelectedRows();
          // console.log(selectedRows);
          setInvoice(selectedRows)
     }, []);

     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>钢瓶管理部 获取新购钢瓶生产信息</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Material_Infos.NewBuyMaterialRecord',
                         ...e,
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
                    setList(rew.data)
               }}>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    {/* <Form.Select maxTagCount={2} multiple filter field="department" label="业务部门">
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
                    </Form.Select> */}

                    <Box>
                         <Button sx={{ mr: 2 }} variant="contained" type="submit" size="small">查询</Button>
                    </Box>
                    <Button variant="contained" type="button" onClick={() => {
                         setgasshow(true)
                    }} size="small">EXCEL上传数据</Button>
                    {
                         invoicelist.length > 0 && <Button variant="contained" type="button" sx={{ ml: 2 }} onClick={async () => {
                              Modal.confirm({
                                   title: '提示',
                                   content: '确认取消吗？',
                                   onOk: async () => {

                                        const rew = await request('post', '/api/getInfo', {
                                             url: 'Srapp.Web_Material_Handle.CancelNewBuyMaterialRecord',
                                             ids: JSON.stringify(invoicelist.map(item => item.id))
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                             toast.success('操作成功')
                                             setInvoice([])
                                             api.current.submitForm()
                                        }
                                   }
                              })


                         }}>取消</Button>
                    }


               </Form>
               <Modal size="large" visible={gasshow} title="EXCEL上传数据" onCancel={() => {
                    setgasshow(false)
                    setgaslist([])
               }} footer={<></>}>
                    <Box >
                         <Upload action="http://srsdapi.sanrangas.com/" onFileChange={e => {
                              // console.log(e);
                              const file = e[0];
                              const reader = new FileReader();
                              // reader.readAsText(file);
                              if (reader.readyState === FileReader.DONE || reader.readyState === FileReader.EMPTY) {
                                   reader.onload = function (event) {
                                        const data = new Uint8Array(event.target.result)
                                        const workbook = XLSX.read(data, { type: 'array' })
                                        const sheetName = workbook.SheetNames[0]
                                        const worksheet = workbook.Sheets[sheetName]
                                        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                                        const dataArray = []
                                        for (let i = 1; i < rows.length; i++) {
                                             const row = rows[i]

                                             if (row[0]) {
                                                  const item = {
                                                       reg_number: row[0],
                                                       packingtype: row[1],
                                                       date4manufacture: getDate(row[2]),
                                                       // 解析时间格式
                                                       lasttestdate: getDate(row[3]),
                                                       nexttestdate: getDate(row[4]),
                                                       manufacturing_unit: row[5],
                                                       production_number: row[6],
                                                       weight: parseFloat(row[7]) == NaN ? 0 : parseFloat(row[7])
                                                  }
                                                  dataArray.push(item)
                                             }

                                        }
                                        setgaslist(dataArray)
                                        console.log(dataArray)
                                   }

                                   reader.readAsArrayBuffer(file)
                              } else {
                                   console.log('FileReader is busy')
                              }

                         }}>
                              <Buttons icon={<IconUpload />} theme="light">
                                   点击上传
                              </Buttons>
                         </Upload>
                         {
                              gaslist.length > 0 && <Button variant="contained" sx={{ mt: 3 }} onClick={async () => {
                                   const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_Material_Handle.AddNewBuyMaterialRecord',
                                        data: JSON.stringify(gaslist)
                                   })
                                   if (rew.data.msg === 'SUCCESS') {
                                        toast.success('上传成功')
                                        setgasshow(false)
                                        setgaslist([])
                                   } else {
                                        toast.error(rew.data.tips)
                                        setgasshow(false)
                                        setgaslist([])
                                   }
                              }}>确认上传</Button>
                         }

                         <table className="my-table" style={{ marginTop: 10 }}>
                              <thead>
                                   <tr>
                                        <td>钢瓶编号</td>
                                        <td>钢瓶类型</td>
                                        <td>生产日期</td>
                                        <td>最近检验日期</td>
                                        <td>下次检验日期</td>
                                        <td>生产单位</td>
                                        <td>生产编号</td>
                                        <td>钢瓶重量</td>
                                   </tr>
                              </thead>
                              <tbody>
                                   {
                                        gaslist.map((item, index) => {
                                             return <tr key={index}>
                                                  <td>{item.reg_number}</td>
                                                  <td>{item.packingtype}</td>
                                                  <td>{item.date4manufacture}</td>
                                                  <td>{item.lasttestdate}</td>
                                                  <td>{item.nexttestdate}</td>
                                                  <td>{item.manufacturing_unit}</td>
                                                  <td>{item.production_number}</td>
                                                  <td>{item.weight}</td>
                                             </tr>
                                        })
                                   }
                              </tbody>
                         </table>

                    </Box>
               </Modal>


               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         rowSelection="multiple"
                         localeText={translations}
                         ref={gridRef}
                         onSelectionChanged={onSelectionChanged}
                         columnDefs={[
                              // {
                              //      "id": "5",
                              //      "addtime": "2023-07-05 16:32:33.520",
                              //      "serial": null,
                              //      "reg_number": "1080000",
                              //      "packingtype": "YSP28.6",
                              //      "date4manufacture": "2023-07-01 00:00:00.000",
                              //      "lasttestdate": "2023-07-01 00:00:00.000",
                              //      "nexttestdate": "2027-07-01 00:00:00.000",
                              //      "manufacturing_unit": "台山市机械厂有限公司",
                              //      "production_number": "060234209790",
                              //      "weight": "13.699999999999999"
                              //  }
                              { field: 'addtime', headerName: '添加时间', flex: 1, sortable: true, filter: true, checkboxSelection: true, },
                              // { field: 'serial', headerName: '流水号', flex: 1, sortable: true, filter: true },
                              { field: 'reg_number', headerName: '钢瓶编号', flex: 1, sortable: true, filter: true },
                              { field: 'packingtype', headerName: '钢瓶类型', flex: 1, sortable: true, filter: true },
                              { field: 'date4manufacture', headerName: '生产日期', flex: 1, sortable: true, filter: true },
                              { field: 'lasttestdate', headerName: '最近检验日期', flex: 1, sortable: true, filter: true },
                              { field: 'nexttestdate', headerName: '下次检验日期', flex: 1, sortable: true, filter: true },
                              { field: 'manufacturing_unit', headerName: '生产单位', flex: 1, sortable: true, filter: true },
                              { field: 'production_number', headerName: '生产编号', flex: 1, sortable: true, filter: true },
                              { field: 'weight', headerName: '钢瓶重量', flex: 1, sortable: true, filter: true },
                              // {
                              //      headerName: '操作',
                              //      pinned: 'left',
                              //      cellRendererFramework: ({ data }) => <Button onClick={async e => {
                              //           Modal.confirm({
                              //                title: '提示',
                              //                content: '确认取消吗？',
                              //                onOk: async () => {
                              //                     const rew = await request('post', '/api/getInfo', {
                              //                          url: 'Srapp.Web_Material_Handle.CancelNewBuyMaterialRecord',
                              //                          id: data.id
                              //                     })
                              //                     if (rew.code === 200) {
                              //                          message.success('删除成功')
                              //                          api.current.refresh()
                              //                     }

                              //                }
                              //           })

                              //      }}>取消</Button>
                              // }

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
                         pagination={true}
                         paginationPageSize={30}
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

export default NewBuyMaterialRecord;