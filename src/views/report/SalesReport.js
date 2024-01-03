import React, { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form, Modal } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import BuinessSalesReport from './BuinessSalesReport';
import printpdf from 'utils/printpdf';

const SalesReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState('')
    const [datalist, setdataList] = useState([])
    const [casharrears, setcasharrears] = useState([])
    const [montharrears, setmontharrears] = useState([])
    const [attributiondepartmentlist_arr, setattributiondepartmentlist] = useState([])
    const [buypackingtype, setbuypackingtype] = useState([])
    const [packingtypemode, setpackingtypemode] = useState([])
    // setSalesReportDetailed
    const [SalesReportDetailed, setSalesReportDetailed] = useState([])
    // setSalesReportDetailedVisible
    const [SalesReportDetailedVisible, setSalesReportDetailedVisible] = useState(false)

    const [hj, sethj] = useState('')
    const [formatype, seformatype] = useState('门店报表')
    const [shopraffinate, setshopraffinate] = useState({
        weight: 0,
        total: 0
    })
    const [bussinessraffinate, setbussinessraffinate] = useState({
        weight: 0,
        total: 0
    })
    const groupBy = (data) => {
        let arr =  data.reduce((acc, item) => {
            const key = `${item.attributiondepartment}-${item.workplace}-${item.memberid}-${item.goodsname}`;
            if (!acc[key]) {
                acc[key] = {
                    attributiondepartment: item.attributiondepartment,
                    workplace: item.workplace,
                    memberid: item.memberid,
                    goodsname: item.goodsname,
                    num: 0,
                    pay_arrears: 0,
                    residual_air_total: 0,
                    pay_cash: 0
                };
            }
            acc[key].num += parseFloat(item.num);
            acc[key].pay_arrears += parseFloat(item.pay_arrears);
            acc[key].pay_cash += parseFloat(item.pay_cash);
            acc[key].residual_air_total += parseFloat(item.residual_air_total);
            return acc;
        }, {});
        return Object.values(arr);


    }
    const gethj = (arr, key, num) => {
        let sum = 0
        for (const i in arr) {
            sum += parseFloat(arr[i][key])
        }
        return parseFloat(sum).toFixed(num)
    }
    const [sales_arr, setsales_arr] = useState([])

    useEffect(() => {
        /*
        loginuser = {
            "companyid": "101",
            "company": "南宁三燃",
            "companytelephone": "2635151",
            "opeid": "admin",
            "name": "admin",
            "telephone": "13978655346",
            "departmentid": "1",
            "department": "信息中心",
            "quartersid": "1",
            "quarters": "管理员",

            "state": "正常",
            "login_departmentid": "5",
            "login_department": "鲤湾店",
            "login_department_appkey": "{\"departmentid\":\"5\",\"department\":\"鲤湾店\",\"key1\":\"WV5uDnd2qJ9gSUhk4kmCx1F5HtO6rxNB\",\"key2\":\"5Nvaqm5UA3cIx2XKSUvzdyV4ORjFz1lY\"}"
            }
        */
        //	门店报表,商用气报表,运输公司报表 formatype
        //  如果登录部门是业务门店,则formatype为门店报表
        //  如果登录部门站点名称包含商用,则formatype为商用气报表
        //  如果登录部门是运输公司,则formatype为运输公司报表
        if (loginuser.login_department.includes("商用") || loginuser.login_department.includes("零售后勤")) {
            seformatype('商用气报表')
        } else if (loginuser.login_department.includes("运输")) {
            seformatype('运输公司报表')
        } else {
            seformatype('门店报表')
        }
    }, [])


    //部门合计方法
    const getdepartmenthj = (arr) => {
        const hj = {
            num: 0,
            total: 0,
            suttlenum: 0,
            payarrears: 0,
            residual_air_weight: 0,
            residual_air_total: 0,
        };
        for (const i in arr) {
            hj.num += parseFloat(arr[i].num)
            hj.total += parseFloat(arr[i].total)
            hj.suttlenum += parseFloat(arr[i].suttle)
            hj.payarrears += parseFloat(arr[i].payarrears)
            hj.residual_air_weight += parseFloat(arr[i].residual_air_weight)
            hj.residual_air_total += parseFloat(arr[i].residual_air_total)
        }
        hj.residual_air_weight = hj.residual_air_weight.toFixed(3)
        hj.residual_air_total = hj.residual_air_total.toFixed(2)

        return hj
    }
    // 获取部门零售余气统计和商用余气统计
    const getdepartmentraffinate = (arr, attributiondepartment) => {
        const shopraffinate = {
            weight: 0,
            total: 0
        }
        const bussinessraffinate = {
            weight: 0,
            total: 0
        }
        for (const i in arr) {
            if (arr[i].attributiondepartment.includes("商用") && arr[i].attributiondepartment === attributiondepartment) {
                bussinessraffinate.weight += parseFloat(arr[i].residual_air_weight)
                bussinessraffinate.total += parseFloat(arr[i].residual_air_total)
            }

            if (!arr[i].attributiondepartment.includes("商用") && arr[i].attributiondepartment === attributiondepartment) {
                shopraffinate.weight += parseFloat(arr[i].residual_air_weight)
                shopraffinate.total += parseFloat(arr[i].residual_air_total)
            }
        }
        shopraffinate.weight = shopraffinate.weight.toFixed(3)
        shopraffinate.total = shopraffinate.total.toFixed(2)
        bussinessraffinate.weight = bussinessraffinate.weight.toFixed(3)
        bussinessraffinate.total = bussinessraffinate.total.toFixed(2)
        return {
            shopraffinate,
            bussinessraffinate
        }
    }

    //获取各部门现结欠款和月结欠款明细
    const getdepartmentarrears = (arr, attributiondepartment) => {
        const list = []
        for (const i in arr) {
            if (arr[i].attributiondepartment === attributiondepartment) {
                list.push(arr[i])
            }
        }
        return list
    }
    const api = useRef(null)
    return (

        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取销售报表</Typography>
            <Form getFormApi={e => api.current = e} onChange={e => {
                setList([])
                setdataList([])
                setcasharrears([])
            }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.SalesReport',
                    ...e,
                    formatype,
                    department: JSON.stringify(e.department),
                })
                setList(rew.data.info)

                setcasharrears(groupBy(rew.data.info.casharrears))

                // rew.data.info.montharrears 按照 归属部门 单位 会员号 商品名称 分组合计


                setmontharrears(groupBy(rew.data.info.montharrears))


                const mergedData = {};
                const attributiondepartmentlist = {};
                // 循环重组数组结构
                bussinessraffinate.weight = 0
                bussinessraffinate.total = 0
                shopraffinate.weight = 0
                shopraffinate.total = 0

                rew.data.info.sales.forEach(row => {
                    let str = row.attributiondepartment;
                    if (!attributiondepartmentlist.hasOwnProperty(str)) {
                        attributiondepartmentlist[str] = {
                            attributiondepartment: str,
                            list: []
                        }
                    }



                    if (str.includes("商用")) {
                        bussinessraffinate.weight += parseFloat(row.residual_air_weight)
                        bussinessraffinate.total += parseFloat(row.residual_air_total)
                    } else {
                        shopraffinate.weight += parseFloat(row.residual_air_weight)
                        shopraffinate.total += parseFloat(row.residual_air_total)
                    }

                    if (mergedData.hasOwnProperty(row.goodsname)) {
                        mergedData[row.goodsname].num += parseFloat(row.num);
                        mergedData[row.goodsname].total = (parseFloat(mergedData[row.goodsname].total) + parseFloat(row.total)).toFixed(2);
                        mergedData[row.goodsname].residual_air_weight = (parseFloat(mergedData[row.goodsname].residual_air_weight) + parseFloat(row.residual_air_weight)).toFixed(3);
                        mergedData[row.goodsname].residual_air_total = (parseFloat(mergedData[row.goodsname].residual_air_total) + parseFloat(row.residual_air_total)).toFixed(2);
                        mergedData[row.goodsname].suttle = (parseFloat(mergedData[row.goodsname].suttle) + parseFloat(row.suttle)).toFixed(2);
                        mergedData[row.goodsname].payarrears = (parseFloat(mergedData[row.goodsname].payarrears) + parseFloat(row.payarrears)).toFixed(2);

                    } else {
                        mergedData[row.goodsname] = {
                            department: row.department,
                            attributiondepartment: row.attributiondepartment,
                            mode: row.mode,
                            goodsname: row.goodsname,
                            suttle: row.suttle,

                            num: parseFloat(row.num),
                            total: parseFloat(row.total).toFixed(2),
                            payarrears: row.payarrears,
                            residual_air_weight: parseFloat(row.residual_air_weight).toFixed(3),
                            residual_air_total: parseFloat(row.residual_air_total).toFixed(2)
                        };
                    }
                });
                shopraffinate.weight = shopraffinate.weight.toFixed(3)
                shopraffinate.total = shopraffinate.total.toFixed(2)
                bussinessraffinate.weight = bussinessraffinate.weight.toFixed(3)
                bussinessraffinate.total = bussinessraffinate.total.toFixed(2)
                setshopraffinate(shopraffinate)
                setbussinessraffinate(bussinessraffinate)

                const mergedDataArray = Object.values(mergedData);

                console.log('mergedDataArray', mergedDataArray);
                setdataList(mergedDataArray)





                const mergedData2 = {
                    num: 0,
                    total: 0,
                    suttlenum: 0,
                    payarrears: 0,
                    residual_air_weight: 0,
                    residual_air_total: 0,
                };


                mergedDataArray.forEach(row => {

                    const total = (parseFloat(row.suttle)).toFixed(2);
                    mergedData2.num += row.num;
                    mergedData2.payarrears += parseFloat(row.payarrears);
                    mergedData2.residual_air_weight += parseFloat(row.residual_air_weight);
                    mergedData2.residual_air_total += parseFloat(row.residual_air_total);
                    mergedData2.total += parseFloat(row.total);
                    mergedData2.suttlenum += parseFloat(total);
                });
                mergedData2.residual_air_weight = mergedData2.residual_air_weight.toFixed(3)
                mergedData2.residual_air_total = mergedData2.residual_air_total.toFixed(2)
                sethj(mergedData2)


                // 分组合计
                const groupedData_arr = rew.data.info.sales.reduce((acc, item) => {
                    // 按照 attributiondepartment 和 goodsname 属性对元素进行分组
                    const key = `${item.goodsname}`;
                    if (!acc[key]) {

                        acc[key] = {
                            goodsname: item.goodsname,
                            num: 0,
                            total: 0,
                            payarrears: 0,
                            residual_air_weight: 0,
                            residual_air_total: 0,
                            suttle: 0
                        };
                    }
                    // 计算 num，total，residual_air_weight 和 residual_air_total 的总和
                    acc[key].num += parseFloat(item.num);
                    acc[key].total += parseFloat(item.total);
                    acc[key].suttle += parseFloat(item.suttle);
                    acc[key].payarrears += parseFloat(item.payarrears);
                    // residual_air_weight 保留3位小数
                    acc[key].residual_air_weight = (parseFloat(acc[key].residual_air_weight) + parseFloat(item.residual_air_weight)).toFixed(3);

                    // residual_air_total 保留两位小数
                    acc[key].residual_air_total = (parseFloat(acc[key].residual_air_total) + parseFloat(item.residual_air_total)).toFixed(2);

                    return acc;
                }, {});

                const result_arr = Object.values(groupedData_arr);
                setsales_arr(result_arr)



                // 分组合计
                const groupedData = rew.data.info.sales.reduce((acc, item) => {
                    // 按照 attributiondepartment 和 goodsname 属性对元素进行分组
                    const key = `${item.attributiondepartment}-${item.goodsname}`;
                    if (!acc[key]) {

                        acc[key] = {
                            attributiondepartment: item.attributiondepartment,
                            goodsname: item.goodsname,
                            num: 0,
                            total: 0,
                            payarrears: 0,
                            residual_air_weight: 0,
                            residual_air_total: 0,
                            suttle: 0
                        };
                    }
                    // 计算 num，total，residual_air_weight 和 residual_air_total 的总和
                    acc[key].num += parseFloat(item.num);
                    acc[key].total += parseFloat(item.total);
                    acc[key].suttle += parseFloat(item.suttle);
                    acc[key].payarrears += parseFloat(item.payarrears);
                    // residual_air_weight 保留3位小数
                    acc[key].residual_air_weight = (parseFloat(acc[key].residual_air_weight) + parseFloat(item.residual_air_weight)).toFixed(3);

                    // residual_air_total 保留两位小数
                    acc[key].residual_air_total = (parseFloat(acc[key].residual_air_total) + parseFloat(item.residual_air_total)).toFixed(2);

                    return acc;
                }, {});

                const result = Object.values(groupedData);


                console.log('归属部门', result)
                for (const i in result) {
                    attributiondepartmentlist[result[i].attributiondepartment].list.push(result[i])
                }


                // console.log('attributiondepartmentlist',attributiondepartmentlist)
                setattributiondepartmentlist(Object.values(attributiondepartmentlist))

                const res = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Finance_Infos.PackingtypeReport',
                    ...e,
                    department: JSON.stringify(e.department),
                })
                setpackingtypemode(res.data.info.packingtypemode)
                setbuypackingtype(res.data.info.buypackingtype)


            }} layout='horizontal' labelPosition="inset">
                <Form.Select rules={[{ required: true, message: '必填' }]} filter field='department' maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>
                    {

                        (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.name == '唐运强') ?

                            initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                            :
                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>
                    }

                </Form.Select>
                <Form.Select field='type' rules={[{ required: true, message: '必填' }]} onChange={e => {
                    if (loginuser.login_department === '财务部') {
                        seformatype(e)
                    }
                }} label="销售报表名称" style={{ width: 200 }}>
                    {
                        initData.SalesReportGoodsConfigList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>
                <Form.Input field='begintime' type="date" label="开始时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')} style={{ width: 200 }} />
                <Button type="submit" variant="outlined" size="small">搜索</Button>

                <Button sx={{ ml: 2 }} type="button" onClick={() => {
                    printpdf('apptable')
                }} variant="outlined" size="small">打印</Button>
            </Form>
            <Modal visible={SalesReportDetailedVisible} title="销售报表详细" onCancel={() => { setSalesReportDetailedVisible(false) }} footer={null} style={{ width: '90vw' }}>
                {/* <SalesReportDetailed data={SalesReportDetailedData} />
                 */}
                <Box height={'60vh'} overflow="scroll">


                    <AgGridReact
                        className='ag-theme-balham'
                        rowData={SalesReportDetailed}

                        columnDefs={[

                            { headerName: "添加时间", field: "addtime" },
                            { headerName: "订单号", field: "serial" },
                            { headerName: "销售单号", field: "serial_sale", hide: true },
                            { headerName: "来源", field: "source" },
                            { headerName: "销售模式", field: "mode" },
                            { headerName: "商品品牌", field: "goodsbrand", hide: true },
                            { headerName: "商品名称", field: "goodsname", hide: true },
                            { headerName: "市场价", field: "marketprice" },
                            { headerName: "销售价", field: "price" },
                            { headerName: "数量", field: "num" },
                            { headerName: "总计", field: "total" },
                            { headerName: "支付方式", field: "payment" },
                            { headerName: "月结支付", field: "pay_arrears" },
                            { headerName: "现金支付", field: "pay_cash" },
                            { headerName: "余额支付", field: "pay_balance" },
                            { headerName: "在线支付", field: "pay_online" },
                            { headerName: "在线支付流水号", field: "online_pay_serial", hide: true },
                            { headerName: "在线支付账号", field: "online_paymentaccount", hide: true },
                            { headerName: "库存支付", field: "pay_stock", hide: true },
                            { headerName: "礼金支付", field: "pay_cashgift", hide: true },
                            { headerName: "优惠券支付", field: "pay_coupon", hide: true },
                            { headerName: "优惠券信息", field: "couponinfo", hide: true },
                            { headerName: "支付费用ID", field: "payfeeids", hide: true },
                            { headerName: "会员号", field: "memberid" },
                            { headerName: "会员名称", field: "username" },
                            { headerName: "工作单位", field: "workplace" },
                            { headerName: "省", field: "province", hide: true },
                            { headerName: "市", field: "city", hide: true },
                            { headerName: "区", field: "area", hide: true },
                            { headerName: "街道", field: "town", hide: true },
                            { headerName: "详细地址", field: "address" },
                            { headerName: "楼层", field: "floor" },
                            { headerName: "归属部门", field: "attributiondepartment" },
                            { headerName: "客户类型", field: "customertype" },
                            { headerName: "业务员", field: "salesman" },
                            { headerName: "开户时间", field: "accountopeningtime", hide: true },
                            { headerName: "开发业务员", field: "developsalesman", hide: true },
                            { headerName: "部门", field: "department", hide: true },
                            { headerName: "操作员", field: "operator", hide: true },
                            { headerName: "配送方式", field: "distributionmode" },
                            { headerName: "补贴总计", field: "subsidytotal", hide: true },
                            { headerName: "配送员", field: "deliveryman" },
                            { headerName: "配送员工号", field: "deliveryman_opeid", hide: true },
                            { headerName: "收支", field: "inandout", hide: true },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true
                        }}
                        onGridReady={params => {
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </Box>


            </Modal>


            {
                formatype === '商用气报表' ?


                    <Box mt={3} id="apptable">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: '#000',
                            marginBottom: 10,
                        }}>
                            <div>时间:
                                {api.current?.getValue('begintime')}至{api.current?.getValue('endtime')}
                            </div>
                            <div>打印人:
                                {loginuser.name}
                            </div>
                            <div>
                                部门:
                                {api.current?.getValue('department')}
                            </div>

                        </div>
                        <BuinessSalesReport list={list} />
                    </Box>

                    :
                    <Box mt={3} id="apptable">

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: '#000',
                            marginBottom: 10,
                        }}>
                            <div>时间:
                                {api.current?.getValue('begintime')}至{api.current?.getValue('endtime')}
                            </div>
                            <div>打印人:
                                {loginuser.name}
                            </div>
                            <div>
                                部门:
                                {api.current?.getValue('department')}
                            </div>

                        </div>
                        <table className="my-table">
                            <tr>
                                <th colSpan="5">液化气销售报表</th>
                            </tr>
                            <tr>
                                <td >商品名称</td>
                                <td >数量</td>
                                <td >折公斤</td>
                                <td >换气金额</td>
                                <td >总计</td>
                            </tr>

                            {
                                datalist.map((item, index) =>

                                    <tr>
                                        {/* 点击goodsname查看详细 */}
                                        <td><div onClick={async () => {
                                            // department	字符串	可选			业务部门(不传默认全部) JSON ["二区店","二桥店"]
                                            // goodsname	字符串	必须			商品名称
                                            // formatype	字符串	可选	门店报表		门店报表,商用气报表,运输公司报表
                                            // begintime	日期	必须			完成起始时间
                                            // endtime	日期	必须			完成结束时间
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_Report_Finance_Infos.SalesReportDetailed',
                                                department: JSON.stringify([api.current.getValue('department')]),
                                                goodsname: item.goodsname,
                                                formatype: formatype,
                                                begintime: api.current.getValue('begintime'),
                                                endtime: api.current.getValue('endtime'),
                                            })
                                            setSalesReportDetailed(rew.data.info)
                                            setSalesReportDetailedVisible(true)


                                        }} size="small">{item.goodsname}</div></td>
                                        <td>{item.num}</td>
                                        <td>{parseFloat(item.suttle).toFixed(4)}</td>
                                        <td>{item.total}</td>
                                        {
                                            index === 0 ? <td style={{ textAlign: "left" }} rowSpan={list?.sales?.length + 2}>


                                                <div className="justify-between flex">
                                                    <span>总瓶数:</span>

                                                    <span>{hj.num}瓶</span>
                                                </div>
                                                <div className="justify-between flex">
                                                    <span>折公斤:</span>
                                                    <span>{hj.suttlenum - hj.residual_air_weight}公斤</span>
                                                </div>

                                                <div className="justify-between flex">
                                                    <span>换气金额:</span>
                                                    <span>{hj.total - hj.residual_air_total} 元</span>
                                                </div>
                                                <div className="justify-between flex">
                                                    <span>不含税收入:</span>
                                                    <span>{((hj.total - hj.residual_air_total) / 1.09).toFixed(2)} 元</span>

                                                </div>
                                                <div className="justify-between flex">
                                                    <span>增值税: </span>
                                                    <span>{((hj.total - hj.residual_air_total) - ((hj.total - hj.residual_air_total) / 1.09)).toFixed(2)} 元</span>
                                                </div>
                                                <div className="justify-between flex">
                                                    <span>商用余气总公斤数: </span>
                                                    <span>{bussinessraffinate.weight}公斤</span>
                                                </div>
                                                <div className="justify-between flex">
                                                    <span>商用余气总金额: </span>
                                                    <span>{bussinessraffinate.total}元</span>
                                                </div>
                                                <div className="justify-between flex">
                                                    <span>零售余气总公斤数: </span>
                                                    <span>{shopraffinate.weight}公斤</span>
                                                </div>
                                                <div className="justify-between flex">

                                                    <span>零售余气总金额: </span>
                                                    <span>{shopraffinate.total}元</span>
                                                </div>
                                            </td> : ''
                                        }
                                    </tr>
                                )
                            }

                            <tr>
                                <td>合计</td>
                                <td>{hj.num}</td>
                                <td>{hj.suttlenum}</td>
                                <td>{hj.total}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colSpan={3}>
                                    <div>其中：提货付款 {hj.total - hj.payarrears} 元，月结付款 {hj.payarrears} 元</div>
                                    <div>退余气公斤数为{parseFloat(hj.residual_air_weight).toFixed(3)} 公斤 退余气金额 {parseFloat(hj.residual_air_total).toFixed(2)} 元</div>
                                </td>
                            </tr>

                        </table>
                        <br />
                        <table className="my-table">
                            <tr>
                                <th colSpan="8">销售明细</th>
                            </tr>

                            <tr>
                                <td>商品名称</td>
                                <td>数量</td>
                                <td>残液重量</td>
                                <td>实际销售重量</td>
                                <td>残液金额</td>
                                <td>换气金额</td>
                                <td>不含税收入</td>
                                <td>增值税</td>
                            </tr>
                            {
                                sales_arr.map(item =>
                                    <tr>
                                        <td>{item.goodsname}</td>
                                        <td>{item.num}</td>
                                        <td>{parseFloat(item.residual_air_weight).toFixed(4)}</td>
                                        <td>{parseFloat(item.suttle -item.residual_air_weight).toFixed(4)}</td>
                                        <td>{item.residual_air_total}</td>
                                        <td>{parseFloat(item.total - item.residual_air_total).toFixed(2)}</td>
                                        <td>{(((item.total - item.residual_air_total) / 1.09).toFixed(2))>0?(((item.total - item.residual_air_total) / 1.09).toFixed(2)):0}</td>
                                        <td>{(((item.total - item.residual_air_total) - ((item.total - item.residual_air_total) / 1.09)).toFixed(2))>0?(((item.total - item.residual_air_total) - ((item.total - item.residual_air_total) / 1.09)).toFixed(2)):0}</td>

                                    </tr>
                                )
                            }
                            <tr>
                                <td>合计</td>
                                <td>{hj.num}</td>
                                <td>{hj.residual_air_weight}</td>
                                <td>{hj.suttlenum - hj.residual_air_weight}</td>
                                <td>{hj.residual_air_total}</td>
                                <td>{(hj.total - hj.residual_air_total).toFixed(2)}</td>
                                <td>{((hj.total - hj.residual_air_total) / 1.09).toFixed(2)}</td>
                                <td>{((hj.total - hj.residual_air_total) - ((hj.total - hj.residual_air_total) / 1.09)).toFixed(2)}</td>
                            </tr>
                        </table>

                        <br />



                        {
                            attributiondepartmentlist_arr.map(item =>

                                <div>
                                    <br />
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="5">{item.attributiondepartment}销售报表</th>
                                        </tr>
                                        <tr>
                                            <td >商品名称</td>
                                            <td >数量</td>
                                            <td >折公斤</td>
                                            <td >换气金额</td>
                                            <td >总计</td>
                                        </tr>

                                        {
                                            item.list.map((items, indexs) =>

                                                <tr>
                                                    <td>{items.goodsname}</td>
                                                    <td>{items.num}</td>
                                                    <td>{items.suttle}</td>
                                                    <td>{items.total}</td>
                                                    {
                                                        indexs === 0 ? <td style={{ textAlign: "left" }} rowSpan={item?.list?.length + 2}>


                                                            <div className="justify-between flex">
                                                                <span>总瓶数:</span>

                                                                <span>{getdepartmenthj(item.list).num}瓶</span>
                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>折公斤:</span>
                                                                <span>{getdepartmenthj(item.list).suttlenum - getdepartmenthj(item.list).residual_air_weight}公斤</span>
                                                            </div>

                                                            <div className="justify-between flex">
                                                                <span>换气金额:</span>
                                                                <span>{getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total} 元</span>
                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>不含税收入:</span>
                                                                <span>{((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) / 1.09).toFixed(2)} 元</span>

                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>增值税: </span>
                                                                <span>{((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) - ((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) / 1.09)).toFixed(2)} 元</span>
                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>商用余气总公斤数: </span>
                                                                <span>{getdepartmentraffinate(list.sales, item.attributiondepartment).bussinessraffinate.weight}公斤</span>
                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>商用余气总金额: </span>
                                                                <span>{getdepartmentraffinate(list.sales, item.attributiondepartment).bussinessraffinate.total}元</span>
                                                            </div>
                                                            <div className="justify-between flex">
                                                                <span>零售余气总公斤数: </span>
                                                                <span>{getdepartmentraffinate(list.sales, item.attributiondepartment).shopraffinate.weight}公斤</span>
                                                            </div>
                                                            <div className="justify-between flex">

                                                                <span>零售余气总金额: </span>
                                                                <span>{getdepartmentraffinate(list.sales, item.attributiondepartment).shopraffinate.total}元</span>
                                                            </div>
                                                        </td> : ''
                                                    }
                                                </tr>
                                            )
                                        }

                                        <tr>
                                            <td>合计</td>
                                            <td>{getdepartmenthj(item.list).num}</td>
                                            <td>{getdepartmenthj(item.list).suttlenum}</td>
                                            <td>{getdepartmenthj(item.list).total}</td>
                                        </tr>
                                        <tr>
                                            <td>备注</td>
                                            <td colSpan={3}>
                                                <div>其中：提货付款 {getdepartmenthj(item.list).total - getdepartmenthj(item.list).payarrears} 元，月结付款 {getdepartmenthj(item.list).payarrears} 元</div>
                                                <div>退余气公斤数为{getdepartmenthj(item.list).residual_air_weight} 公斤 退余气金额 {getdepartmenthj(item.list).residual_air_total} 元</div>
                                            </td>
                                        </tr>

                                    </table>
                                    <br />
                                    {/* 销售明细  */}
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="8">{item.attributiondepartment}销售明细</th>
                                        </tr>
                                        <tr>
                                            <td>商品名称</td>
                                            <td>数量</td>
                                            <td>残液重量</td>
                                            <td>实际销售重量</td>
                                            <td>残液金额</td>
                                            <td>换气金额</td>
                                            <td>不含税收入</td>
                                            <td>增值税</td>
                                        </tr>
                                        {
                                            item.list.map(items =>
                                                <tr>
                                                    <td>{items.goodsname}</td>
                                                    <td>{items.num}</td>
                                                    <td>{parseFloat(items.residual_air_weight).toFixed(4)}</td>
                                                    <td>{parseFloat(items.suttle - items.residual_air_weight).toFixed(4)}</td>
                                                    <td>{items.residual_air_total}</td>
                                                    <td>{(items.total - items.residual_air_total).toFixed(2)}</td>
                                                    <td>{(((items.total - items.residual_air_total) / 1.09).toFixed(2))>0?(((items.total - items.residual_air_total) / 1.09).toFixed(2)):0}</td>
                                                    <td>{(((items.total - items.residual_air_total) - ((items.total - items.residual_air_total) / 1.09)).toFixed(2))>0?(((items.total - items.residual_air_total) - ((items.total - items.residual_air_total) / 1.09)).toFixed(2)):0}</td>
                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td>合计</td>
                                            <td>{getdepartmenthj(item.list).num}</td>
                                            <td>{getdepartmenthj(item.list).residual_air_weight}</td>
                                            <td>{parseFloat(getdepartmenthj(item.list).suttlenum - getdepartmenthj(item.list).residual_air_weight).toFixed(4)}</td>
                                            <td>{getdepartmenthj(item.list).residual_air_total}</td>
                                            <td>{(getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total).toFixed(2)}</td>
                                            <td>{((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) / 1.09).toFixed(2)}</td>
                                            <td>{((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) - ((getdepartmenthj(item.list).total - getdepartmenthj(item.list).residual_air_total) / 1.09)).toFixed(2)}</td>
                                        </tr>
                                    </table>

                                    <br />

                                </div>


                            )
                        }
                        <br />

                        <table className="my-table">
                            <tr>
                                <th colSpan="6">钢瓶收购报表</th>
                            </tr>
                            <tr>
                                <td>部门</td>
                                <td>类型</td>
                                <td>年限</td>
                                {/* <td>日期</td> */}
                                {/* <td>单价</td> */}
                                <td>数量</td>
                                <td>小计</td>
                                {/* <td>备注</td> */}
                            </tr>
                            {
                                buypackingtype.map(item =>
                                    <tr>
                                        <td>{item.department}</td>
                                        <td>{item.packingtype}</td>
                                        <td>{item.date4manufacture}</td>
                                        {/* <td>{item.date}</td> */}
                                        {/* <td>{item.price}</td> */}
                                        <td>{item.num}</td>
                                        <td>{item.total}</td>
                                        {/* <td>{item.remarks}</td> */}
                                    </tr>
                                )
                            }
                        </table>

                        {
                            formatype === '门店报表'?
                                <>
                                    <br/>
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="6">送气欠款明细(月结)</th>
                                        </tr>
                                        <tr>
                                            <td>归属部门</td>
                                            <td>单位</td>
                                            <td>会员号</td>
                                            <td>商品名称</td>
                                            <td>数量</td>
                                            <td>金额</td>
                                        </tr>
                                        {
                                            montharrears.map(item =>

                                                <tr>
                                                    <td>{item.attributiondepartment}</td>
                                                    <td>{item.workplace}</td>
                                                    <td>{item.memberid}</td>
                                                    <td>{item.goodsname}</td>
                                                    <td>{item.num}</td>

                                                    <td>{parseFloat(item.pay_arrears).toFixed(2)}</td>

                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td>合计</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{gethj(montharrears, 'num', 0)}</td>
                                            <td>{parseFloat(gethj(montharrears, 'pay_arrears', 2)).toFixed(2) }</td>
                                        </tr>

                                    </table>

                                    <br />
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="6">送气欠款明细(现结)</th>
                                        </tr>
                                        <tr>
                                            <td>归属部门</td>
                                            <td>单位</td>
                                            <td>会员号</td>
                                            <td>商品名称</td>
                                            <td>数量</td>

                                            <td>金额</td>
                                        </tr>
                                        {
                                            casharrears.map(item =>

                                                <tr>
                                                    <td>{item.attributiondepartment}</td>
                                                    <td>{item.workplace}</td>
                                                    <td>{item.memberid}</td>
                                                    <td>{item.goodsname}</td>
                                                    <td>{item.num}</td>

                                                    <td>{parseFloat(item.pay_cash).toFixed(2)}</td>
                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td>合计</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{gethj(casharrears, 'num', 0)}</td>

                                            <td>{parseFloat(gethj(casharrears, 'pay_cash', 2)).toFixed(2) }</td>
                                        </tr>

                                    </table>
                                </> :
                                <>
                                    <br/>
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="7">送气欠款明细(月结)</th>
                                        </tr>
                                        <tr>
                                            <td>归属部门</td>
                                            <td>单位</td>
                                            <td>会员号</td>
                                            <td>商品名称</td>
                                            <td>数量</td>
                                            <td>残液金额</td>

                                            <td>金额</td>
                                        </tr>
                                        {
                                            montharrears.map(item =>

                                                <tr>
                                                    <td>{item.attributiondepartment}</td>
                                                    <td>{item.workplace}</td>
                                                    <td>{item.memberid}</td>
                                                    <td>{item.goodsname}</td>
                                                    <td>{item.num}</td>
                                                    <td>{parseFloat(item.residual_air_total).toFixed(2)}</td>

                                                    <td>{parseFloat(item.pay_arrears).toFixed(2)}</td>

                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td>合计</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{gethj(montharrears, 'num', 0)}</td>
                                            <td>{gethj(montharrears, 'residual_air_total', 2)}</td>

                                            <td>{parseFloat(gethj(montharrears, 'pay_arrears', 2)).toFixed(2) }</td>
                                        </tr>

                                    </table>

                                    <br />
                                    <table className="my-table">
                                        <tr>
                                            <th colSpan="7">送气欠款明细(现结)</th>
                                        </tr>
                                        <tr>
                                            <td>归属部门</td>
                                            <td>单位</td>
                                            <td>会员号</td>
                                            <td>商品名称</td>
                                            <td>数量</td>
                                            <td>残液金额</td>

                                            <td>金额</td>
                                        </tr>
                                        {
                                            casharrears.map(item =>

                                                <tr>
                                                    <td>{item.attributiondepartment}</td>
                                                    <td>{item.workplace}</td>
                                                    <td>{item.memberid}</td>
                                                    <td>{item.goodsname}</td>
                                                    <td>{item.num}</td>
                                                    <td>{parseFloat(item.residual_air_total).toFixed(2)}</td>

                                                    <td>{parseFloat(item.pay_cash - item.residual_air_total).toFixed(2)}</td>
                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td>合计</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{gethj(casharrears, 'num', 0)}</td>
                                            <td>{gethj(casharrears, 'residual_air_total', 2)}</td>

                                            <td>{parseFloat(gethj(casharrears, 'pay_cash', 2) - gethj(casharrears,'residual_air_total',2)).toFixed(2) }</td>
                                        </tr>

                                    </table>
                                </>
                        }






                        {/* <br /> */}
                        {/* <table className="my-table">
                            <tr>
                                <th colSpan="6">抵押物办理</th>
                            </tr>
                            <tr>
                                <td>部门</td>
                                <td>类型</td>
                                <td>方式</td>
                                <td>数量</td>
                                <td>小计</td>
                            </tr>

                            {
                                packingtypemode.map(item =>
                                    <tr>
                                        <td>{item.department}</td>
                                        <td>{item.goodsname}</td>
                                        <td>{item.mode}</td>
                                        <td>{item.num}</td>
                                        <td>{item.total}</td>
                                    </tr>
                                )
                            }
                        </table> */}


                    </Box>
            }
        </Box>
    );
};

export default SalesReport;
