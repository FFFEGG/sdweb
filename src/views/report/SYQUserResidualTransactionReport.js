import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import request from "utils/request";

const SYQUserResidualTransactionReport = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const [list2, setList2] = useState([])
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
     const componentRef = useRef(null);
     const base64 = (content) => {
          return window.btoa(unescape(encodeURIComponent(content)));
     }
     const toexcel = (tableID, fileName) => {
          console.log('toexcel')
          var excelContent = document.getElementById(tableID).innerHTML;
          // 		alert(excelContent);
          // console.log(excelContent);

          excelContent = excelContent.replace(/memberid"/g,'memberid" style="mso-number-format:/@"')

          var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office'  xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><meta charset='UTF-8'>";
          excelFile += "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>";
          excelFile += "<body><table width='10%'  border='1' style='mso-number-format:/@;'>";
          excelFile += excelContent;
          excelFile += "</table></body>";
          excelFile += "</html>";
          var link = "data:application/vnd.ms-excel;base64," + base64(excelFile);
          var a = document.createElement("a");
          a.download = fileName + ".xls";
          a.href = link;
          a.click();
     }


     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>商用气用户余气交易报表</Box>
          <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SYQUserResidualTransactionReport',
                    ...e

               })

               // rew.data.detail 按照 salesman 排序

                rew.data.detail.sort((a,b)=>{
                    return a.salesman.localeCompare(b.salesman)
                })


                    


               setList(rew.data.info)
               setList2(rew.data.detail)


          }}>
               <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select field="payment" label="支付方式" initValue={'月结支付'}>
                    <Form.Select.Option value="月结支付">月结支付</Form.Select.Option>
                    <Form.Select.Option value="其它支付">其它支付</Form.Select.Option>
               </Form.Select>
               <Form.Select rules={[
                    { required: true, message: '必填' }
               ]} field="department" label="销账部门" filter maxTagCount={2}>
                    {
                         initData.DepartmentList.map(item =>
                              <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                         )
                    }
               </Form.Select>

               <Box>
                    <Button size="small" variant="outlined" type="submit">搜索</Button>

                    <Button onClick={()=>{
                         //导出excel
                         // printJS({
                         toexcel('table1','商用气用户余气交易报表')
                    }} variant="outlined" sx={{ ml: 2 }} size="small">导出</Button>
               </Box>



          </Form>

          <Box mt={3} ref={componentRef} id={'table1'}>

               <table className="my-table">
                    <thead>
                         <tr>
                              <td>余气类型</td>
                              <td>余气金额</td>
                              <td>笔数</td>
                              <td>余气折吨</td>
                              <td>业务部门</td>
                              <td>销账部门</td>
                              <td>支付方式 </td>
                              <td> </td>
                              <td> </td>
                              <td> </td>
                              <td> </td>
                              <td> </td>


                         </tr>
                    </thead>
                    <tbody>
                         {

                              list.map(item => <tr>
                                   <td>{item.type}</td>
                                   <td>{parseFloat(item.total).toFixed(2)}</td>
                                   <td>{item.recordsnum}</td>
                                   <td>{item.AsTon.toFixed(4)}</td>
                                   <td>{item.transactiondepartment}</td>
                                   <td>{item.writeoffdepartment}</td>
                                   <td>{item.payment}</td>
                                   <td></td>
                                   <td></td>
                                   <td> </td>
                                   <td> </td>

                                   <td> </td>

                              </tr>)
                         }
                         <tr>
                              <td>合计</td>
                              <td>{list.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2)}</td>
                              <td>{list.reduce((a, b) => a + parseFloat(b.recordsnum), 0)}</td>
                              <td>{list.reduce((a, b) => a + parseFloat(b.AsTon), 0).toFixed(4)}</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td> </td>
                              <td> </td>
                              <td> </td>


                         </tr>
                         <tr>
                              <td colSpan={13}>明细</td>
                         </tr>
                         <tr>

                              <td>确认日期</td>

                              <td>业务部门</td>
                              <td>配送人员</td>
                              <td>卡号</td>
                              <td>单位</td>
                              <td>归属部门</td>
                              <td>业务员</td>
                              <td>余气单价</td>
                              <td>重量</td>
                              <td>金额</td>
                              <td>销帐部门</td>
                              <td>确认人</td>


                         </tr>
                         {
                              list2.map(item => <tr>
                                   <td>{item.addtime}</td>

                                   <td>{item.department}</td>
                                   <td>{item.deliveryman}</td>
                                   <td>{item.memberid}</td>
                                   <td>{item.workplace}</td>
                                   <td>{item.attributiondepartment}</td>
                                   <td>{item.salesman}</td>
                                   <td>{item.price}</td>
                                   <td>{item.num.toFixed(4)}</td>
                                   <td>{item.total.toFixed(2)}</td>
                                   <td>{item.writeoffdepartment}</td>
                                   <td>{item.operator}</td>
                              </tr>)
                         }
                         <tr>
                              <td>合计</td>
                              <td></td>
                              <td></td>

                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{list2.reduce((a, b) => a + parseFloat(b.num), 0).toFixed(4)}</td>
                              <td>{list2.reduce((a, b) => a + parseFloat(b.total), 0).toFixed(2)}</td>
                              <td></td>


                         </tr>

                    </tbody>

               </table>

          </Box>

     </Box>;
}

export default SYQUserResidualTransactionReport;