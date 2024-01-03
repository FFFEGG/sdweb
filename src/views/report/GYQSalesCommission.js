import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import moment from "moment";
import printJS from "print-js";
import { useRef, useState } from "react";
import request from "utils/request";
import ReactToPrint from 'react-to-print';

const GYQSalesCommission = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const componentRef = useRef();
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

     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box sx={{ fontSize: 18 }} mb={3}>工业气销售提成</Box>
          <Form labelPosition="inset" layout="horizontal" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.GYQSalesCommission',
                    ...e,
                    attributiondepartment: JSON.stringify(e.attributiondepartment)
               })
               rew.data.info.map(item => {
                    item.preferential = parseFloat(item.preferential).toFixed(2)
                    item.salesresidual = parseFloat(item.salesresidual).toFixed(4)
                    item.suttle = parseFloat(item.suttle).toFixed(4)
                    item.commission = parseFloat(item.commission).toFixed(2)
               })
               setList(rew.data.info)
          }}>
               <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select multiple filter field="attributiondepartment" label="归属部门" placeholder="请选择归属部门" >
                    {
                         initData.DepartmentList.filter(item => item.manage_users == 1).map((item, index) => {
                              return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                         })
                    }
               </Form.Select>
               <Button variant="contained" size="small" type="submit">查询</Button>
               <Button onClick={()=>{
                    //导出excel
                    // printJS({
                    toexcel('table1','工业气销售提成')
               }} variant="contained" sx={{ ml: 2 }} size="small" type="submit">导出</Button>
          </Form>
          <Box mt={3} ref={componentRef} id={'table1'}>
               <table className="my-table table-bordered">
                    <thead>
                         <tr>
                              <td colSpan={9} style={{ textAlign: 'center', fontSize: 17 }}>非月结提成表</td>
                         </tr>
                         <tr>
                              <td>业务部门</td>
                              <td>商品名称</td>
                              <td>支付方式</td>
                              <td>优惠</td>
                              <td>数量</td>
                              <td>销售折吨</td>
                              <td>销售余气</td>
                              <td>折吨单价</td>
                              <td>提成</td>
                         </tr>
                    </thead>
                    <tbody>
                         {
                              list.filter(item => item.payment == '非月结').map((item, index) => {
                                   return <tr key={index}>
                                        <td>{item.department}</td>
                                        <td>{item.goodsname}</td>
                                        <td>{item.payment}</td>
                                        <td>{item.preferential}</td>
                                        <td>{item.num}</td>
                                        <td>{item.suttle }</td>
                                        <td>{item.salesresidual}</td>
                                        <td>{parseFloat(item.commissionprice).toFixed(2)}</td>
                                        <td>{item.commission}</td>

                                   </tr>
                              })
                         }
                         <tr>
                              <td>合计</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{list.filter(item => item.payment == '非月结').reduce((total, item) => total + item.num * 1, 0)}</td>
                              <td>{list.filter(item => item.payment == '非月结').reduce((total, item) => total + item.suttle * 1, 0).toFixed(3)}</td>
                              <td>{list.filter(item => item.payment == '非月结').reduce((total, item) => total + item.salesresidual * 1, 0).toFixed(4)}</td>
                              <td></td>
                              <td>{list.filter(item => item.payment == '非月结').reduce((total, item) => total + item.commission * 1, 0).toFixed(2)}</td>
                         </tr>
                    </tbody>
               </table>


               <table className="my-table table-bordered" style={{ marginTop: 30 }}>
                    <thead>
                         <tr>
                              <td colSpan={9} style={{ textAlign: 'center', fontSize: 17 }}>月结提成表</td>
                         </tr>
                         <tr>
                              <td>业务部门</td>
                              <td>商品名称</td>
                              <td>支付方式</td>
                              <td>优惠</td>
                              <td>数量</td>
                              <td>销售折吨</td>
                              <td>销售余气</td>
                              <td>折吨单价</td>
                              <td>提成</td>
                         </tr>
                    </thead>
                    <tbody>
                         {
                              list.filter(item => item.payment == '月结').map((item, index) => {
                                   return <tr key={index}>
                                        <td>{item.department}</td>
                                        <td>{item.goodsname}</td>
                                        <td>{item.payment}</td>
                                        <td>{item.preferential}</td>
                                        <td>{item.num}</td>
                                        <td>{item.suttle * 1}</td>
                                        <td>{item.salesresidual * 1}</td>
                                        <td>{item.commissionprice}</td>
                                        <td>{item.commission}</td>
                                   </tr>
                              })
                         }
                         <tr>
                              <td>合计</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{list.filter(item => item.payment == '月结').reduce((total, item) => total + item.num * 1, 0)}</td>
                              <td>{list.filter(item => item.payment == '月结').reduce((total, item) => total + item.suttle * 1, 0).toFixed(3)}</td>
                              <td>{list.filter(item => item.payment == '月结').reduce((total, item) => total + item.salesresidual * 1, 0).toFixed(3)}</td>
                              <td></td>
                              <td>{list.filter(item => item.payment == '月结').reduce((total, item) => total + item.commission * 1, 0).toFixed(2)}</td>

                         </tr>
                    </tbody>
               </table>

          </Box>
     </Box>;
}

export default GYQSalesCommission;