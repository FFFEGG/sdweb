import { Form, Modal } from "@douyinfe/semi-ui";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import { useRef, useState } from "react";
import request from "utils/request";

const PSBSalesStatisticsOfBrand = () => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))
     const [list, setList] = useState([])
     const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
     const api = useRef()
     const [sublist, setSublist] = useState([])
     const [show, setShow] = useState(false)
     const [keys, setKeys] = useState([])
     const getheaderName = (key) => {
          if (!key) {
               return ''
          }
          //将字符串[total]替换为（金额） [num] 替换为（数量）
          let headerName = key.replace('[total]', '(金额)').replace('[num]', '(数量)').replace(',', '.')
          return headerName
     }

     return (
          <Box p={3} bgcolor={'white'} borderRadius={1}>
               <Box fontSize={18} mb={3}>配送部 销售统计按品牌</Box>
               <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                         url: 'Srapp.Web_Report_Business_Infos.PSBSalesStatisticsOfBrand',
                         ...e,
                         // deliveryman: JSON.stringify(e.deliveryman),
                         department: JSON.stringify(e.department),
                    })
                    rew.data.info = rew.data.info.map(item => {
                         //将key中的'.'替换为','
                         let obj = {}
                         Object.keys(item).forEach(key => {
                              obj[key.replace('.', ',')] = item[key]
                         })
                         // 如果包含[num] 则将其转换为数量
                         Object.keys(obj).forEach(key => {
                              if (key.includes('[num]')) {
                                   obj[key] = parseFloat(obj[key])
                              }
                         })
                         // 如果包含[total] 则将其转换为金额
                         Object.keys(obj).forEach(key => {
                              if (key.includes('[total]')) {
                                   obj[key] = parseFloat(obj[key]).toFixed(2)
                              }
                         })

                         return obj
                    })

                    // {
                    //      "department": "衡阳店",
                    //      "巴马[total]": "25.0000",
                    //      "巴马[num]": "1.0",
                    //      "大明山[total]": 0,
                    //      "大明山[num]": 0,
                    //      "桂水[total]": 120,
                    //      "桂水[num]": 10,
                    //      "恒大[total]": 0,
                    //      "恒大[num]": 0,
                    //      "景田[total]": 0,
                    //      "景田[num]": 0,
                    //      "九千万[total]": 0,
                    //      "九千万[num]": 0,
                    //      "木论思泉[total]": 0,
                    //      "木论思泉[num]": 0,
                    //      "青秀山[total]": 60,
                    //      "青秀山[num]": 5,
                    //      "石埠[total]": 0,
                    //      "石埠[num]": 0,
                    //      "娃哈哈[total]": 16,
                    //      "娃哈哈[num]": 1,
                    //      "西津[total]": 23,
                    //      "西津[num]": 1,
                    //      "银安[total]": 0,
                    //      "银安[num]": 0
                    //  }
                    if (rew.data.info.length) {
                         //横向合计
                         rew.data.info.map(item => {
                              item['数量合计'] = Object.keys(item).reduce((a, b) => {
                                   if (b.includes('[num]')) {
                                        return a + parseFloat(item[b])
                                   } else {
                                        return a
                                   }
                              }, 0)
                              item['金额合计'] = Object.keys(item).reduce((a, b) => {
                                   if (b.includes('[total]')) {
                                        return a + parseFloat(item[b])
                                   } else {
                                        return a
                                   }
                              }, 0)
                              return item
                         })
                         //纵向合计
                         rew.data.info.push({
                              'department': '合计',
                              ...Object.keys(rew.data.info[0]).reduce((a, b) => {
                                   if (b.includes('[total]')) {
                                        a[b] = rew.data.info.reduce((c, d) => {
                                             return c + parseFloat(d[b])
                                        }, 0)
                                   } else if (b.includes('[num]')) {
                                        a[b] = rew.data.info.reduce((c, d) => {
                                             return c + parseFloat(d[b])
                                        }, 0)
                                   } else if (b.includes('数量')) {
                                        a[b] = rew.data.info.reduce((c, d) => {
                                             return c + parseFloat(d[b])
                                        }, 0)
                                   } else if (b.includes('金额')) {
                                        a[b] = rew.data.info.reduce((c, d) => {
                                             return c + parseFloat(d[b])
                                        }, 0)
                                   }
                                   return a
                              }
                                   , {})

                         })


                    }
                    setList(rew.data.info)



                    let keys = new Set();

                    rew.data.info.forEach(item => {
                         Object.keys(item).forEach(key => {
                              keys.add(key);
                         });
                    });

                    let keysArray = Array.from(keys);
                    // console.log(keysArray);
                    setKeys(keysArray);

                    // let keys = new Set();

                    // rew.data.info.forEach(item => {
                    //      Object.keys(item).forEach(key => {
                    //           keys.add(key);
                    //      });
                    // });

                    // let keysArray = Array.from(keys);
                    // // console.log(keysArray);
                    // setKeys(keysArray);
               }}>
                    <Form.Input field="begintime" label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field="endtime" label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                    {/* <Form.Select maxTagCount={2} multiple filter field="department" label="业务部门">
                         {
                              initData.DepartmentList.map((item, index) => {
                                   return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                              })
                         }
                    </Form.Select> */}
                    <Box overflow={'scroll'}>
                         <Form.TreeSelect filterTreeNode treeData={new_department_byname} leafOnly field="department" label="业务部门" maxTagCount={1} multiple />
                    </Box>
                    <Form.Select field="goodstype" label="类型" showClear>
                         <Form.Select.Option value={'桶装水'}>桶装水</Form.Select.Option>
                         <Form.Select.Option value={'支装水'}>支装水</Form.Select.Option>
                    </Form.Select>
                    {/* <Form.Select maxTagCount={2} multiple filter field="deliveryman" label="配送员">
                         {
                              initData.OperatorList.map((item, index) => {
                                   return <Form.Select.Option key={index} value={item.name}>{item.name}</Form.Select.Option>
                              })
                         }
                    </Form.Select> */}
                    <Button variant="contained" type="submit" size="small">查询</Button>
               </Form>
               <Box mt={3} height={'60vh'}>
                    <AgGridReact
                         className="ag-theme-balham"
                         columnDefs={
                              keys.map(key => {
                                   return {
                                        headerName: key == 'department' ? '部门' : getheaderName(key),
                                        field: key,
                                        sortable: true,
                                        filter: true,
                                        resizable: true,

                                   }
                              })
                         }
                         rowData={list}
                         onFirstDataRendered={(params) => {
                              params.api.sizeColumnsToFit();
                         }}
                    />
               </Box>



          </Box>
     )

}

export default PSBSalesStatisticsOfBrand;