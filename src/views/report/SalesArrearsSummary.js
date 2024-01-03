import {Form} from "@douyinfe/semi-ui";
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";
import moment from "moment";
import {useRef, useState} from "react";
import request from "utils/request";

const SalesArrearsSummary = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef(null)
    const [columnDefs, setColumnDefs] = useState([])
    const [list, setList] = useState([])
    return (<Box p={3} bgcolor={'white'} borderRadius={1}>
        <Box fontSize={18} mb={2}>销售欠款汇总</Box>
        <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
            const rew = await request('post', '/api/getInfo', {
                url: 'Srapp.Web_Report_Business_Infos.SalesArrearsSummary',
                ...e,
                attributiondepartment: JSON.stringify(e.attributiondepartment),
            })
            // 按照 salesman memberid addtime 排序
            rew.data.info.sort((a, b) => {
                if (a.salesman > b.salesman) {
                    return 1;
                } else if (a.salesman < b.salesman) {
                    return -1;
                } else {
                    if (a.memberid > b.memberid) {
                        return 1;
                    } else if (a.memberid < b.memberid) {
                        return -1;
                    } else {
                        if (a.addtime > b.addtime) {
                            return 1;
                        } else if (a.addtime < b.addtime) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            })
              rew.data.info.map(item=>{
                  item.addtime = item.addtime.substring(0,10)
                  if (item.collection_date) {
                      item.collection_date = item.collection_date.substring(0,10)
                  }

              })

            if (rew.data.info.length) {
                const hj = {
                    "salesman": "合计",
                    "num": rew.data.info.reduce((a, b) => a + Number(b.num), 0),
                    "total": rew.data.info.reduce((a, b) => a + parseFloat(b.total), 0),
                    "residual_air_total": rew.data.info.reduce((a, b) => a + parseFloat(b.residual_air_total), 0),
                    "pay_arrears": rew.data.info.reduce((a, b) => a + parseFloat(b.pay_arrears), 0),
                    "hk": rew.data.info.reduce((a, b) => a + parseFloat(b.hk), 0),
                }
                // 数组前后都添加合计
                rew.data.info.unshift(hj)

                rew.data.info.push(hj)
            }
            setList(rew.data.info)
        }}>
            {/* attributiondepartment	字符串	可选			用户归属部门(不传默认全部) JSON ["二区店","二桥店"]
          settlementmethod	枚举类型	必须		范围：月结/现结	欠款方式（月结,现结）
          type	枚举类型	必须		范围：已回款/未回款	属性（已回款,未回款）
          salesbegintime	日期	必须			销售起始时间
          salesendtime	日期	必须			销售结束时间
          collectionbegintime	日期	必须			回款起始时间
          collectionendtime	日期	必须			回款结束时间
          showtype	枚举类型	必须		范围：明细/汇总	属性（明细,汇总） */}


            <Box display={'flex'} width={'100%'} flexWrap={'wrap'} mb={1}>
                <Form.Input field="salesbegintime" label="销售起始时间" placeholder="请选择" type="date"
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field="salesendtime" label="销售结束时间" placeholder="请选择" type="date"
                            initValue={moment().format('YYYY-MM-DD')}/>
            </Box>
            <Box display={'flex'} width={'100%'} flexWrap={'wrap'} mb={1}>
                <Form.Input field="collectionbegintime" label="回款起始时间" placeholder="请选择" type="date"
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field="collectionendtime" label="回款结束时间" placeholder="请选择" type="date"
                            initValue={moment().format('YYYY-MM-DD')}/>


            </Box>

            <Box display={'flex'} width={'100%'}>
                <Form.Select field="attributiondepartment" label="用户归属部门" maxTagCount={1} placeholder="请选择"
                             multiple filter>
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map((item, index) => {
                            return <Form.Select.Option value={item.name} key={index}>{item.label}</Form.Select.Option>
                        })
                    }
                </Form.Select>
                <Form.Select rules={[{required: true, message: '不能为空'}]} field="settlementmethod" label="欠款方式"
                             placeholder="请选择" filter>
                    <Form.Select.Option value="月结">月结</Form.Select.Option>
                    <Form.Select.Option value="现结">现结</Form.Select.Option>
                </Form.Select>
                <Form.Select rules={[{required: true, message: '不能为空'}]} field="type" label="属性"
                             placeholder="请选择" filter>
                    <Form.Select.Option value="全部">全部</Form.Select.Option>
                    <Form.Select.Option value="已回款">已回款</Form.Select.Option>
                    <Form.Select.Option value="未回款">未回款</Form.Select.Option>
                </Form.Select>
                <Form.Select rules={[{required: true, message: '不能为空'}]} field="showtype" label="属性"
                             placeholder="请选择" filter>
                    <Form.Select.Option value="明细">明细</Form.Select.Option>
                    <Form.Select.Option value="汇总">汇总</Form.Select.Option>
                </Form.Select>

                <Button size="small" variant="contained" type="submit">搜索</Button>
            </Box>
        </Form>
        <Box mt={2} width={'100%'} height={'60vh'} overflow={'auto'}>
            <AgGridReact
                className="ag-theme-balham"
                rowData={list}
                columnDefs={[
                    // {
                    //      "id": "87",
                    //      "serial": "800220230726152025525770771",
                    //      "addtime": "2023-07-26 00:00:00.000",
                    //      "attribute": "实体商品",
                    //      "goodscat": "食品类",
                    //      "goodstype": "桶装水",
                    //      "goodsbrand": "西津",
                    //      "goodsname": "18.9L西津矿泉水",
                    //      "marketprice": "23.0000",
                    //      "price": "16.0000",
                    //      "num": "1.0",
                    //      "total": "16.0000",
                    //      "suttle": "5.0",
                    //      "reportsuttle": "5.0",
                    //      "payment": "月结支付",
                    //      "pay_arrears": "16.0000",
                    //      "pay_cash": ".0000",
                    //      "pay_balance": ".0000",
                    //      "pay_online": ".0000",
                    //      "pay_stock": ".0000",
                    //      "pay_cashgift": ".0000",
                    //      "pay_coupon": ".0000",
                    //      "userid": "487861",
                    //      "memberid": "605730",
                    //      "username": "公用",
                    //      "workplace": "",
                    //      "province": "广西壮族自治区",
                    //      "city": "南宁市",
                    //      "area": "兴宁区",
                    //      "town": "民生街道办事处",
                    //      "address": "长岗三里1巷43号一工校安技大楼接待室",
                    //      "attributiondepartment": "液化气公司",
                    //      "customertype": "家庭用户",
                    //      "salesman": "韦艳秀",
                    //      "developsalesman": "",
                    //      "department": "皇马店",
                    //      "deliveryman": "马明标",
                    //      "residual_air_price": "3.2000",
                    //      "residual_air_weight": "0.0",
                    //      "residual_air_total": ".0000",
                    //      "collection_date": "2023-07-26 00:00:00.000",
                    //      "collection_department": "配送部",
                    //      "collection_ope": "冯秋霞",
                    //      "collection_serial": "800020230726163611097919132"
                    //    }
                    // 业务员 归属部门 单位 会员号 欠款日期 商品 数量 小计 配送门店 残液金额 回款日期 实际回款 回款人 状态
                    {
                        headerName: '业务员',
                        field: 'salesman',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '归属部门',
                        field: 'attributiondepartment',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '单位',
                        field: 'workplace',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '会员号',
                        field: 'memberid',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '欠款日期',
                        field: 'addtime',
                        width: 120,
                        resizable: true,
                        sortable: true,
                        filter: true,

                    },
                    {
                        headerName: '商品',
                        field: 'goodsname',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {headerName: '数量', field: 'num', width: 100, resizable: true, sortable: true, filter: true,},
                    {headerName: '小计', field: 'total', width: 100, resizable: true, sortable: true, filter: true,},
                    {
                        headerName: '配送门店',
                        field: 'department',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '残液金额',
                        field: 'residual_air_total',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {
                        headerName: '回款日期',
                        field: 'collection_date',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    {headerName: '实际回款', field: 'hk', width: 100, resizable: true, sortable: true, filter: true,},
                    {
                        headerName: '回款人',
                        field: 'collection_ope',
                        width: 100,
                        resizable: true,
                        sortable: true,
                        filter: true,
                    },
                    // { headerName: '状态', field: 'status', width: 100, resizable: true, sortable: true, filter: true, },

                ]}


            />
        </Box>
    </Box>);
}

export default SalesArrearsSummary;