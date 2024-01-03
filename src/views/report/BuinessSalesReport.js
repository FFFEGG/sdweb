import React, {useEffect, useState} from 'react';

const BuinessSalesReport = ({list}) => {
    const [transList, setTransList] = useState([]);
    const [marketList, setMarketList] = useState([]);
    const [zlist_arr, setzlist] = useState([]);

    const [receivedmontharrears, setReceivedmontharrears] = useState([[], []]);


    useEffect(() => {
        // 循环按照 goodsname 分组  suttle,num,total,payarrears,residual_air_weight,residual_air_total 累加.
        function ensureSameKeys(obj1, obj2) {
            Object.keys(obj1).forEach(key => {
                if (!obj2.hasOwnProperty(key)) {
                    obj2[key] = {
                        department: obj2 === transList_arr ? '运输公司' : '门市部门',
                        attributiondepartment: '',
                        mode: '',
                        goodsname: key,
                        suttle: 0,
                        num: 0,
                        total: 0,
                        payarrears: 0,
                        residual_air_weight: 0,
                        residual_air_total: 0
                    };
                }
            });

            Object.keys(obj2).forEach(key => {
                if (!obj1.hasOwnProperty(key)) {
                    obj1[key] = {
                        department: obj1 === transList_arr ? '运输公司' : '门市部门',
                        attributiondepartment: '',
                        mode: '',
                        goodsname: key,
                        suttle: 0,
                        num: 0,
                        total: 0,
                        payarrears: 0,
                        residual_air_weight: 0,
                        residual_air_total: 0
                    };
                }
            });
        }

        const transList_arr = {}
        const marketList_arr = {}
        const zlist_sum = {}
        list?.sales?.forEach(row => {

            // asuttle: (parseFloat(row.suttle) - parseFloat(row.residual_air_weight)).toFixed(2),
            // atotal: (parseFloat(row.payarrears) - parseFloat(row.payarrears) / 1.09).toFixed(2),
            // notaxincome: (parseFloat(row.payarrears) / 1.09).toFixed(2),

            // const asuttle = (parseFloat(row.suttle) - parseFloat(row.residual_air_weight)).toFixed(2);
            // const atotal = (parseFloat(row.payarrears) - parseFloat(row.payarrears) / 1.09).toFixed(2);
            // const notaxincome = (parseFloat(row.payarrears) / 1.09).toFixed(2);
            if (zlist_sum.hasOwnProperty(row.goodsname)) {

                zlist_sum[row.goodsname].num += parseFloat(row.num);
                zlist_sum[row.goodsname].total = (parseFloat(zlist_sum[row.goodsname].total) + parseFloat(row.total)).toFixed(2);
                zlist_sum[row.goodsname].residual_air_weight = (parseFloat(zlist_sum[row.goodsname].residual_air_weight) + parseFloat(row.residual_air_weight)).toFixed(3);
                zlist_sum[row.goodsname].residual_air_total = (parseFloat(zlist_sum[row.goodsname].residual_air_total) + parseFloat(row.residual_air_total)).toFixed(2);
                zlist_sum[row.goodsname].suttle = (parseFloat(zlist_sum[row.goodsname].suttle) + parseFloat(row.suttle)).toFixed(2);
                // zlist_sum[row.goodsname].payarrears = (parseFloat(zlist_sum[row.goodsname].payarrears) + parseFloat(row.payarrears)).toFixed(2);
                // zlist_sum[row.goodsname].atotal = (parseFloat(zlist_sum[row.goodsname].atotal) + parseFloat(row.payarrears) - parseFloat(row.payarrears) / 1.09).toFixed(2);
                // zlist_sum[row.goodsname].asuttle = (parseFloat(zlist_sum[row.goodsname].asuttle) + parseFloat(row.suttle) - parseFloat(row.residual_air_weight)).toFixed(2);
                // zlist_sum[row.goodsname].notaxincome = (parseFloat(zlist_sum[row.goodsname].notaxincome) + parseFloat(row.payarrears) / 1.09).toFixed(2);
                zlist_sum[row.goodsname].payarrears = (parseFloat(zlist_sum[row.goodsname].payarrears) + parseFloat(row.payarrears)).toFixed(2);
             } else {
                zlist_sum[row.goodsname] = {
                    // <td>{item.goodsname}</td>
                    // <td>{item.num}</td>
                    // <td>{item.suttle}</td>
                    // <td>{item.residual_air_weight}</td>
                    // <td>{item.suttle - item.residual_air_weight}</td>
                    // <td>{item.payarrears}</td>
                    // <td>{(item.payarrears / 1.09).toFixed(2)}</td>
                    // <td>{(item.payarrears - item.payarrears / 1.09).toFixed(2)}</td>

                    department: row.department,
                    attributiondepartment: row.attributiondepartment,
                    mode: row.mode,
                    goodsname: row.goodsname,
                    suttle: row.suttle,

                    num: (row.num) * 1,
                    total: parseFloat(row.total).toFixed(2),
                    payarrears: parseFloat(row.payarrears),
                    residual_air_weight: parseFloat(row.residual_air_weight).toFixed(3),
                    residual_air_total: parseFloat(row.residual_air_total).toFixed(2),



                };
            }

            // 实际销售重量 = row.suttle - row.residual_air_weight
            // 不含税收入 = row.payarrears / 1.09
            // 税额 = row.payarrears - row.payarrears / 1.09
            // Object.values(zlist_sum).forEach(item => {
            //     item.asuttle = (parseFloat(item.suttle) - parseFloat(item.residual_air_weight)).toFixed(2);
            //     item.atotal = (parseFloat(item.payarrears) - parseFloat(item.payarrears) / 1.09).toFixed(2);
            //     item.notaxincome = (parseFloat(item.payarrears) / 1.09).toFixed(2);
            // })

            if (row.department === '运输公司') {

                if (transList_arr.hasOwnProperty(row.goodsname)) {
                    transList_arr[row.goodsname].num += parseFloat(row.num);
                    transList_arr[row.goodsname].total = (parseFloat(transList_arr[row.goodsname].total) + parseFloat(row.total)).toFixed(2);
                    transList_arr[row.goodsname].residual_air_weight = (parseFloat(transList_arr[row.goodsname].residual_air_weight) + parseFloat(row.residual_air_weight)).toFixed(3);
                    transList_arr[row.goodsname].residual_air_total = (parseFloat(transList_arr[row.goodsname].residual_air_total) + parseFloat(row.residual_air_total)).toFixed(2);
                    transList_arr[row.goodsname].suttle = (parseFloat(transList_arr[row.goodsname].suttle) + parseFloat(row.suttle)).toFixed(2);
                    transList_arr[row.goodsname].payarrears = (parseFloat(transList_arr[row.goodsname].payarrears) + parseFloat(row.payarrears)).toFixed(2);

                } else {
                    transList_arr[row.goodsname] = {
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

            } else {
                if (marketList_arr.hasOwnProperty(row.goodsname)) {
                    marketList_arr[row.goodsname].num += parseFloat(row.num);
                    marketList_arr[row.goodsname].total = (parseFloat(marketList_arr[row.goodsname].total) + parseFloat(row.total)).toFixed(2);
                    marketList_arr[row.goodsname].residual_air_weight = (parseFloat(marketList_arr[row.goodsname].residual_air_weight) + parseFloat(row.residual_air_weight)).toFixed(3);
                    marketList_arr[row.goodsname].residual_air_total = (parseFloat(marketList_arr[row.goodsname].residual_air_total) + parseFloat(row.residual_air_total)).toFixed(2);
                    marketList_arr[row.goodsname].suttle = (parseFloat(marketList_arr[row.goodsname].suttle) + parseFloat(row.suttle)).toFixed(2);
                    marketList_arr[row.goodsname].payarrears = (parseFloat(marketList_arr[row.goodsname].payarrears) + parseFloat(row.payarrears)).toFixed(2);

                } else {
                    marketList_arr[row.goodsname] = {
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

            }
        });
        // console.log('transList_arr', transList_arr);
        // console.log('marketList_arr', marketList_arr);

        ensureSameKeys(transList_arr, marketList_arr);

        // // 保证两个数组长度一致
        // if (Object.keys(transList_arr).length > Object.keys(marketList_arr).length) {
        //     Object.keys(transList_arr).forEach(key => {
        //         if (!marketList_arr.hasOwnProperty(key)) {
        //             marketList_arr[key] = {
        //                 department: '门市部门',
        //                 attributiondepartment: '',
        //                 mode: '',
        //                 goodsname: key,
        //                 suttle: 0,
        //                 num: 0,
        //                 total: 0,
        //                 payarrears: 0,
        //                 residual_air_weight: 0,
        //                 residual_air_total: 0
        //             }
        //         }
        //     })
        // } else {
        //     Object.keys(marketList_arr).forEach(key => {
        //         if (!transList_arr.hasOwnProperty(key)) {
        //             transList_arr[key] = {
        //                 department: '运输公司',
        //                 attributiondepartment: '',
        //                 mode: '',
        //                 goodsname: key,
        //                 suttle: 0,
        //                 num: 0,
        //                 total: 0,
        //                 payarrears: 0,
        //                 residual_air_weight: 0,
        //                 residual_air_total: 0
        //             }
        //         }
        //     })
        // }
        console.log('transList_arr', transList_arr);
        console.log('marketList_arr', marketList_arr);

        setTransList(Object.values(transList_arr));
        setMarketList(Object.values(marketList_arr));
        setzlist(Object.values(zlist_sum));


        // 循环list.receivedmontharrears 按照部门分组
        let receivedmontharrears_arr = [
            [],
            []
        ];
        list?.receivedmontharrears?.forEach(item => {
            //           <td>{item.memberid}</td>
            // <td>{item.workplace}</td>
            // <td>{item.goodsname}</td>
            // <td>{item.num}</td>
            // <td>{item.pay_arrears}</td>
            // <td>{item.residual_air_weight}</td>
            // <td>{item.suttle * item.num - item.residual_air_weight}</td>
            // <td>{item.residual_air_total}</td>
            // <td>{item.pay_arrears - item.residual_air_total}</td>
            // <td>{item.collection_date.substr(0, 10)}</td>
            let data = {
                memberid: item.memberid,
                workplace: item.workplace,
                goodsname: item.goodsname,
                num: item.num,
                pay_arrears: parseFloat(item.pay_arrears).toFixed(2),
                residual_air_weight: parseFloat(item.residual_air_weight).toFixed(3),
                residual_air_total: parseFloat(item.residual_air_total).toFixed(2),
                collection_date: item.collection_date.substr(0, 10),
                //实际重量 = item.suttle * item.num - item.residual_air_weight
                //实际金额 = item.pay_arrears - item.residual_air_total
                actual_weight: (item.suttle * item.num - item.residual_air_weight).toFixed(3),
                actual_total: (item.pay_arrears - item.residual_air_total).toFixed(2),
                suttle: item.suttle
            }
            if (item.department === '运输公司') {
                receivedmontharrears_arr[0].push(data);
            } else {
                receivedmontharrears_arr[1].push(data);
            }
        });


        setReceivedmontharrears(Object.values(receivedmontharrears_arr));
        console.log('receivedmontharrears_arr', receivedmontharrears_arr);


    }, [list])


    // hjbykeys     求和
    const hjbykeys = (arr, keys, num = 2) => {
        let sum = 0 // 总和
        arr.forEach(item => {
            if (item[keys]) {
                sum += parseFloat(item[keys])

            }
        })
        return sum.toFixed(num)
    }

    const groupBy = (data) => {
        let arr = data.reduce((acc, item) => {
            // <td>{item.memberid}</td>
            // <td>{item.workplace}</td>
            // <td>{item.goodsname}</td>
            // <td>{item.num}</td>
            // <td>{item.pay_arrears}</td>
            // <td>{item.residual_air_weight}</td>
            // <td>{item.actual_weight}</td>
            // <td>{item.residual_air_total}</td>
            // <td>{item.actual_total}</td>
            const key = `${item.memberid}-${item.workplace}-${item.goodsname}`;
            if (!acc[key]) {
                acc[key] = {
                    memberid: item.memberid,
                    workplace: item.workplace,
                    goodsname: item.goodsname,
                    num: 0,
                    pay_arrears: 0,
                    residual_air_weight: 0,
                    actual_weight: 0,
                    residual_air_total: 0,
                    actual_total: 0,


                };
            }
            acc[key].num += parseFloat(item.num);
            acc[key].pay_arrears += parseFloat(item.pay_arrears);
            acc[key].residual_air_weight += parseFloat(item.residual_air_weight);
            acc[key].actual_weight += parseFloat(item.actual_weight);
            acc[key].residual_air_total += parseFloat(item.residual_air_total);
            acc[key].actual_total += parseFloat(item.actual_total);

            return acc;
        }, {});
        return Object.values(arr);
    }


    return (
        <div>
            <table className="my-table">
                <thead>
                <tr>
                    <th colSpan={12}>南宁三燃燃气有限责任公司商用气销售报表</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={6}>运输公司发出：
                        销售金额 {(hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2)).toFixed(2)} 元
                    </td>
                    <td colSpan={6}>门市部门发出：
                        收回大户欠款 {(hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2)).toFixed(2)} 元
                    </td>
                </tr>
                {/* 商品名称	数量	折公斤	换气金额	退残重量	退残金额 */}
                <tr>
                    <td>商品名称</td>
                    <td>数量</td>
                    <td>折公斤</td>
                    <td>换气金额</td>
                    <td>退残重量</td>
                    <td>退残金额</td>
                    <td>商品名称</td>
                    <td>数量</td>
                    <td>折公斤</td>
                    <td>换气金额</td>
                    <td>退残重量</td>
                    <td>退残金额</td>
                </tr>
                {/* 2KG液化气	29	348	3182	0	0	12KG液化气	358	4296	39261	0	0 */}
                {
                    transList.map((item, index) =>
                        <tr>
                            <td>{item.goodsname}</td>
                            <td>{item.num}</td>
                            <td>{parseFloat(item.suttle - item.residual_air_weight).toFixed(4)}</td>
                            <td>{parseFloat(item.total- item.residual_air_total).toFixed(2)}</td>
                            <td>{item.residual_air_weight}</td>
                            <td>{item.residual_air_total}</td>


                            <td>{marketList[index].goodsname}</td>
                            <td>{marketList[index].num}</td>
                            <td>{parseFloat(marketList[index].suttle - marketList[index].residual_air_weight).toFixed(4)}</td>
                            <td>{parseFloat(marketList[index].total - marketList[index].residual_air_total).toFixed(2)}</td>

                            <td>{marketList[index].residual_air_weight}</td>
                            <td>{marketList[index].residual_air_total}</td>


                        </tr>
                    )


                }

                 <tr>
                    <td>合计</td>
                    <td>{hjbykeys(transList, 'num')}</td>
                    <td>{(hjbykeys(transList, 'suttle', 4) -hjbykeys(transList, 'residual_air_weight', 4)).toFixed(4) }</td>
                    <td>{(hjbykeys(transList, 'total') - hjbykeys(transList, 'residual_air_total')).toFixed(2)}</td>
                    <td>{hjbykeys(transList, 'residual_air_weight', 4)}</td>
                    <td>{hjbykeys(transList, 'residual_air_total')}</td>
                    <td>合计</td>
                    <td>{hjbykeys(marketList, 'num')}</td>
                    <td>{(hjbykeys(marketList, 'suttle', 4) - hjbykeys(marketList, 'residual_air_weight', 4)).toFixed(4)}</td>
                    <td>{(hjbykeys(marketList, 'total') - hjbykeys(marketList, 'residual_air_total')).toFixed(2)}</td>
                    <td>{hjbykeys(marketList, 'residual_air_weight', 3)}</td>
                    <td>{hjbykeys(marketList, 'residual_air_total')}</td>

                </tr>
                <tr>
                    <td colSpan={6}>
                        <div>折斤（不含退残重量）:{(hjbykeys(transList, 'suttle', 3) - hjbykeys(transList, 'residual_air_weight', 4)).toFixed(3)}公斤</div>

                        <div>换气金额（不含退残液金额）:{(hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2)).toFixed(2)}元</div>

                        <div> 不含税收入:{(((hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2))) / 1.09).toFixed(2)} 元</div>

                        <div>增值税:{(((hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2))) - ((hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2))) / 1.09).toFixed(2)} 元</div>
                    </td>
                    <td colSpan={6}>
                        <div>折斤（不含退残重量）:{(hjbykeys(marketList, 'suttle', 3) - hjbykeys(marketList, 'residual_air_weight', 4)).toFixed(4)}公斤</div>

                        <div>换气金额（不含退残液金额）:{(hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2)).toFixed(2)}元</div>

                        <div> 不含税收入:{((hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2)) / 1.09).toFixed(2)} 元</div>

                        <div>增值税:{((hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2)) - (hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2)) / 1.09).toFixed(2)} 元</div>
                    </td>
                </tr>
                {/* 合计收款金额： 666228.04 元 合计换气折斤： 76423.5 公斤 */}
                <tr>
                    <td colSpan={12}>合计收款金额：
                        {(parseFloat(hjbykeys(transList, 'total', 2) - hjbykeys(transList, 'residual_air_total', 2)) + parseFloat(hjbykeys(marketList, 'total', 2) - hjbykeys(marketList, 'residual_air_total', 2))).toFixed(2)}
                        元 合计换气折斤：
                        {(parseFloat(hjbykeys(transList, 'suttle', 4) - hjbykeys(transList, 'residual_air_weight', 4)) + parseFloat(hjbykeys(marketList, 'suttle', 4) - hjbykeys(marketList, 'residual_air_weight', 4))).toFixed(3)}
                        公斤
                    </td>
                </tr>
                </tbody>
            </table>


            <br/>
            <table className="my-table">
                <thead>
                <tr>
                    <th colSpan={10}>商用气已收欠款统计表(运输公司)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    {/* //序号	卡号	单位	商品名称	数量	应收款	退残重	实际重量	退残金额	结款金额*/}

                    <td>序号</td>
                    <td>卡号</td>
                    <td>单位</td>
                    <td>商品名称</td>
                    <td>数量</td>
                    <td>应收款</td>
                    <td>退残重</td>
                    <td>实际重量</td>
                    <td>退残金额</td>
                    <td>结款金额</td>
                    {/*<td>结款日期</td>*/}
                </tr>

                {

                    groupBy(receivedmontharrears[0])?.map((item, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.memberid}</td>
                            <td>{item.workplace}</td>
                            <td>{item.goodsname}</td>
                            <td>{item.num}</td>
                            <td>{item.pay_arrears.toFixed(2)}</td>
                            <td>{item.residual_air_weight.toFixed(4)}</td>
                            <td>{item.actual_weight.toFixed(4)}</td>
                            <td>{item.residual_air_total.toFixed(2)}</td>
                            <td>{item.actual_total.toFixed(2)}</td>
                            {/*<td>{item.collection_date.substr(0, 10)}</td>*/}
                        </tr>
                    )
                }
                <tr>
                    <td>合计</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{hjbykeys(receivedmontharrears[0], 'num')}</td>
                    <td>{hjbykeys(receivedmontharrears[0], 'pay_arrears')}</td>
                    <td>{hjbykeys(receivedmontharrears[0], 'residual_air_weight', 3)}</td>
                    <td>{hjbykeys(receivedmontharrears[0], 'actual_weight', 3)}</td>
                    <td>{hjbykeys(receivedmontharrears[0], 'residual_air_total')}</td>
                    <td>{hjbykeys(receivedmontharrears[0], 'actual_total')}</td>

                </tr>
                </tbody>

            </table>

            <br/>
            <table className="my-table">
                <thead>
                <tr>
                    <th colSpan={10}>商用气已收欠款统计表(门店)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    {/* //序号	卡号	单位	商品名称	数量	应收款	退残重	实际重量	退残金额	结款金额*/}

                    <td>序号</td>
                    <td>卡号</td>
                    <td>单位</td>
                    <td>商品名称</td>
                    <td>数量</td>
                    <td>应收款</td>
                    <td>退残重</td>
                    <td>实际重量</td>
                    <td>退残金额</td>
                    <td>结款金额</td>
                    {/*<td>结款日期</td>*/}
                </tr>

                {

                    groupBy(receivedmontharrears[1])?.map((item, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.memberid}</td>
                            <td>{item.workplace}</td>
                            <td>{item.goodsname}</td>
                            <td>{item.num}</td>
                            <td>{item.pay_arrears.toFixed(2)}</td>
                            <td>{item.residual_air_weight.toFixed(4)}</td>
                            <td>{item.actual_weight.toFixed(4)}</td>
                            <td>{item.residual_air_total.toFixed(2)}</td>
                            <td>{item.actual_total.toFixed(2)}</td>
                            {/*<td>{item.collection_date.substr(0, 10)}</td>*/}
                        </tr>
                    )
                }
                <tr>
                    <td>合计</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{hjbykeys(receivedmontharrears[1], 'num')}</td>
                    <td>{hjbykeys(receivedmontharrears[1], 'pay_arrears')}</td>
                    <td>{hjbykeys(receivedmontharrears[1], 'residual_air_weight', 3)}</td>
                    <td>{hjbykeys(receivedmontharrears[1], 'actual_weight', 3)}</td>
                    <td>{hjbykeys(receivedmontharrears[1], 'residual_air_total')}</td>
                    <td>{hjbykeys(receivedmontharrears[1], 'actual_total')}</td>

                </tr>
                </tbody>

            </table>


            <br/>
            <table className="my-table">
                <thead>
                <tr>
                    <th colSpan={8}>商用气销售明细</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    {/* 商品名称	数量	销售重量	残液重量	实际销售重量	换气金额	不含税收入	增值税 */}
                    <td>商品名称</td>
                    <td>数量</td>
                    <td>销售重量</td>
                    <td>残液重量</td>
                    <td>实际销售重量</td>
                    <td>换气金额</td>
                    <td>不含税收入</td>
                    <td>增值税</td>
                </tr>
                {
                    zlist_arr.map((item, index) =>
                        <tr key={index}>
                            <td>{item.goodsname}</td>
                            <td>{item.num}</td>
                            <td>{item.suttle}</td>
                            <td>{item.residual_air_weight}</td>
                            <td>{(item.suttle - item.residual_air_weight).toFixed(4)}</td>
                            <td>{(item.payarrears - item.residual_air_total).toFixed(2)}</td>

                            <td>{((item.payarrears - item.residual_air_total) / 1.09).toFixed(2)}</td>
                            <td>{((item.payarrears - item.residual_air_total) - (item.payarrears - item.residual_air_total) / 1.09).toFixed(2)}</td>
                        </tr>
                    )
                }
                <tr>
                    <td>合计</td>
                    <td>{hjbykeys(zlist_arr, 'num')}</td>
                    <td>{hjbykeys(zlist_arr, 'suttle')}</td>
                    <td>{hjbykeys(zlist_arr, 'residual_air_weight')}</td>
                    <td>{parseFloat(hjbykeys(zlist_arr, 'suttle', 4) - hjbykeys(zlist_arr,'residual_air_weight')).toFixed(4) }</td>
                    <td>{(hjbykeys(zlist_arr, 'payarrears') - hjbykeys(zlist_arr, 'residual_air_total')).toFixed(2)}</td>
                    <td>{((hjbykeys(zlist_arr, 'payarrears') - hjbykeys(zlist_arr, 'residual_air_total')) / 1.09).toFixed(2)}</td>
                    <td>{((hjbykeys(zlist_arr, 'payarrears') - hjbykeys(zlist_arr, 'residual_air_total')) - (hjbykeys(zlist_arr, 'payarrears') - hjbykeys(zlist_arr, 'residual_air_total')) / 1.09).toFixed(2)}</td>


                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BuinessSalesReport;