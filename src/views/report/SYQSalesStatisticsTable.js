import React, { useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import { filter } from 'cheerio/lib/api/traversing';


const SyqSalesStatisticsTable = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    function reformatData(rawData) {
        const newStructure = {};
        for (let item of rawData) {
            if (!newStructure[item.salesman]) {
                newStructure[item.salesman] = {
                    salesman: item.salesman,
                    storepayweight: 0,
                    storepaymoney: 0,
                    storepayresidualweight: 0,// 门店提付残液折吨
                    storefixedweight: 0,
                    storefixedmoney: 0,
                    storefixedresidualweight: 0,// 门店定付残液折吨

                    transportpayweight: 0,
                    transportpaymoney: 0,
                    transportpayresidualweight: 0,// 运输公司提付残液折吨
                    transportfixedweight: 0,
                    transportfixedmoney: 0,
                    transportfixedresidualweight: 0,// 运输公司定付残液折吨
                    cpyqweight: 0, //存瓶余气重量
                    cpyqmoney: 0, //存瓶余气金额
                    tpyqweight: 0, //退瓶余气重量
                    tpyqmoney: 0, //退瓶余气金额



                    totalweight: 0,
                    totalmoney: 0
                };
            }
            if (item.department !== "运输公司") {
                if (item.mode != '存瓶余气' && item.mode != '退瓶余气') {



                    // 门店
                    if (item.mode === "现结") {
                        // 提付
                        newStructure[item.salesman].storepayweight += parseFloat(item.AsTon);
                        newStructure[item.salesman].storepaymoney += parseFloat(item.total);
                        newStructure[item.salesman].storepayresidualweight += parseFloat(item.residualweight);

                    } else {
                        // 定付
                        newStructure[item.salesman].storefixedweight += parseFloat(item.AsTon);
                        newStructure[item.salesman].storefixedmoney += parseFloat(item.total);
                        newStructure[item.salesman].storefixedresidualweight += parseFloat(item.residualweight);
                    }
                }
            } else {
                if (item.mode != '存瓶余气' && item.mode != '退瓶余气') {

                    // console.log(item)
                    // 运输公司
                    if (item.mode == "现结") {
                        // 提付

                        newStructure[item.salesman].transportpayweight += parseFloat(item.AsTon);
                        newStructure[item.salesman].transportpaymoney += parseFloat(item.total);
                        newStructure[item.salesman].transportpayresidualweight += parseFloat(item.residualweight);
                        // if (item.salesman == '覃锡兰') {
                        //     console.log('覃锡兰', item)
                        //     console.log('newStructure', newStructure)
                        // }
                    } else {
                        // 定付
                        newStructure[item.salesman].transportfixedweight += parseFloat(item.AsTon);
                        newStructure[item.salesman].transportfixedmoney += parseFloat(item.total);
                        newStructure[item.salesman].transportfixedresidualweight += parseFloat(item.residualweight);

                    }
                }
            }
            if (item.mode === '存瓶余气') {
                newStructure[item.salesman].cpyqweight += parseFloat(item.residualweight);
                newStructure[item.salesman].cpyqmoney += parseFloat(item.total);
            }

            if (item.mode === '退瓶余气') {
                newStructure[item.salesman].tpyqweight += parseFloat(item.residualweight);
                newStructure[item.salesman].tpyqmoney += parseFloat(item.total);
            }



            newStructure[item.salesman].totalweight += (parseFloat(item.AsTon) - parseFloat(item.residualweight));
            newStructure[item.salesman].totalmoney += parseFloat(item.total);
        }

        for (let salesman in newStructure) {
            newStructure[salesman].storepayweight = parseFloat(newStructure[salesman].storepayweight.toFixed(4));
            newStructure[salesman].storepaymoney = parseFloat(newStructure[salesman].storepaymoney.toFixed(2));
            newStructure[salesman].storepayresidualweight = parseFloat(newStructure[salesman].storepayresidualweight.toFixed(4));


            newStructure[salesman].storefixedweight = parseFloat(newStructure[salesman].storefixedweight.toFixed(4));
            newStructure[salesman].storefixedmoney = parseFloat(newStructure[salesman].storefixedmoney.toFixed(2));
            newStructure[salesman].storefixedresidualweight = parseFloat(newStructure[salesman].storefixedresidualweight.toFixed(4));


            newStructure[salesman].transportpayweight = parseFloat(newStructure[salesman].transportpayweight.toFixed(4));
            newStructure[salesman].transportpaymoney = parseFloat(newStructure[salesman].transportpaymoney.toFixed(2));
            newStructure[salesman].transportpayresidualweight = parseFloat(newStructure[salesman].transportpayresidualweight.toFixed(4));
            newStructure[salesman].transportfixedweight = parseFloat(newStructure[salesman].transportfixedweight.toFixed(4));
            newStructure[salesman].transportfixedmoney = parseFloat(newStructure[salesman].transportfixedmoney.toFixed(2));
            newStructure[salesman].transportfixedresidualweight = parseFloat(newStructure[salesman].transportfixedresidualweight.toFixed(4));

            newStructure[salesman].cpyqweight = parseFloat(newStructure[salesman].cpyqweight.toFixed(4));
            newStructure[salesman].cpyqmoney = parseFloat(newStructure[salesman].cpyqmoney.toFixed(2));
            newStructure[salesman].tpyqweight = parseFloat(newStructure[salesman].tpyqweight.toFixed(4));
            newStructure[salesman].tpyqmoney = parseFloat(newStructure[salesman].tpyqmoney.toFixed(2));

            newStructure[salesman].totalweight = parseFloat(newStructure[salesman].totalweight.toFixed(4));
            newStructure[salesman].totalmoney = parseFloat(newStructure[salesman].totalmoney.toFixed(2));
        }

        return Object.values(newStructure);
    }

    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商用气销量统计</Box>

            <Form onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Manage_Infos.SyqSalesStatisticsTable',
                    ...e,
                    salesman: JSON.stringify(e.salesman)
                })
                // let arr = [{
                //     // <td>业务员</td>
                //     // <td>门店提付销量（吨）</td>
                //     // <td>门店提付销售金额（元）</td>
                //     // <td>门店定付销量（吨）</td>
                //     // <td>门店定付销售金额（元）</td>
                //     // <td>运输公司提付销量（吨）</td>
                //     // <td>运输公司提付销售金额（元）</td>
                //     // <td>运输公司定付销量（吨）</td>
                //     // <td>运输公司定付销售金额（元）</td>
                //     // <td>销量合计（吨）</td>
                //     // <td>销售金额合计（元）</td>
                //     salesman: '',
                //     storepayweight: 0,
                //     storepaymoney: 0,
                //     storefixedweight: 0,
                //     storefixedmoney: 0,
                //     transportpayweight: 0,
                //     transportpaymoney: 0,
                //     transportfixedweight: 0,
                //     transportfixedmoney: 0,
                //     totalweight: 0,
                //     totalmoney: 0,


                // }]

                // rew.data.info.forEach(item => {
                //     // item = {
                //     //     "mode": "现结",
                //     //     "salesman": "徐小凤",
                //     //     "department": "安吉店",
                //     //     "total": "113.0000",
                //     //     "AsTon": "0.012",
                //     //     "residualgas": "0.0"
                //     // }
                //     let index = arr.findIndex(i => i.salesman === item.salesman)
                //     if (index === -1) {
                //         arr.push({
                //             salesman: item.salesman,
                //             storepayweight: item.mode === '现结' ? item.total : 0,
                //             storepaymoney: item.mode === '现结' ? item.total : 0,
                //             storefixedweight: item.mode === '月结' ? item.total : 0,
                //             storefixedmoney: item.mode === '月结' ? item.total : 0,
                //             transportpayweight: item.mode === '现结' ? item.total : 0,
                //             transportpaymoney: item.mode === '现结' ? item.total : 0,
                //             transportfixedweight: item.mode === '月结' ? item.total : 0,
                //             transportfixedmoney: item.mode === '月结' ? item.total : 0,
                //             totalweight: item.total,
                //             totalmoney: item.total,
                //         })
                //     } else {
                //         arr[index].storepayweight += item.mode === '现结' ? item.total : 0
                //         arr[index].storepaymoney += item.mode === '现结' ? item.total : 0
                //         arr[index].storefixedweight += item.mode === '月结' ? item.total : 0
                //         arr[index].storefixedmoney += item.mode === '月结' ? item.total : 0
                //         arr[index].transportpayweight += item.mode === '现结' ? item.total : 0
                //         arr[index].transportpaymoney += item.mode === '现结' ? item.total : 0
                //         arr[index].transportfixedweight += item.mode === '月结' ? item.total : 0
                //         arr[index].transportfixedmoney += item.mode === '月结' ? item.total : 0
                //         arr[index].totalweight += item.total
                //         arr[index].totalmoney += item.total
                //     }
                // })
                // setList(arr)
                //
                const arr = reformatData(rew.data.info)
                console.log(arr)
                if (arr.length) {
                    // { headerName: '业务员', field: 'salesman', width: 120 },
                    // { headerName: '门店提付销量（吨）', field: 'storepayweight', width: 120 },
                    // { headerName: '门店提付余气（吨）', field: 'storepayresidualweight', width: 120 },
                    // { headerName: '门店提付销售金额（元）', field: 'storepaymoney', width: 120 },

                    // { headerName: '门店定付销量（吨）', field: 'storefixedweight', width: 120 },
                    // { headerName: '门店定付余气（吨）', field: 'storefixedresidualweight', width: 120 },
                    // { headerName: '门店定付销售金额（元）', field: 'storefixedmoney', width: 120 },


                    // { headerName: '运输公司提付销量（吨）', field: 'transportpayweight', width: 120 },
                    // { headerName: '运输公司提付余气（吨）', field: 'transportpayresidualweight', width: 120 },
                    // { headerName: '运输公司提付销售金额（元）', field: 'transportpaymoney', width: 120 },



                    // { headerName: '运输公司定付销量（吨）', field: 'transportfixedweight', width: 120 },
                    // { headerName: '运输公司定付余气（吨）', field: 'transportfixedresidualweight', width: 120 },
                    // { headerName: '运输公司定付销售金额（元）', field: 'transportfixedmoney', width: 120 },
                    // { headerName: '销量合计（吨）', field: 'totalweight', width: 120 },
                    // { headerName: '销售金额合计（元）', field: 'totalmoney', width: 120 },
                    arr.push({
                        salesman: '合计',
                        storepayweight: arr.reduce((total, item) => total + item.storepayweight, 0).toFixed(4),
                        storepayresidualweight: arr.reduce((total, item) => total + item.storepayresidualweight, 0).toFixed(4),
                        storepaymoney: arr.reduce((total, item) => total + item.storepaymoney, 0).toFixed(2),
                        storefixedweight: arr.reduce((total, item) => total + item.storefixedweight, 0).toFixed(3),
                        storefixedresidualweight: arr.reduce((total, item) => total + item.storefixedresidualweight, 0).toFixed(4),
                        storefixedmoney: arr.reduce((total, item) => total + item.storefixedmoney, 0).toFixed(2),
                        transportpayweight: arr.reduce((total, item) => total + item.transportpayweight, 0).toFixed(4),
                        transportpayresidualweight: arr.reduce((total, item) => total + item.transportpayresidualweight, 0).toFixed(4),
                        transportpaymoney: arr.reduce((total, item) => total + item.transportpaymoney, 0).toFixed(2),
                        transportfixedweight: arr.reduce((total, item) => total + item.transportfixedweight, 0).toFixed(4),
                        transportfixedresidualweight: arr.reduce((total, item) => total + item.transportfixedresidualweight, 0).toFixed(4),
                        transportfixedmoney: arr.reduce((total, item) => total + item.transportfixedmoney, 0).toFixed(2),
                        tpyqweight: arr.reduce((total, item) => total + item.tpyqweight, 0).toFixed(4),
                        tpyqmoney: arr.reduce((total, item) => total + item.tpyqmoney, 0).toFixed(2),
                        cpyqweight: arr.reduce((total, item) => total + item.cpyqweight, 0).toFixed(4),
                        cpyqmoney: arr.reduce((total, item) => total + item.cpyqmoney, 0).toFixed(2),
                        totalweight: arr.reduce((total, item) => total + item.totalweight, 0).toFixed(4),
                        totalmoney: arr.reduce((total, item) => total + item.totalmoney, 0).toFixed(2)
                    })
                }

                setList(arr)

            }} layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />

                <Form.Select label={'归属部门'} filter field={'attributiondepartmentid'} >
                    {
                        initData.DepartmentList.filter(item => item.manage_users == 1).map(item =>
                            <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>

                        )
                    }
                </Form.Select>
                {/* 
                <Form.Select label={'业务员'} multiple maxTagCount={3} field={'salesman'} >
                    {
                        initData.OperatorList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                </Form.Select>

 */}


                <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box height={'60vh'} mt={3} overflow={"scroll"}>

                {/* <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName:'方式',field: 'mode'},
                        {headerName:'业务员',field: 'salesman'},
                        {headerName:'部门',field: 'department'},
                        {headerName:'折吨',field: 'AsTon'},
                        {headerName:'余气',field: 'residualgas'},
                        // {headerName:'地址',field: 'address'},
                        // {headerName:'楼层',field: 'floor'},
                        // {headerName:'超远补贴',field: 'addresssubsidy'},
                        // {headerName:'归属部门',field: 'attributiondepartment'},
                        // {headerName:'业务员',field: 'salesman'},
                        // {headerName:'商品',field: 'goodsname'},
                        // {headerName:'数量',field: 'num'},
                        // {headerName:'小计',field: 'total'},
                        // {headerName:'平均单价',field: 'averageunitprice'},
                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    onFirstDataRendered={e=>e.api.sizeColumnsToFit()}
                /> */}

                <Box height={'60vh'} overflow={'scroll'}>
                    <AgGridReact
                        className='ag-theme-balham'
                        rowData={list}
                        columnDefs={[
                            { headerName: '业务员', field: 'salesman', width: 120 },
                            { headerName: '门店提付销量（吨）', field: 'storepayweight', width: 120 },
                            { headerName: '门店提付余气（吨）', field: 'storepayresidualweight', width: 120 },
                            { headerName: '门店提付销售金额（元）', field: 'storepaymoney', width: 120 },

                            { headerName: '门店定付销量（吨）', field: 'storefixedweight', width: 120 },
                            { headerName: '门店定付余气（吨）', field: 'storefixedresidualweight', width: 120 },
                            { headerName: '门店定付销售金额（元）', field: 'storefixedmoney', width: 120 },


                            { headerName: '运输公司提付销量（吨）', field: 'transportpayweight', width: 120 },
                            { headerName: '运输公司提付余气（吨）', field: 'transportpayresidualweight', width: 120 },
                            { headerName: '运输公司提付销售金额（元）', field: 'transportpaymoney', width: 120 },



                            { headerName: '运输公司定付销量（吨）', field: 'transportfixedweight', width: 120 },
                            { headerName: '运输公司定付余气（吨）', field: 'transportfixedresidualweight', width: 120 },
                            { headerName: '运输公司定付销售金额（元）', field: 'transportfixedmoney', width: 120 },

                            { headerName: '存瓶余气重量（吨）', field: 'cpyqweight', width: 120 },
                            { headerName: '存瓶余气金额（元）', field: 'cpyqmoney', width: 120 },
                            // { headerName: '退余气重量（吨）', field: 'tpyqweight', width: 120 },
                            // { headerName: '退瓶余气金额（元）', field: 'tpyqmoney', width: 120 },
                            { headerName: '销量合计（吨）', field: 'totalweight', width: 120 },
                            // { headerName: '销售金额合计（元）', field: 'totalmoney', width: 120 },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                    />

                </Box>
                {/* <table className="my-table">
                    <thead>
                        <tr>

                            <td>业务员</td>
                            <td>门店提付销量（吨）</td>
                            <td>门店提付销售金额（元）</td>
                            <td>门店定付销量（吨）</td>
                            <td>门店定付销售金额（元）</td>
                            <td>运输公司提付销量（吨）</td>
                            <td>运输公司提付销售金额（元）</td>
                            <td>运输公司定付销量（吨）</td>
                            <td>运输公司定付销售金额（元）</td>
                            <td>销量合计（吨）</td>
                            <td>销售金额合计（元）</td>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            list.map(item =>
                                <tr>

                                    <td>{item.salesman}</td>
                                    <td>{item.storepayweight}</td>
                                    <td>{item.storepaymoney}</td>
                                    <td>{item.storefixedweight}</td>
                                    <td>{item.storefixedmoney}</td>
                                    <td>{item.transportpayweight}</td>
                                    <td>{item.transportpaymoney}</td>
                                    <td>{item.transportfixedweight}</td>
                                    <td>{item.transportfixedmoney}</td>
                                    <td>{item.totalweight}</td>
                                    <td>{item.totalmoney}</td>

                                </tr>
                            )
                        }
                    </tbody>

                </table> */}
            </Box>



        </Box>
    );
};

export default SyqSalesStatisticsTable;


