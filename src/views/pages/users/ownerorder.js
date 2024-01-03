import { Form } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import request from 'utils/request';
import UserInfo from './UserInfo';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import transulation from '../../../utils/translations.json'

const ownerorder = ({ customization }) => {
    // useEffect(() => {
    //     console.log(customization);
    // })
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([])
    const [groupbyaddress, setgroupbyaddress] = useState([])

    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    const groupBy = (data) => {
        let arr = data.reduce((acc, item) => {
            // { field: 'arrivetime', headerName: '订单时间', valueGetter: (params) => moment(params.data.arrivetime).format('YYYY-MM-DD') },
            // { field: 'mainorder.address', headerName: '地址' },
            // { field: 'goodsname', headerName: '商品名称' },
            // { field: 'price', headerName: '单价' },
            // { field: 'payment', headerName: '支付方式' },
            // { field: 'num', headerName: '数量' }
            const key = `${item.arrivetime}-${item.mainorder.address}-${item.goodsname}-${item.price}-${item.payment}`;
            if (!acc[key]) {
                acc[key] = {
                    arrivetime: item.arrivetime,
                    address: item.mainorder.address,
                    goodsname: item.goodsname,
                    price: item.price,
                    payment: item.payment,
                    num: 0
                };
            }
            acc[key].num += parseFloat(item.num);


            return acc;
        }, {});
        return Object.values(arr);
    }

    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <UserInfo userinfo={userinfo} />
            <Box fontSize={18} mt={2} mb={2}>个人订单统计</Box>
            <Form layout="horizontal" labelPosition="inset" onSubmit={async (e) => {
                const rew = await request('post', '/api/getInfo', {
                    "userid": userinfo.userid,
                    "url": "Srapp.Web_User_Infos.UserOrderInfo",
                    "distributionstore": "全部",
                    "department": "全部",
                    "state": "[\"已送达\"]",
                    ...e
                })
                let arr = rew.data
                let order_arr = [];


                for (let i = 0; i < arr.length; i++) {
                    const order = arr[i];
                    // let mainorder = array[i];
                    let mainorder = JSON.parse(JSON.stringify(arr[i]));
                    delete mainorder.suborder

                    for (let j = 0; j < order.suborder.length; j++) {
                        let suborder = order.suborder[j];
                        suborder.mainorder = mainorder;
                        order_arr.push(suborder)
                    }

                }

                let groupbyaddressandgoodsarr = []
                for (let i = 0; i < order_arr.length; i++) {
                    const element = order_arr[i];
                    groupbyaddressandgoodsarr.push({
                        address: element.mainorder.address,
                        goodsname: element.goodsname,
                        payment: element.payment,
                        num: element.num * 1
                    })
                }
                // 按照地址和商品名称分组
                let groupbyaddressandgoods = groupbyaddressandgoodsarr.reduce((prev, cur) => {
                    let index = prev.findIndex(item => item.address === cur.address && item.goodsname === cur.goodsname && item.payment === cur.payment)
                    if (index > -1) {
                        prev[index].num += cur.num
                    } else {
                        prev.push(cur)
                    }
                    return prev
                }, [])
                groupbyaddressandgoods.push({
                    address: '合计',
                    goodsname: '',
                    num: groupbyaddressandgoods.reduce((a, b) => a + b.num * 1, 0),
                })
                setgroupbyaddress(groupbyaddressandgoods)


                order_arr.push({
                    mainorder: {
                        addtime: '合计',
                        address: '合计',
                    },

                    num: order_arr.reduce((a, b) => a + b.num * 1, 0),
                })

                console.log('--------getorderlist-------', order_arr)



                setlist(order_arr)

            }}>
                <Form.Input field='begintime' label='开始时间' type="date" initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field='endtime' label='结束时间' type="date" initValue={moment().format('YYYY-MM-DD')} />
                {/* <Form.Input field='memberid' label='卡号' /> */}
                <Button type="submit" variant="outlined" size="small">搜索</Button>
            </Form>


            <Box height={'60vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={groupBy(list)}
                    localeText={transulation}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                    columnDefs={[

                        {
                            headerName: '换水日期查询(右键导出)', children: [
                                { field: 'arrivetime', headerName: '订单时间', valueGetter: (params) => !params.data.arrivetime?'合计':moment(params.data.arrivetime).format('YYYY-MM-DD') },
                                { field: 'address', headerName: '地址' },
                                { field: 'goodsname', headerName: '商品名称' },
                                { field: 'price', headerName: '单价' },
                                { field: 'payment', headerName: '支付方式' },
                                { field: 'num', headerName: '数量' }
                            ]
                        },

                    ]}

                />
            </Box>




            <Box height={'60vh'} overflow={'scroll'} mt={2}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={groupbyaddress}
                    localeText={transulation}
                    columnDefs={[

                        {
                            headerName: '按地址查询(右键导出)', children: [

                                { field: 'address', headerName: '地址' },
                                { field: 'goodsname', headerName: '商品名称' },
                                { field: 'payment', headerName: '支付方式' },

                                { field: 'num', headerName: '数量' }
                            ]
                        },

                    ]}

                />
            </Box>
        </Box>
    );
};
const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ownerorder);