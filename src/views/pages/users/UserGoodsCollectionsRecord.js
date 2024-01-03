import { Form } from '@douyinfe/semi-ui';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import request from 'utils/request';
import translation from 'utils/translations.json';
//用户收款信息
const UserGoodsCollectionsRecord = ({ userinfo }) => {
    const [data, setData] = useState([]);
    const [goodsarr, setGoodsarr] = useState([]);

    const columnDefs = [
        { headerName: "时间", field: "addtime" },
        { headerName: "收支", field: "inandout" },
        { headerName: "收款方式", field: "mode" },
        { headerName: "商品名称", field: "goodsname" },
        { headerName: "现金", field: "pay_cash" },
        { headerName: "余额", field: "pay_balance" },
        { headerName: "专项款", field: "pay_cashgift" },
        // { headerName: "月结欠款", field: "pay_arrears" },
        { headerName: "优惠券", field: "pay_coupon" },
        { headerName: "库存款", field: "pay_stock" },
        { headerName: "在线支付", field: "pay_online" },
        { headerName: "在线支付账号", field: "online_paymentaccount" },
        { headerName: "部门", field: "department" },
        { headerName: "操作员", field: "operator" }
    ]

    const ref = useRef()
    return (
        <Box>
            <Form layout="horizontal" labelPosition="inset" onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_User_Infos.UserGoodsCollectionsRecord',
                    ...e,
                    userid: userinfo.userid,
                    begintime: moment(e.date[0]).format('YYYY-MM-DD'),
                    endtime: moment(e.date[1]).format('YYYY-MM-DD'),
                    date: undefined
                })
                rew.data.push({
                    addtime: '合计',
                    pay_cash: rew.data.reduce((a, b) => a + parseFloat(b.pay_cash), 0),
                    pay_balance: rew.data.reduce((a, b) => a + parseFloat(b.pay_balance), 0),
                    pay_cashgift: rew.data.reduce((a, b) => a + parseFloat(b.pay_cashgift), 0),
                    pay_arrears: rew.data.reduce((a, b) => a + parseFloat(b.pay_arrears), 0),
                    pay_coupon: rew.data.reduce((a, b) => a + parseFloat(b.pay_coupon), 0),
                    pay_stock: rew.data.reduce((a, b) => a + parseFloat(b.pay_stock), 0),
                    pay_online: rew.data.reduce((a, b) => a + parseFloat(b.pay_online), 0),
                })
                setData(rew.data)

                let arr = new Set()
                rew.data.forEach(item => {
                    if (item.goodsname !== undefined) {
                        arr.add(item.goodsname)
                    }
                })
                console.log('arr', Array.from(arr))

                setGoodsarr(Array.from(arr))
            }} onChange={e => {
                let key = e.values?.goodsname || ''
                ref.current.api.setQuickFilter(key)
            }}>
                {/* <Form.Input label="开始时间" type='date' field='begintime' initValue={'1999-01-01'} />
                <Form.Input label="结束时间" type='date' field='endtime' initValue={moment().format('YYYY-MM-DD')} /> */}
                <Form.DatePicker label="日期" field="date" initValue={['1999-01-01', new Date()]} type="dateRange" presets={[
                    {
                        text: '最近一周',
                        end: new Date(),
                        start: moment().subtract(7, 'days').toDate(),

                    },
                    {
                        text: '最近三个月',
                        end: new Date(),
                        start: moment().subtract(3, 'months').toDate(),
                    },
                    {
                        text: '最近一年',
                        end: new Date(),
                        start: moment().subtract(1, 'years').toDate(),
                    }
                ]} />
                <Form.Select filter label="商品名称" field="goodsname" style={{ width: 200 }}>
                    <Form.Select.Option value={''}>全部</Form.Select.Option>
                    {goodsarr.map(item => <Form.Select.Option value={item}>{item}</Form.Select.Option>)}
                </Form.Select>
                <Button type="submit" size="small" variant="outlined">搜索</Button>
            </Form>

            <Box height={'60vh'} overflow="scroll" mt={2}>
                <AgGridReact
                    getRowStyle={params => {
                        if (params.data && params.data.inandout === '支') {
                            return { color: "red" }
                        }

                        return { color: "black" }
                    }}
                    ref={ref}
                    localeText={translation}
                    className="ag-theme-balham"
                    columnDefs={columnDefs}
                    rowData={data}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                    defaultColDef={{

                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,

                    }}
                />
            </Box>
        </Box>
    );
};

export default UserGoodsCollectionsRecord;