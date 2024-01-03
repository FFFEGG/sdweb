import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from 'react-toastify';

const CollectionReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const api = useRef();
    const [sublist, setsublist] = useState([])
    const [subopen, setsubopen] = useState(false)
    const [physicalcoupon, setphysicalcoupon] = useState([])


    const getlist = (list, type) => {
        if (type == '包装物') {
            return list.filter(item => item.mode === '业务办理-押金包装物')
        }

        if (type == '退押金款') {
            return list.filter(item => item.mode === '退押金款')
        }

        if (type == '收') {
            return list.filter(item => item.inandout === '收')
        }

        if (type == '支') {
            return list.filter(item => item.inandout === '支')
        }

        if (type == '库存款支付') {
            return list.filter(item => item.paystock > 0 && item.project !== '合计')
        }
        return []
    }

    const gettotal = (list, key) => {
        return list.reduce((a, b) => {
            return a + parseFloat(b[key])
        }, 0)

    }


    const getCollectionReportDetail = async (data, type) => {
        // department	字符串	可选			业务部门(不传默认全部) JSON ["二区店","二桥店"]
        // type	字符串	必须			收款报表配置名称
        // mode	字符串	必须			方式
        // goodsname	字符串	必须			商品名称
        // packingtype	字符串	可选			包装物类型
        // inandout	枚举类型	必须		范围：收/支	收支
        // collectiontype	枚举类型	必须		范围：现结欠款/月结欠款/余额支付/现金支付/专项款支付/优惠券支付/在线支付/库存款支付	款项类型
        // begintime	日期	必须			起始时间
        // endtime	日期	必须			结束时间
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Report_Finance_Infos.CollectionReportDetailed',
            ...data,
            department: JSON.stringify(api.current.getValue('department')),
            begintime: api.current.getValue('begintime'),
            endtime: api.current.getValue('endtime'),
            collectiontype: type,
            type: api.current.getValue('type'),
        })
        setsublist(rew.data.info)
        setsubopen(true)
    }



    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取收款报表</Typography>
            <Form getFormApi={e => api.current = e} onChange={e => {
                setList([])
            }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.CollectionReport',
                    ...e,
                    department: JSON.stringify(e.department),
                })
                if (rew.data.msg === 'ERROR') {
                    toast.error(rew.data.tips)
                    return
                }
                // 格式化数据 parseFloat
                const formatlist = rew.data.info.map(item => {
                    return {
                        ...item,
                        casharrears: parseFloat(item.casharrears),
                        payarrears: parseFloat(item.payarrears),
                        paybalance: parseFloat(item.paybalance),
                        paycash: parseFloat(item.paycash),
                        paystock: parseFloat(item.paystock),
                        paycoupon: parseFloat(item.paycoupon),
                        payonline: parseFloat(item.payonline),

                        paycashgift: parseFloat(item.paycashgift),
                        // paystock: parseFloat(item.paystock),
                        total: parseFloat(item.casharrears)
                            + parseFloat(item.payarrears)
                            + parseFloat(item.paybalance)

                            + parseFloat(item.paycash)
                            + parseFloat(item.paystock)

                            + parseFloat(item.paycoupon)
                            + parseFloat(item.payonline)
                            + parseFloat(item.paycashgift)



                    }
                })
                setList(formatlist)
                // 格式化数据 parseFloat
                const formatphysicalcoupon = rew.data.physicalcoupon.map(item => {
                    return {
                        ...item,
                        // <td>{item.price}</td>
                        // <td>{item.num}</td>
                        // <td>{item.salesprice}</td>
                        price: parseFloat(item.price),
                        num: parseFloat(item.num),
                        salesprice: parseFloat(item.salesprice),
                    }
                })

                setphysicalcoupon(formatphysicalcoupon)

            }} layout='horizontal' labelPosition="inset">

                {
                    loginuser.login_department == '财务部' &&
                    <Form.Select field="online_paymentaccount" label="线上支付账号" style={{ width: 200 }}>
                        {/* wechatpay_1586841541  微信支付(三燃液化气)
                        wechatpay_1632047539  微信支付(桂清源)
                        wechatpay_1632271520 微信支付(绿城一脉) */}
                        {/* <Form.Select.Option></Form.Select.Option> */}
                        <Form.Select.Option value="wechatpay_1586841541">微信支付(三燃液化气)</Form.Select.Option>
                        <Form.Select.Option value="wechatpay_1632047539">微信支付(桂清源)</Form.Select.Option>
                        <Form.Select.Option value="wechatpay_1632271520">微信支付(绿城一脉)</Form.Select.Option>
                    </Form.Select>
                }
                {
                    loginuser.login_department == '运输公司' &&
                    <Form.Select field="collection" label="确认收款" initValue={'否'} style={{ width: 200 }}>
                        {/* wechatpay_1586841541  微信支付(三燃液化气)
                        wechatpay_1632047539  微信支付(桂清源)
                        wechatpay_1632271520 微信支付(绿城一脉) */}
                        {/* <Form.Select.Option></Form.Select.Option> */}
                        <Form.Select.Option value="是">是</Form.Select.Option>
                        <Form.Select.Option value="否">否</Form.Select.Option>
                    </Form.Select>
                }
                <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple
                    label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.name == '唐运强') ?

                            initData.DepartmentList.map(item => <Form.Select.Option
                                value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option
                                value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Select rules={[{ required: true, message: '必填' }]} field='type' label="收款报表配置名称" style={{ width: 200 }}>
                    {
                        initData.CollectionReportProjectConfigList.filter(item => item.state == '正常').map(item => <Form.Select.Option
                            value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>


                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
                <Button sx={{ ml: 3 }} onClick={() => {
                    //打印
                    let printContents = document.getElementById('table1').innerHTML;
                    let originalContents = document.body.innerHTML;

                    document.body.innerHTML = printContents;

                    window.print();

                    document.body.innerHTML = originalContents;


                }} type="button" variant="contained" size="small">打印</Button>
            </Form>
            <Box id="table1">

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
                        {loginuser.login_department}
                    </div>
                </div>
                <h3>收款报表</h3>
                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={12}>收款报表(收)</td>
                        </tr>
                        <tr>

                            {/*<th>方式</td>*/}
                            <td style={{ fontSize: 10 }}>项目</td>
                            {/*<th>商品</td>*/}
                            <td style={{ fontSize: 10 }}>收支</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            {/*<th>包装物</td>*/}
                            <td style={{ fontSize: 10 }}>现结欠款</td>
                            <td style={{ fontSize: 10 }}>月结欠款</td>
                            <td style={{ fontSize: 10 }}>余额支付</td>
                            <td style={{ fontSize: 10 }}>现金支付</td>
                            <td style={{ fontSize: 10 }}>专项款支付</td>
                            <td style={{ fontSize: 10 }}>优惠券支付</td>
                            <td style={{ fontSize: 10 }}>在线支付</td>
                            <td style={{ fontSize: 10 }}>库存款支付</td>
                            <td style={{ fontSize: 10 }}>合计</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getlist(list, '收').map(item => <tr style={{ color: item.inandout == '支' ? 'red' : 'black' }}>
                                {/*<td>{item.mode}</td>*/}
                                <td>

                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.project}</div>
                                </td>
                                {/*<td>{item.goodsname}</td>*/}
                                <td>{item.inandout}</td>
                                <td>{item.num *1}</td>
                                {/*<td>{item.packingtype}</td>*/}
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '现结欠款')}>{item.casharrears}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '月结欠款')}>{item.payarrears}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '余额支付')}>{item.paybalance}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '现金支付')}>{item.paycash}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '专项款支付')}>{item.paycashgift}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '优惠券支付')}>{item.paycoupon}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '在线支付')}>{item.payonline}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '库存款支付')}>{item.paystock}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '合计')}>{item.total}</div></td>
                            </tr>)
                        }
                        <tr style={{ color: 'black' }}>
                            <td>合计</td>
                            <td></td>
                            <td >{gettotal(getlist(list, '收'), 'num')}</td>
                            <td >{gettotal(getlist(list, '收'), 'casharrears').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'payarrears').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'paybalance').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'paycash').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'paycashgift').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'paycoupon').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'payonline').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'paystock').toFixed(2)}</td>
                            <td >{gettotal(getlist(list, '收'), 'total').toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={11}>收款报表(支)</td>
                        </tr>
                        <tr >

                            {/*<th>方式</td>*/}
                            <td style={{ fontSize: 10 }}>项目</td>
                            {/*<th>商品</td>*/}
                            <td style={{ fontSize: 10 }}>收支</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            {/*<th>包装物</td>*/}
                            <td style={{ fontSize: 10 }}>现结欠款</td>
                            <td style={{ fontSize: 10 }}>月结欠款</td>
                            <td style={{ fontSize: 10 }}>余额支付</td>
                            <td style={{ fontSize: 10 }}>现金支付</td>
                            <td style={{ fontSize: 10 }}>专项款支付</td>
                            <td style={{ fontSize: 10 }}>优惠券支付</td>
                            <td style={{ fontSize: 10 }}>在线支付</td>
                            <td style={{ fontSize: 10 }}>库存款支付</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getlist(list, '支').map(item => <tr style={{ color: item.inandout == '支' ? 'red' : 'black' }}>
                                {/*<td>{item.mode}</td>*/}
                                <td>
                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.project}</div>
                                </td>
                                {/*<td>{item.goodsname}</td>*/}
                                <td>{item.inandout}</td>
                                <td>{item.num *1}</td>
                                {/*<td>{item.packingtype}</td>*/}
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '现结欠款')}>{item.casharrears}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '月结欠款')}>{item.payarrears}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '余额支付')}>{item.paybalance}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '现金支付')}>{item.paycash}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '专项款支付')}>{item.paycashgift}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '优惠券支付')}>{item.paycoupon}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '在线支付')}>{item.payonline}</div></td>
                                <td style={{ cursor: 'pointer' }} ><div onClick={() => getCollectionReportDetail(item, '库存款支付')}>{item.paystock}</div></td>
                            </tr>)
                        }
                        <tr style={{ color: 'black' }}>
                            <td>合计</td>
                            <td></td>
                            <td >{gettotal(getlist(list, '支'), 'num')}</td>
                            <td >{gettotal(getlist(list, '支'), 'casharrears')}</td>
                            <td >{gettotal(getlist(list, '支'), 'payarrears')}</td>
                            <td >{gettotal(getlist(list, '支'), 'paybalance')}</td>
                            <td >{gettotal(getlist(list, '支'), 'paycash')}</td>
                            <td >{gettotal(getlist(list, '支'), 'paycashgift')}</td>
                            <td >{gettotal(getlist(list, '支'), 'paycoupon')}</td>
                            <td >{gettotal(getlist(list, '支'), 'payonline')}</td>
                            <td >{gettotal(getlist(list, '支'), 'paystock')}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: 'right',color: 'black' }}>应缴现金: {(gettotal(getlist(list, '收'), 'paycash') - gettotal(getlist(list, '支'), 'paycash')).toFixed(2)}</div>

                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={4}>附表（水票）</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: 10 }}>商品名称</td>
                            <td style={{ fontSize: 10 }}>单价</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            <td style={{ fontSize: 10 }}>小计</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            physicalcoupon.map(item => <tr>
                                <td>
                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.goodsname}</div>
                                </td>

                                <td>{item.price}</td>
                                <td>{item.num *1}</td>
                                <td>{item.salesprice}</td>
                            </tr>)
                        }
                        <tr>
                            <td>合计</td>
                            <td></td>
                            <td>{physicalcoupon.reduce((a, b) => a + parseFloat(b.num), 0)}</td>
                            <td>{physicalcoupon.reduce((a, b) => a + parseFloat(b.salesprice), 0)}</td>

                        </tr>
                    </tbody>

                </table>

                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={4}>附表（包装物收）</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: 10 }}>方式</td>
                            <td style={{ fontSize: 10 }}>商品名称</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            <td style={{ fontSize: 10 }}>小计</td>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            getlist(list, '包装物')?.map(item => <tr>
                                <td>
                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.mode}</div>
                                </td>
                                <td>{item.goodsname}</td>
                                <td>{item.num *1}</td>
                                <td>{item.paycash}</td>
                            </tr>)
                        }
                        <tr>
                            <td style={{ fontSize: 10 }}>合计</td>
                            <td style={{ fontSize: 10 }}></td>
                            <td style={{ fontSize: 10 }}>{getlist(list, '包装物')?.reduce((a, b) => a + parseFloat(b.num), 0)}</td>
                            <td style={{ fontSize: 10 }}>{getlist(list, '包装物')?.reduce((a, b) => a + parseFloat(b.paycash), 0)}</td>
                        </tr>
                    </tbody>

                </table>
                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={4}>附表（包装物支）</td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: 10 }}>方式</td>
                            <td style={{ fontSize: 10 }}>商品名称</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            <td style={{ fontSize: 10 }}>小计</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getlist(list, '退押金款')?.map(item => <tr>
                                <td>
                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.mode}</div>
                                </td>
                                <td>{item.goodsname}</td>
                                <td>{item.num *1}</td>
                                <td>{item.paycash}</td>
                            </tr>)
                        }
                        <tr>
                            <td style={{ fontSize: 10 }}>合计</td>
                            <td style={{ fontSize: 10 }}></td>
                            <td style={{ fontSize: 10 }}>{getlist(list, '退押金款')?.reduce((a, b) => a + parseFloat(b.num), 0)}</td>
                            <td style={{ fontSize: 10 }}>{getlist(list, '退押金款')?.reduce((a, b) => a + parseFloat(b.paycash), 0)}</td>
                        </tr>

                    </tbody>

                </table>
                <table className={'my-table'} style={{ fontSize: 10, marginTop: 10 }}>
                    <thead>
                        <tr>
                            <td style={{ fontSize: 10 }} colSpan={4}>附表（库存款支付收）</td>
                        </tr>
                        <tr>

                            <td style={{ fontSize: 10 }}>商品名称</td>
                            <td style={{ fontSize: 10 }}>数量</td>
                            <td style={{ fontSize: 10 }}>小计</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.filter(item => ['销售商品捆绑销售方案款', '预约办理商品捆绑销售方案'].includes(item.mode)).map(item => <tr>

                                <td>
                                    <div style={{
                                        // 宽度250 超出换行
                                        width: 250,
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'normal'
                                    }}>{item.goodsname}</div>
                                </td>
                                <td>{item.num *1}</td>
                                <td>
                                    {/* {
                                    "department": "新竹店",
                                    "mode": "销售商品捆绑销售方案款",
                                    "goodscat": "商品捆绑销售方案",
                                    "goodsname": "巴马丽琅天然泉水(10+1)",
                                    "packingtype": "",
                                    "inandout": "收",
                                    "num": "1.0",
                                    "paycash": "250.0000",
                                    "casharrears": ".0000",
                                    "paybalance": ".0000",
                                    "payonline": ".0000",
                                    "paystock": ".0000",
                                    "paycashgift": ".0000",
                                    "payarrears": ".0000",
                                    "paycoupon": ".0000",
                                    "project": "销售商品捆绑销售方案款-商品捆绑销售方案-巴马丽琅天然泉水(10+1)"
                                } */}

                                    {parseFloat(item.paycash)
                                        + parseFloat(item.casharrears)
                                        + parseFloat(item.paybalance)
                                        + parseFloat(item.paystock)
                                        + parseFloat(item.payonline)
                                        + parseFloat(item.paycashgift)
                                        + parseFloat(item.payarrears)
                                        + parseFloat(item.paycoupon)
                                    }</td>
                            </tr>)
                        }
                        <tr>
                            <td style={{ fontSize: 10 }}>合计</td>
                            <td style={{ fontSize: 10 }}>{list.filter(item => ['销售商品捆绑销售方案款', '预约办理商品捆绑销售方案'].includes(item.mode))?.reduce((a, b) => a + parseFloat(b.num), 0)}</td>
                            <td style={{ fontSize: 10 }}>{list.filter(item => ['销售商品捆绑销售方案款', '预约办理商品捆绑销售方案'].includes(item.mode))?.reduce((a, b) => a + parseFloat(b.paycash)
                                + parseFloat(b.casharrears)
                                + parseFloat(b.paybalance)
                                + parseFloat(b.paystock)
                                + parseFloat(b.payonline)
                                + parseFloat(b.paycashgift)
                                + parseFloat(b.payarrears)
                                + parseFloat(b.paycoupon), 0)}</td>
                        </tr>
                    </tbody>

                </table>
            </Box>

            <Modal title="收款报表明细" visible={subopen} onCancel={() => {
                setsubopen(false)
            }} footer={<></>} style={{ top: '10%', width: '80vw' }}>
                <Box overflow="scroll" height="60vh">
                    <AgGridReact

                        className="ag-theme-balham"
                        rowData={sublist}


                        columnDefs={[
                            // {
                            //     "date": "2023-08-02 09:39:09.543",
                            //     "department": "商用气公司",
                            //     "operator": "唐运强",
                            //     "inandout": "收",
                            //     "memberid": "8999899",
                            //     "attributiondepartment": "商用气工业气部",
                            //     "salesman": "刘春霞",
                            //     "goodsname": "存瓶余气充值款",
                            //     "num": "1.0",
                            //     "total": "377.1500",
                            //     "distributionstore": "商用气公司",
                            //     "businesstime": "2023-08-02 09:39:09.543"
                            // }
                            { headerName: '日期', field: 'date' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '操作员', field: 'operator' },
                            { headerName: '收支', field: 'inandout' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '配送员', field: 'deliveryman' },
                            { headerName: '归属部门', field: 'attributiondepartment' },
                            { headerName: '业务员', field: 'salesman' },
                            { headerName: '商品名称', field: 'goodsname' },
                            { headerName: '商品分类', field: 'goodscat' },
                            { headerName: '商品类型', field: 'goodstype' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '小计', field: 'total' },
                            { headerName: '配送门店', field: 'distributionstore' },
                            { headerName: '业务时间', field: 'businesstime' },

                            { headerName: '确认日期', field: 'collection_date' },
                            { headerName: '确认部门', field: 'collection_department' },
                            { headerName: '确认人', field: 'collection_ope' },

                        ]}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true
                        }}
                        onGridReady={e => {
                            e.api.sizeColumnsToFit();
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default CollectionReport;
