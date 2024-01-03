import { Form } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import moment from 'moment/moment';
import React, { useState } from 'react';
import printpdf from 'utils/printpdf';
import request from 'utils/request';

const SalesReportWater = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [casharrears, setCasharrears] = useState([])
     const [montharrears, setMontharrears] = useState([])
     const [receivedmontharrears, setReceivedmontharrears] = useState([])
     const [sales, setSales] = useState([])
     // 格式化数字 
     const formatNum = (num) => {
          return parseFloat(num)
     }

     const groupBy = (data) => {
          let arr =  data.reduce((acc, item) => {
               // <td>{item.memberid}</td>
               // <td>{item.workplace}</td>
               // <td>{item.goodsname}</td>
               // <td>{formatNum(item.num)}</td>
               // <td>{formatNum(item.total)}</td>
               // item.workplace.replace('?','')
               const key = `${item.memberid}-${item.workplace}-${item.goodsname}`;
               if (!acc[key]) {
                    acc[key] = {
                            memberid: item.memberid,
                            workplace: item.workplace,
                            goodsname: item.goodsname,
                            num: 0,
                            total: 0,
                    };
               }
                acc[key].num += formatNum(item.num);
                acc[key].total += formatNum(item.total);
               return acc;
          }, {});
          return Object.values(arr);
     }
     const getlist = (list, type) => {
          // if (type == '包装物') {
          //     return list.filter(item => item.mode === '业务办理-押金包装物')
          // }

          // if (type == '退押金款') {
          //     return list.filter(item => item.mode === '退押金款')
          // }

          // if (type == '收') {
          //     return list.filter(item => item.inandout === '收')
          // }

          // if (type == '支') {
          //     return list.filter(item => item.inandout === '支')
          // }

          if (type == '库存款支付') {
               return list.filter(item => item.paystock > 0 && item.project !== '合计')
          }
          return []
     }
     const api = React.useRef(null);

     return <Box p={3} bgcolor={'#fff'} borderRadius={1}>
          <Box fontSize={18} mb={3}>水公司销售报表</Box>
          <Form getFormApi={e => api.current = e} onChange={e => {
               setCasharrears([])
               setMontharrears([])
               setReceivedmontharrears([])
               setSales([])
          }} layout="horizontal" labelPosition="inset" onSubmit={async e => {
               const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.SalesReport',
                    ...e,
                    type: '水公司报表',
                    formatype: '水公司报表',
                    department: JSON.stringify(e.department),
               })
               rew.data.info.montharrears.map(item=>{
                    item.workplace = item.workplace.replace('?','')
               })
               rew.data.info.montharrears.sort((a,b)=>{
                    return a.workplace.localeCompare(b.workplace)
                })

               setCasharrears(rew.data.info.casharrears)
               setMontharrears(rew.data.info.montharrears)
               setReceivedmontharrears(rew.data.info.receivedmontharrears)

               // rew.data.info.sales 按照商品名称分组 数量合计
               const saleslist = rew.data.info.sales.reduce((total, item) => {
                    const index = total.findIndex(i => i.goodsname === item.goodsname)
                    if (index > -1) {
                         total[index].num += formatNum(item.num)
                         total[index].paycash += formatNum(item.paycash)
                         total[index].payonline += formatNum(item.payonline)
                         total[index].payarrears += formatNum(item.payarrears)
                         total[index].paybalance += formatNum(item.paybalance)
                         total[index].paycashgift += formatNum(item.paycashgift)
                         total[index].paystock += formatNum(item.paystock)
                         total[index].total += formatNum(item.total)
                    } else {
                         total.push({
                              goodsname: item.goodsname,
                              num: formatNum(item.num),
                              paycash: formatNum(item.paycash),
                              payonline: formatNum(item.payonline),
                              payarrears: formatNum(item.payarrears),
                              paybalance: formatNum(item.paybalance),
                              paycashgift: formatNum(item.paycashgift),
                              paystock: formatNum(item.paystock),
                              total: formatNum(item.total),
                         })
                    }
                    return total
               }, [])

               setSales(saleslist)



               // setSales(rew.data.info.sales)


          }}>
               <Form.Select initValue={[loginuser.login_department]} filter field='department' maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                         (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部') ?

                              initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                              :
                              <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

               </Form.Select>

               <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 250 }} />
               <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 250 }} />
               <Button type="submit" variant="outlined" size="small">搜索</Button>

               <Button sx={{ ml: 2 }} type="button" onClick={() => {
                    printpdf('apptable')
               }} variant="outlined" size="small">打印</Button>
          </Form>
          <Box id="apptable">
               <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#000',
                    marginTop: 10,
               }}>
                    <div>时间:
                         {api.current?.getValue('begintime')}至{api.current?.getValue('endtime')}
                    </div>
                    <div>打印人:
                         {loginuser.name}
                    </div>
                    <div>
                         部门:
                         {api.current?.getValue('department') }
                    </div>

               </div>
               <Box mt={3} mb={3} fontSize={18}>南宁三燃公司站点水销售报表</Box>
               <table className='my-table'>
                    <thead>
                         <tr>
                              <td>商品名称</td>
                              <td>数量</td>
                              <td>现金支付</td>
                              <td>微信支付</td>
                              <td>月结支付</td>
                              <td>余额支付</td>
                              <td>混合支付</td>
                              <td>库存款支付</td>
                              <td>小计</td>
                         </tr>
                         {
                              sales.map(item => <tr>

                                   <td>{item.goodsname}</td>
                                   <td>{formatNum(item.num) * 1}</td>
                                   <td>{formatNum(item.paycash).toFixed(2)}</td>
                                   <td>{formatNum(item.payonline).toFixed(2)}</td>
                                   <td>{formatNum(item.payarrears).toFixed(2)}</td>
                                   <td>{formatNum(item.paybalance).toFixed(2)}</td>
                                   <td>{formatNum(item.paycashgift).toFixed(2)}</td>
                                   <td>{formatNum(item.paystock).toFixed(2)}</td>
                                   <td>{formatNum(item.total).toFixed(2)}</td>
                              </tr>)
                         }
                         <tr>
                              <td>合计</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.num), 0)*1}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.paycash), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.payonline), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.payarrears), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.paybalance), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.paycashgift), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.paystock), 0).toFixed(2)}</td>
                              <td>{sales.reduce((total, item) => total + formatNum(item.total), 0).toFixed(2)}</td>
                         </tr>


                    </thead>
               </table>
               <Box mt={3}></Box>
               <table className='my-table'>
                    <thead>
                         <tr>
                              <td colSpan={3}>附表（本门店库存款支付）</td>
                         </tr>
                         <tr>
                              <td>商品名称</td>
                              <td>数量</td>

                              <td>小计</td>


                         </tr>
                         {
                              getlist(sales, '库存款支付').map(item => <tr>

                                   <td>{item.goodsname}</td>
                                   <td>{formatNum(item.num)}</td>

                                   <td>{formatNum(item.paystock).toFixed(2)}</td>

                              </tr>)
                         }
                         <tr>
                              <td>合计</td>
                              <td>{getlist(sales, '库存款支付').reduce((total, item) => total + formatNum(item.num), 0)}</td>
                              <td>{getlist(sales, '库存款支付').reduce((total, item) => total + formatNum(item.paystock), 0).toFixed(2)}</td>

                         </tr>


                    </thead>
               </table>


               <Box mt={3} mb={3} fontSize={18}>南宁三燃公司站点水欠款报表</Box>
               <table className='my-table'>
                    <thead>
                         <tr>
                              <td> 会员号</td>
                              <td>	单位</td>
                              <td>	商品名称</td>
                              <td>	数量</td>
                              <td>	小计</td>
                         </tr>
                    </thead>
                    <tbody>
                         {
                              groupBy(montharrears).map(item => <tr>
                                   <td>{item.memberid}</td>
                                   <td>{item.workplace}</td>
                                   <td>{item.goodsname}</td>
                                   <td>{formatNum(item.num)}</td>
                                   <td>{formatNum(item.total).toFixed(2)}</td>
                              </tr>)
                         }
                         <tr>
                              <td colSpan={3}>合计</td>
                              <td>{montharrears.reduce((total, item) => total + formatNum(item.num), 0)}</td>
                              <td>{montharrears.reduce((total, item) => total + formatNum(item.total), 0).toFixed(2)}</td>
                         </tr>
                    </tbody>

               </table>
          </Box>

     </Box >;
}

export default SalesReportWater;