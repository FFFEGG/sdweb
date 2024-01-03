import { Form } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const TZBSalesStatistics = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const [Detailedlist, setDetailedlist] = useState([])
     const api = useRef(null)
     return <Box p={3} bgcolor={'white'} borderRadius={1}>
          <Box fontSize={18} mb={3}>拓展部销售统计</Box>
          <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Business_Infos.TZBSalesStatistics',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
               })
               rew.data.info.map(item => {
                    item['45KG液化气(代)[suttle]'] = parseFloat(item['45KG液化气(代)[suttle]'] || 0)
                    item['45KG液化气(代)[num]'] = parseInt(item['45KG液化气(代)[num]'] || 0)

                    item['12KG液化气(代)[suttle]'] = parseFloat(item['12KG液化气(代)[suttle]'] || 0)
                    item['12KG液化气(代)[num]'] = parseInt(item['12KG液化气(代)[num]'] || 0)
                    item['4KG液化气(代)[suttle]'] = parseFloat(item['4KG液化气(代)[suttle]'] || 0)
                    item['4KG液化气(代)[num]'] = parseInt(item['4KG液化气(代)[num]'] || 0)
                    item.zd = item['45KG液化气(代)[suttle]'] + item['12KG液化气(代)[suttle]'] + item['4KG液化气(代)[suttle]']
               })
               rew.data.info.push({
                    username: '合计',
                    '45KG液化气(代)[suttle]': rew.data.info.reduce((a, b) => a + b['45KG液化气(代)[suttle]'], 0),
                    '45KG液化气(代)[num]': rew.data.info.reduce((a, b) => a + b['45KG液化气(代)[num]'], 0),

                    '12KG液化气(代)[suttle]': rew.data.info.reduce((a, b) => a + b['12KG液化气(代)[suttle]'], 0),
                    '12KG液化气(代)[num]': rew.data.info.reduce((a, b) => a + b['12KG液化气(代)[num]'], 0),
                    '4KG液化气(代)[suttle]': rew.data.info.reduce((a, b) => a + b['4KG液化气(代)[suttle]'], 0),
                    '4KG液化气(代)[num]': rew.data.info.reduce((a, b) => a + b['4KG液化气(代)[num]'], 0),
                    zd: rew.data.info.reduce((a, b) => a + b.zd, 0)
               })
               setList(rew.data.info)
          }}>
               <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
               <Form.Select field="salesman" label="业务员" multiple maxTagCount={2} filter>
                    {
                         initData.OperatorList.filter(item => item.department == loginuser.login_department).map(item =>
                              <Form.Select.Option key={item.id} value={item.name}>{item.name}</Form.Select.Option>
                         )
                    }
               </Form.Select>
               <Button variant="contained" size="small" type="submit">查询</Button>

               <Button onClick={() => {
                    //导出table
                    const table = document.querySelector('#apptable2')
                    const tableHtml = table.outerHTML
                    const a = document.createElement('a')
                    a.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(tableHtml)))
                    a.download = '拓展部销售统计.xls'
                    a.click()


               }} variant="contained" size="small" sx={{ ml: 3 }} type="button">导出1</Button>

               <Button onClick={() => {
                    //导出table
                    const table = document.querySelector('#apptable')
                    const tableHtml = table.outerHTML
                    const a = document.createElement('a')
                    a.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(tableHtml)))
                    a.download = '拓展部销售统计明细.xls'
                    a.click()


               }} variant="contained" size="small" sx={{ ml: 3 }} type="button">导出2</Button>


          </Form>

          <Box mt={3} display={'flex'}>
               <Box width={1 / 3} textAlign={'center'}>
                    <table id="apptable2" className="my-table">
                         <thead>
                              <tr>
                                   <td>用户</td>
                                   <td>45KG重</td>
                                   <td>12KG重</td>
                                   <td>4KG重</td>
                                   <td>折吨</td>
                              </tr>
                         </thead>
                         <tbody>
                              {

                                   list.map(item => <tr key={item.salesman}>
                                        <td><Box onClick={async () => {
                                             if (item.username == '合计') {
                                                  return
                                             }
                                             setDetailedlist([])
                                             const rew = await request('post', '/api/getInfo', {
                                                  url: 'Srapp.Web_Report_Business_Infos.TZBSalesStatisticsDetailed',

                                                  username: JSON.stringify([item.username]),
                                                  begintime: api.current.getValue('begintime'),
                                                  endtime: api.current.getValue('endtime'),
                                             })
                                             setDetailedlist(rew.data.info)

                                        }} color={'blue'} style={{ cursor: 'pointer' }}>{item.username}</Box></td>
                                        <td>{item['45KG液化气(代)[num]']}</td>
                                        <td>{item['12KG液化气(代)[num]']}</td>
                                        <td>{item['4KG液化气(代)[num]']}</td>
                                        <td>{item.zd.toFixed(3)}</td>
                                   </tr>)
                              }
                         </tbody>

                    </table>
               </Box>
               <Box width={2 / 3} ml={2} textAlign={'center'}>
                    <table id="apptable" className="my-table">

                         <thead>
                              <tr>
                                   <td>时间</td>
                                   <td>业务员</td>
                                   <td>用户</td>
                                   <td>销售方式</td>
                                   <td>商品名称</td>
                                   <td>数量</td>
                                   <td>单价</td>
                                   <td>总价</td>
                              </tr>
                         </thead>
                         <tbody>
                              {

                                   Detailedlist.map(item => <tr key={item.salesman}>
                                        <td>{item.addtime?.substring(0, 10)}</td>
                                        <td>{item.salesman}</td>
                                        <td>{item.username}</td>
                                        <td>{item.mode}</td>
                                        <td>{item.goodsname}</td>
                                        <td>{item.num}</td>
                                        <td>{item.price}</td>
                                        <td>{item.total}</td>
                                   </tr>)
                              }
                         </tbody>

                    </table>

               </Box>

          </Box>
     </Box>;
}

export default TZBSalesStatistics;